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

    // Define JSON Schema (Enforcing 15+ vocabulary with multilingual translations + warmUp)
    const jsonSchema = `
{
  "main_level": "string (e.g., 'TBCL Level 4')",
  "summary": "string (A concise summary of the text's key points in Chinese)",
  "warm_up": ["string (At least 1-2 discussion questions to inspire students/teachers before the lesson)"],
  "dialogue": {
    "title": "string (or empty string if content is an essay)",
    "lines": [ { "speaker": "string", "text": "string" } ],
    "vocabulary": [
      {
        "word": "string",
        "pinyin": "string",
        "level": "string (Must be '1', '2', '3', '4', '5', '6', '7' or '無')",
        "english": "string (Required - English translation)",
        "japanese": "string (Required - Japanese translation)",
        "korean": "string (Required - Korean translation)",
        "vietnamese": "string (Required - Vietnamese translation)",
        "partOfSpeech": "string",
        "example": "string (A new, level-appropriate example sentence based on the word)"
      }
    ],
    "grammar": [
      { "pattern": "string", "level": number, "english": "string", "example": "string", "note": "語法點僅供參考" }
    ],
    "references": []
  },
  "essay": {
    "title": "string (or empty string if content is a dialogue)",
    "paragraphs": ["string (COMPLETE paragraphs - do NOT summarize or truncate)"],
    "vocabulary": [
      {
        "word": "string",
        "pinyin": "string",
        "level": "string (Must be '1', '2', '3', '4', '5', '6', '7' or '無')",
        "english": "string (Required - English translation)",
        "japanese": "string (Required - Japanese translation)",
        "korean": "string (Required - Korean translation)",
        "vietnamese": "string (Required - Vietnamese translation)",
        "partOfSpeech": "string",
        "example": "string (A new, level-appropriate example sentence based on the word)"
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

    // Updated System Instruction with Full Text Preservation, 15+ Vocab, Multilingual Translations, and Warm Up
    const systemInstruction = `
You are a **Senior Mandarin Teacher** expert in TBCL (Taiwan Benchmarks for the Chinese Language).

**Task:** Analyze the provided text and output strictly valid JSON.

**CRITICAL INSTRUCTIONS:**

1.  **Full Text Preservation (MANDATORY):**
    * You MUST output the **COMPLETE, UNABRIDGED text** from the source file.
    * For essays: Split the text into logical paragraphs in the \`essay.paragraphs\` array. Include EVERY sentence.
    * For dialogues: Include ALL speaker lines in the \`dialogue.lines\` array.
    * **DO NOT summarize, truncate, or omit any part of the original text.**

2.  **Content Type Detection:**
    * Analyze the text structure to determine if it is a **Dialogue** or an **Essay/Article**.
    * **If Dialogue:** Populate the "dialogue" object. Leave "essay.paragraphs" empty.
    * **If Essay/Article:** Populate the "essay" object. Leave "dialogue.lines" empty.
    * Do NOT populate both - only one content type should have data.

3.  **Vocabulary Extraction (Minimum 15 Words):**
    * Extract **AT LEAST 15** vocabulary words from the text.
    * If the text is very short, extract as many meaningful words as possible.
    * You must assign a TBCL Level (1-7) to each word based on the official "14452 Words List".
    * **IF A WORD IS NOT IN THE OFFICIAL TBCL LIST** (e.g., proper nouns, slang, specialized jargon), mark the level as **"無"** (single character).

4.  **Multilingual Translations (MANDATORY for every word):**
    * For EVERY vocabulary word, you MUST provide accurate translations in ALL 4 languages:
        * **english**: English translation
        * **japanese**: Japanese translation (use Kanji/Hiragana)
        * **korean**: Korean translation (use Hangul)
        * **vietnamese**: Vietnamese translation
    * These fields are REQUIRED. Do not leave them empty.

5.  **Example Sentences:**
    * For every vocabulary word, generate a **NEW** example sentence (例句).
    * The sentence must be appropriate for the word's level.

6.  **Warm Up Questions (MANDATORY):**
    * Generate **1-2 discussion questions** in the "warm_up" array.
    * These questions should inspire students or teachers before the lesson begins.
    * Questions should be related to the lesson's theme and encourage critical thinking.

7.  **Classroom Activities (Dynamic):**
    * Create exactly **2** operational classroom activities based on the text content.
    * Create unique activities (e.g., Role Play, Jigsaw Reading, Information Gap, Interview) tailored to this specific lesson.
    * Provide a clear 'title' and a 'description' explaining how to conduct the activity.

8.  **Summary:** Provide a concise summary of the key points in Chinese.

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
