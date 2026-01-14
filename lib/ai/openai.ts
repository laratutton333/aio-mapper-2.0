import { getServerEnv } from "@/lib/env";

export type OpenAiResponsesApiArgs = {
  model: string;
  input: string;
  jsonSchema: Record<string, unknown>;
};

export async function runOpenAiJsonSchema({
  model,
  input,
  jsonSchema
}: OpenAiResponsesApiArgs): Promise<{ raw: string; outputText: string }> {
  const env = getServerEnv();
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.OPENAI_API_KEY}`,
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "brand_presence_result",
          schema: jsonSchema,
          strict: true
        }
      },
      input
    })
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new Error(`OpenAI error (${res.status}): ${raw}`);
  }

  let outputText = "";
  try {
    const json = JSON.parse(raw) as {
      output_text?: string;
    };
    outputText = json.output_text ?? "";
  } catch {
    outputText = "";
  }

  return { raw, outputText };
}

