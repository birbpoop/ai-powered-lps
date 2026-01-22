import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Simple in-memory per-instance rate limit (best-effort): 5 requests / 60s / IP.
// Note: Edge runtimes may spin up multiple isolates; this is not globally consistent.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, number[]>();

type AnalyzeBody = {
  // Preferred: send extracted plain text from the client (especially for PDFs)
  content_text?: string;
  // Backward-compatible: for non-PDF text files you can still provide a URL
  file_url?: string;
  user_prompt?: string;
  file_type?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function safeTruncate(input: string, maxChars: number) {
  if (input.length <= maxChars) return input;
  return input.slice(0, maxChars) + "\n\n[...truncated...]";
}

async function extractTextFromUrl(fileUrl: string, fileType?: string) {
  const res = await fetch(fileUrl);
  if (!res.ok) {
    throw new Error(`Failed to fetch file: ${res.status} ${res.statusText}`);
  }

  const contentType = fileType || res.headers.get("content-type") || "";

  // PDFs must be parsed on the frontend (pdfjs-dist) and sent as plain text.
  if (contentType.includes("application/pdf")) {
    return {
      ok: false as const,
      error:
        "PDFs are not parsed on the backend. Please extract plain text on the client and send it as content_text.",
    };
  }

  const buf = await res.arrayBuffer();
  // Assume UTF-8 for now (text/csv/md)
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buf);
  return { ok: true as const, text };
}

function getClientIp(req: Request) {
  // Common proxies/CDNs
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

function isRateLimited(ip: string) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = ipHits.get(ip) ?? [];
  const recent = hits.filter((t) => t >= windowStart);
  if (recent.length >= RATE_LIMIT_MAX) {
    ipHits.set(ip, recent);
    return true;
  }
  recent.push(now);
  ipHits.set(ip, recent);
  return false;
}

function validateStorageFileUrl(fileUrl: string) {
  let url: URL;
  try {
    url = new URL(fileUrl);
  } catch {
    return { ok: false as const, reason: "Invalid URL" };
  }

  if (url.protocol !== "https:") {
    return { ok: false as const, reason: "Only HTTPS URLs are allowed" };
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  let allowedHost = "";
  try {
    allowedHost = supabaseUrl ? new URL(supabaseUrl).hostname : "";
  } catch {
    allowedHost = "";
  }

  if (!allowedHost || url.hostname !== allowedHost) {
    return { ok: false as const, reason: "URL host not allowed" };
  }

  // Only allow requests to the Storage object endpoints for this project.
  // (Supports both public and signed URLs)
  if (!url.pathname.startsWith("/storage/v1/object/")) {
    return { ok: false as const, reason: "URL path not allowed" };
  }

  return { ok: true as const };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    // Rate limit *all* POST calls (including invalid ones) by IP.
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return jsonResponse({ error: "Too many requests. Please try again in a minute." }, 429);
    }

    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Missing GEMINI_API_KEY" }, 500);
    }

    const { content_text, file_url, user_prompt, file_type } = (await req.json()) as AnalyzeBody;

    // 1) Get plain text content
    let fileContent = "";
    if (content_text && content_text.trim()) {
      fileContent = content_text;
    } else if (file_url) {
      // SSRF protection: allow only Storage URLs for this project.
      const valid = validateStorageFileUrl(file_url);
      if (!valid.ok) {
        return jsonResponse({ error: valid.reason }, 403);
      }

      const extracted = await extractTextFromUrl(file_url, file_type);
      if (!extracted.ok) {
        return jsonResponse({ error: extracted.error }, 400);
      }
      fileContent = extracted.text;
    } else {
      return jsonResponse({ error: "Missing content_text (preferred) or file_url" }, 400);
    }

    // 2) Call Gemini
    const truncated = safeTruncate(fileContent, 20_000);
    const instruction = user_prompt?.trim() || "Please summarize and extract teaching points.";

    const genAI = new GoogleGenerativeAI(apiKey);
    // Latest "Flash" model id per Google Gemini API docs (Dec 2025).
    // Note: this is a *preview* model and may have different availability/rate limits.
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const fullPrompt =
      "You are an expert educational AI assistant. Analyze the provided teaching material content and fulfill the user's specific instructions.\n\n" +
      `User Instruction:\n${instruction}\n\n---\nTarget File Content:\n${truncated}`;

    const resp = await model.generateContent(fullPrompt);
    const resultText = resp.response.text();

    return jsonResponse({ result: resultText ?? "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ error: message || "Unknown error" }, 500);
  }
});
