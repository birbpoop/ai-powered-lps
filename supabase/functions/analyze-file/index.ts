import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AnalyzeBody = {
  content_text: string;
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

    // Frontend must send pre-extracted text content (PDF parsing happens client-side via pdfjs-dist)
    const { content_text } = (await req.json()) as AnalyzeBody;

    if (!content_text || content_text.trim().length === 0) {
      return jsonResponse({ error: "Missing content_text - please extract text from your file before sending" }, 400);
    }

    const fileContent = content_text;

    if (!fileContent || fileContent.trim().length === 0) {
      return jsonResponse({ error: "File content is empty." }, 400);
    }

    // Maintain the 20,000 character truncation safeguard
    const truncated = safeTruncate(fileContent, 20_000);

    // Define JSON Schema (Updated with Summary & Strict Constraints)
    const jsonSchema = `
{
  "main_level": "string (e.g., 'TBCL Level 4')",
  "summary": "string (A concise summary of the text's key points in Chinese)",
  "dialogue": {
    "title": "string",
    "lines": [ { "speaker": "string", "text": "string" } ],
    "vocabulary": [
      {
        "word": "string",
        "pinyin": "string",
        "level": number (Must be 1, 2, 3, 4, 5, 6, 7 or 0 for unknown/X),
        "english": "string",
        "partOfSpeech": "string",
        "example": "string",
        "japanese": "string",
        "korean": "string",
        "vietnamese": "string"
      }
    ],
    "grammar": [
      { "pattern": "string", "level": number, "english": "string", "example": "string", "note": "語法點僅供參考" }
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
    { "title": "string", "description": "string (Operational classroom activity description)" }
  ]
}
`;

    // Construct the Senior Teacher Persona Prompt
    const systemInstruction = `
You are a **Senior Mandarin Teacher** with decades of teaching experience. 
You are an expert in the principles of Mandarin teaching materials and proficiency standards, specifically **TBCL (Taiwan Benchmarks for the Chinese Language)**, CEFR, and TOCFL.

**Your Task:**
Analyze the provided text file and strictly parse it into the following 5 blocks within a JSON object:

1. **Article Content**: Extract the text content into either the 'dialogue' or 'essay' structure. For dialogue, extract speaker lines. For essays/passages, extract paragraphs.

2. **Summary**: Provide a concise summary of the key points (摘要重點) in the 'summary' field. Write in Chinese.

3. **Vocabulary**: List key vocabulary words. 
   **Constraint:** You must refer to the National Academy for Educational Research (NAER) system and label each word with its correct **TBCL Level (1-7)**. Use numeric values: 1, 2, 3, 4, 5, 6, or 7. If a word is outside these levels or cannot be determined, mark it as **0** (representing 'X'/unknown). Do NOT hallucinate levels.
   Include: word, pinyin, level (number), english, partOfSpeech, example sentence in Chinese, japanese, korean, vietnamese translations.

4. **Grammar Points**: Extract relevant grammar patterns.
   **Constraint:** Each grammar point must include the note "語法點僅供參考" (Grammar points are for reference only).

5. **Classroom Activities**: Propose **exactly 2** operational classroom activities (可操作的課堂活動). Each activity should have a clear title and description that teachers can immediately implement.

**Output Format:** Return strictly valid JSON matching the schema provided. No markdown, no code blocks, just pure JSON.
`;

    // Call OpenAI API with Fixed Teacher Persona
    console.log("Sending request to OpenAI with Fixed Teacher Persona...");
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
            content: `${systemInstruction}\n\nSchema:\n${jsonSchema}` 
          },
          { 
            role: 'user', 
            content: `Target Text to Analyze:\n${truncated}` 
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
