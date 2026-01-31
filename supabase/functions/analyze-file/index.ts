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

    // Define JSON Schema (Updated with "無" for unlisted words)
    const jsonSchema = `
{
  "main_level": "string (e.g., 'TBCL Level 4')",
  "summary": "string (A concise summary of the text's key points in Chinese)",
  "dialogue": {
    "title": "string (or empty string if content is an essay)",
    "lines": [ { "speaker": "string", "text": "string" } ],
    "vocabulary": [
      {
        "word": "string",
        "pinyin": "string",
        "level": "string (Must be '1', '2', '3', '4', '5', '6', '7' or '無')",
        "english": "string",
        "partOfSpeech": "string",
        "example": "string (A new, level-appropriate example sentence based on the word)",
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
    "title": "string (or empty string if content is a dialogue)",
    "paragraphs": ["string"],
    "vocabulary": [
      {
        "word": "string",
        "pinyin": "string",
        "level": "string (Must be '1', '2', '3', '4', '5', '6', '7' or '無')",
        "english": "string",
        "partOfSpeech": "string",
        "example": "string (A new, level-appropriate example sentence based on the word)",
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
  "activities": [
    { "title": "string", "description": "string" },
    { "title": "string", "description": "string" }
  ]
}
`;

    // Updated System Instruction with Strict TBCL Leveling and Content Type Detection
    const systemInstruction = `
You are a **Senior Mandarin Teacher** expert in TBCL (Taiwan Benchmarks for the Chinese Language).

**Task:** Analyze the provided text and output strictly valid JSON.

**CRITICAL INSTRUCTIONS:**

1.  **Content Type Detection:**
    * Analyze the text structure to determine if it is a **Dialogue** or an **Essay/Article**.
    * **If Dialogue:** Populate the "dialogue" object with title, lines, vocabulary, and grammar. Leave "essay.paragraphs" as an empty array and "essay.vocabulary"/"essay.grammar" empty.
    * **If Essay/Article:** Populate the "essay" object with title, paragraphs, vocabulary, and grammar. Leave "dialogue.lines" as an empty array and "dialogue.vocabulary"/"dialogue.grammar" empty.
    * Do NOT populate both - only one content type should have data.

2.  **Vocabulary Leveling (Strict):**
    * You must assign a TBCL Level (1-7) to each extracted word based on the official "14452 Words List".
    * **IF A WORD IS NOT IN THE OFFICIAL TBCL LIST** (e.g., proper nouns, slang, specialized jargon), you MUST mark the level as **"無"** (single character). Do NOT use "無收錄" or "0" or guess a number.

3.  **Example Sentences:**
    * For every vocabulary word, generate a **NEW** example sentence (例句).
    * The sentence must be appropriate for the word's level.

4.  **Classroom Activities (Dynamic):**
    * Create exactly **2** operational classroom activities based on the text content.
    * **Do NOT** use the generic "Debate" or "Sales Pitch" unless specifically relevant. Create unique activities (e.g., Role Play, Jigsaw Reading, Information Gap, Interview, Survey, Ranking Task, Problem Solving) tailored to this specific lesson.
    * **Level Fit:** Activities must be appropriate for the estimated TBCL level (e.g., Level 1-2 focuses on pairing/matching; Level 5+ focuses on debate/presentation).
    * Provide a clear 'title' and a 'description' explaining how to conduct the activity in class.

5.  **Summary:** Provide a concise summary of the key points in Chinese.

**Output:** Strictly valid JSON matching the schema. No markdown, no code blocks.
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
