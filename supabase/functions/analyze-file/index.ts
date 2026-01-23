import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Extreme-simplification mode:
 * - Frontend parses files (PDF/CSV/TXT/MD) into plain text.
 * - Backend ONLY accepts `{ text: string, user_prompt?: string }`.
 * - Single Lovable AI Gateway call (gemini-3-flash-preview), no retries/backoff/fallback.
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
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Missing LOVABLE_API_KEY" }, 500);
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

    // Build prompt
    const instruction = user_prompt?.trim() || "請依 TBCL 規範產生課程模組 JSON。";

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

    const systemPrompt =
      "You are an expert Mandarin teaching assistant specialized in TBCL (Taiwan Benchmarks for the Chinese Language). " +
      "Return ONLY strict valid JSON. Do not wrap in markdown. Do not add commentary.\n\n" +
      "Your JSON MUST match this schema (keys and value types):\n" +
      jsonSchemaHint +
      "\n\nRequirements:\n" +
      "1) Estimate overall TBCL level for the text as main_level (TBCL Level 1-7).\n" +
      "2) Extract key vocabulary; assign TBCL level (1-7) per word; use 0 if unknown/proper noun.\n" +
      "3) Provide pinyin and multilingual translations (EN/JP/KR/VN) when possible.\n" +
      "4) If the input is a dialogue, populate dialogue.lines and keep essay.paragraphs minimal/empty. If it's an article, populate essay.paragraphs and keep dialogue.lines minimal/empty.\n" +
      "5) Create exactly 3 classroom activities (title + description).";

    const userMessage = `User Instruction:\n${instruction}\n\n---\nTarget Text:\n${safeText}`;

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return jsonResponse({ error: "Rate limit exceeded. Please try again later." }, 429);
      }
      if (response.status === 402) {
        return jsonResponse({ error: "Payment required. Please add credits to your Lovable workspace." }, 402);
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return jsonResponse({ error: `AI gateway error: ${response.status}` }, 500);
    }

    const aiResponse = await response.json();
    const rawContent = aiResponse.choices?.[0]?.message?.content ?? "";

    // Parse JSON from response
    const parsed = parseStrictJson(rawContent);
    if (!parsed.ok) {
      console.error("Failed to parse AI response:", rawContent.slice(0, 500));
      return jsonResponse({ error: parsed.error }, 500);
    }

    // Return the parsed JSON object directly (frontend will hydrate LessonData)
    return jsonResponse(parsed.value as AiLessonJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("analyze-file error:", message);
    const status = /\b503\b/.test(message) || /overloaded/i.test(message) ? 503 : 500;
    return jsonResponse({ error: message || "Unknown error" }, status);
  }
});
