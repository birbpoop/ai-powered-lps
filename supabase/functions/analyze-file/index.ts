const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type AnalyzeBody = {
  file_url: string;
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
      error: "PDF parsing is currently limited. Please upload TXT/MD/CSV files.",
    };
  }

  const buf = await res.arrayBuffer();
  // Assume UTF-8 for now (text/csv/md)
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

    const { file_url, user_prompt, file_type } = (await req.json()) as AnalyzeBody;
    if (!file_url) {
      return jsonResponse({ error: "Missing file_url" }, 400);
    }

    const extracted = await extractTextFromUrl(file_url, file_type);
    if (!extracted.ok) {
      return jsonResponse({ error: extracted.error }, 400);
    }

    const fileContent = safeTruncate(extracted.text, 20_000);
    const prompt = user_prompt?.trim() || "Please summarize and extract teaching points.";

    const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant analyzing file content based on user instructions.",
          },
          {
            role: "user",
            content: `User Instruction:\n${prompt}\n\nFile Content:\n${fileContent}`,
          },
        ],
      }),
    });

    const data = await openAIResponse.json();
    if (!openAIResponse.ok) {
      return jsonResponse({
        error: "OpenAI request failed",
        status: openAIResponse.status,
        details: data,
      }, 500);
    }

    const result = data?.choices?.[0]?.message?.content;
    return jsonResponse({ result: result ?? "" });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return jsonResponse({ error: message || "Unknown error" }, 500);
  }
});
