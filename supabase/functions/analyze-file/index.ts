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

type AiLessonJson = {
  main_level?: string;
  dialogue?: {
    title?: string;
    lines?: Array<{ speaker: string; text: string }>;
    vocabulary?: Array<Record<string, unknown>>;
    grammar?: Array<Record<string, unknown>>;
  };
  essay?: {
    title?: string;
    paragraphs?: string[];
    vocabulary?: Array<Record<string, unknown>>;
    grammar?: Array<Record<string, unknown>>;
  };
  activities?: Array<{ title: string; description: string }>;
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

function extractJsonObject(text: string) {
  // Fast path
  try {
    return { ok: true as const, value: JSON.parse(text) };
  } catch {
    // Attempt to salvage first JSON object in the response
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start >= 0 && end > start) {
      const maybe = text.slice(start, end + 1);
      try {
        return { ok: true as const, value: JSON.parse(maybe) };
      } catch {
        // fall through
      }
    }
    return { ok: false as const, error: "Model returned non-JSON output" };
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isModelOverloadedError(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err);
  // The GoogleGenerativeAI SDK embeds status text in the thrown message
  return /\b503\b/.test(msg) && /overloaded/i.test(msg);
}

async function generateJsonWithRetry(opts: {
  apiKey: string;
  prompt: string;
}) {
  // Strategy:
  // 1) Try preferred preview model
  // 2) On 503 overload, retry with exponential backoff
  // 3) If still overloaded, fall back to more available models
  const models = [
    "gemini-3-flash-preview",
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
  ];

  const genAI = new GoogleGenerativeAI(opts.apiKey);

  const maxAttemptsPerModel = 3;
  for (const modelId of models) {
    for (let attempt = 1; attempt <= maxAttemptsPerModel; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelId,
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.2,
          },
        });

        const resp = await model.generateContent(opts.prompt);
        return resp.response.text() ?? "";
      } catch (err) {
        if (!isModelOverloadedError(err)) throw err;

        // Backoff + jitter: 400ms, 900ms, 1600ms (+ up to 200ms jitter)
        const base = 200;
        const backoff = base + attempt * attempt * 250;
        const jitter = Math.floor(Math.random() * 200);
        await sleep(backoff + jitter);
        continue;
      }
    }
  }

  // If we get here, all models were overloaded
  throw new Error(
    "AI model is currently overloaded. Please try again in a minute."
  );
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
    const truncated = safeTruncate(fileContent, 15_000);
    const instruction = user_prompt?.trim() || "請依 TBCL 規範產生課程模組 JSON。";

    const genAI = new GoogleGenerativeAI(apiKey);
    // Latest "Flash" model id per Google Gemini API docs (Dec 2025).
    // Note: this is a *preview* model and may have different availability/rate limits.
    const jsonSchemaHint = `{
  "main_level": "string (e.g., TBCL Level 4)",
  "dialogue": {
    "title": "string",
    "lines": [ { "speaker": "string", "text": "string" } ],
    "vocabulary": [
      {
        "word": "string",
        "pinyin": "string",
        "level": "number (1-7, use 0 if unknown)",
        "english": "string",
        "partOfSpeech": "string",
        "example": "string (complete sentence)",
        "japanese": "string",
        "korean": "string",
        "vietnamese": "string"
      }
    ],
    "grammar": [ { "pattern": "string", "level": "number", "english": "string", "example": "string" } ]
  },
  "essay": {
    "title": "string",
    "paragraphs": ["string"],
    "vocabulary": [/* same as above */],
    "grammar": [/* same as above */]
  },
  "activities": [ { "title": "string", "description": "string" } ]
}`;

    const fullPrompt =
      "You are an expert Mandarin teaching assistant specialized in TBCL (Taiwan Benchmarks for the Chinese Language). " +
      "Return ONLY strict valid JSON. Do not wrap in markdown. Do not add commentary.\n\n" +
      "Your JSON MUST match this schema (keys and value types):\n" +
      jsonSchemaHint +
      "\n\nRequirements:\n" +
      "1) Estimate overall TBCL level for the text as main_level (TBCL Level 1-7).\n" +
      "2) Extract key vocabulary; assign TBCL level (1-7) per word; use 0 if unknown/proper noun.\n" +
      "3) Provide pinyin and multilingual translations (EN/JP/KR/VN) when possible.\n" +
      "4) If the input is a dialogue, populate dialogue.lines and keep essay.paragraphs minimal/empty. If it's an article, populate essay.paragraphs and keep dialogue.lines minimal/empty.\n" +
      "5) Create exactly 3 classroom activities (title + description).\n\n" +
      `User Instruction:\n${instruction}\n\n---\nTarget Text:\n${truncated}`;

    const raw = await generateJsonWithRetry({ apiKey, prompt: fullPrompt });
    const parsed = extractJsonObject(raw);
    if (!parsed.ok) {
      return jsonResponse({ error: parsed.error }, 500);
    }

    // Return the parsed JSON object directly (frontend will hydrate LessonData)
    return jsonResponse(parsed.value as AiLessonJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    // If upstream is overloaded, return 503 so the client can present a "try again" UX.
    const status = /overloaded/i.test(message) ? 503 : 500;
    return jsonResponse({ error: message || "Unknown error" }, status);
  }
});
