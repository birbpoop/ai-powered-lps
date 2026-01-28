import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { Buffer } from "node:buffer"
import pdf from "npm:pdf-parse@1.1.1"

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
    try {
      const arrayBuffer = await res.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const pdfData = await pdf(buffer);
      return { ok: true as const, text: pdfData.text };
    } catch (pdfError) {
      console.error("PDF Parse Error:", pdfError);
      throw new Error("Failed to parse PDF.");
    }
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
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      return jsonResponse({ error: "Missing OPENAI_API_KEY" }, 500);
    }

    const { content_text, file_url, user_prompt, file_type } = (await req.json()) as AnalyzeBody;

    let fileContent = "";
    if (content_text && content_text.trim()) {
      fileContent = content_text;
    } else if (file_url) {
      const extracted = await extractTextFromUrl(file_url, file_type);
      fileContent = extracted.text;
    } else {
      return jsonResponse({ error: "Missing content_text (preferred) or file_url" }, 400);
    }

    // Maintain the 20,000 character truncation safeguard
    const truncated = safeTruncate(fileContent, 20_000);
    const instruction = user_prompt?.trim() || "Please summarize and extract teaching points.";

    // Define JSON Schema for OpenAI
    const jsonSchema = `
    {
      "main_level": "string",
      "dialogue": {
        "title": "string",
        "lines": [ { "speaker": "string", "text": "string" } ],
        "vocabulary": [
          {
            "word": "string",
            "pinyin": "string",
            "level": number,
            "english": "string",
            "partOfSpeech": "string",
            "example": "string",
            "japanese": "string",
            "korean": "string",
            "vietnamese": "string"
          }
        ],
        "grammar": [
          { "pattern": "string", "level": number, "english": "string", "example": "string" }
        ],
        "references": []
      },
      "essay": {
        "title": "string",
        "paragraphs": ["string"],
        "vocabulary": [],
        "grammar": [],
        "references": []
      },
      "activities": [
        { "title": "string", "description": "string" }
      ]
    }
    `;

    // Call OpenAI API
    console.log("Sending request to OpenAI...");
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        response_format: { type: "json_object" },
        messages: [
          { 
            role: 'system', 
            content: `You are an expert Mandarin teaching assistant (TBCL specialist).
Analyze the provided text.
Output strictly valid JSON matching this schema: ${jsonSchema}.

Requirements:
1. Estimate TBCL Level (1-7).
2. Extract vocabulary with TBCL levels.
3. Generate example sentences.
4. Create 3 classroom activities.` 
          },
          { 
            role: 'user', 
            content: `User Instruction: ${instruction}\n\nTarget Text:\n${truncated}` 
          }
        ],
      }),
    });

    const data = await openAIResponse.json();
    
    if (data.error) {
      console.error("OpenAI Error:", data.error);
      throw new Error(`OpenAI Error: ${data.error.message}`);
    }

    // Return Result
    const result = JSON.parse(data.choices[0].message.content);

    return jsonResponse(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Edge Function Error:", message);
    return jsonResponse({ error: message || "Unknown error" }, 500);
  }
});
