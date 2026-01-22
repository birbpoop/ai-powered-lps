import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.24.1";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Extreme-simplification mode:
 * - Frontend parses files (PDF/CSV/TXT/MD) into plain text.
 * - Backend ONLY accepts `{ text: string, user_prompt?: string }`.
 * - Single Gemini call (gemini-1.5-flash), no retries/backoff/fallback.
 */

type AnalyzeBody = {
  text?: string;
  user_prompt?: string;
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

function parseStrictJson(text: string) {
  try {
    return { ok: true as const, value: JSON.parse(text) };
  } catch {
    return { ok: false as const, error: "Model returned non-JSON output" };
  }
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

    const { text, user_prompt } = (await req.json()) as AnalyzeBody;
    if (!text || !text.trim()) {
      return jsonResponse({ error: "Missing text" }, 400);
    }

    // Limit max characters to 25,000 (approx. 10 pages of PDF) to prevent memory crashes
    const SAFE_TEXT_LIMIT = 25000;
    const safeText = text.slice(0, SAFE_TEXT_LIMIT);
    if (text.length > SAFE_TEXT_LIMIT) {
      console.log(`Text truncated from ${text.length} to ${SAFE_TEXT_LIMIT} chars`);
    }

    // 1) Call Gemini (single request, fail-fast)
    const instruction = user_prompt?.trim() || "請依 TBCL 規範產生課程模組 JSON。";

    const genAI = new GoogleGenerativeAI(apiKey);
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
      `User Instruction:\n${instruction}\n\n---\nTarget Text:\n${safeText}`;

    // Fail-fast strategy (no retry/backoff/fallback): single request to stable model.
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const resp = await model.generateContent(fullPrompt);
    const raw = resp.response.text() ?? "";
    const parsed = parseStrictJson(raw);
    if (!parsed.ok) {
      return jsonResponse({ error: parsed.error }, 500);
    }

    // Return the parsed JSON object directly (frontend will hydrate LessonData)
    return jsonResponse(parsed.value as AiLessonJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /\b503\b/.test(message) || /overloaded/i.test(message) ? 503 : 500;
    return jsonResponse({ error: message || "Unknown error" }, status);
  }
});
