import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AnalyzeBody = {
  content_text?: string;
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

  if (contentType.includes("application/pdf")) {
    return {
      ok: false as const,
      error: "PDFs are not parsed on the backend. Please extract plain text on the client and send it as content_text.",
    };
  }

  const buf = await res.arrayBuffer();
  const text = new TextDecoder("utf-8", { fatal: false }).decode(buf);
  return { ok: true as const, text };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const apiKey = Deno.env.get("GEMINI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Missing GEMINI_API_KEY" }, 500);
    }

    const { content_text, file_url, user_prompt, file_type } = (await req.json()) as AnalyzeBody;

    let fileContent = "";
    if (content_text && content_text.trim()) {
      fileContent = content_text;
    } else if (file_url) {
      const extracted = await extractTextFromUrl(file_url, file_type);
      if (!extracted.ok) {
        return jsonResponse({ error: extracted.error }, 400);
      }
      fileContent = extracted.text;
    } else {
      return jsonResponse({ error: "Missing content_text (preferred) or file_url" }, 400);
    }

    const truncated = safeTruncate(fileContent, 20_000);
    const instruction = user_prompt?.trim() || "Please summarize and extract teaching points.";

    const genAI = new GoogleGenerativeAI(apiKey);
    // Use gemini-3.0-flash as specified by user from Google AI Studio
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
