import type { AiPromptTemplateRow, BrandPresenceResult } from "@/types/ai";

import { runOpenAiJsonSchema } from "@/lib/ai/openai";

const brandPresenceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    brand_detected: { type: "boolean" },
    mention_type: {
      anyOf: [
        { type: "string", enum: ["explicit", "implicit", "none"] },
        { type: "null" }
      ]
    },
    citation_present: { type: "boolean" },
    confidence: {
      anyOf: [{ type: "number", minimum: 0, maximum: 1 }, { type: "null" }]
    }
  },
  required: ["brand_detected", "mention_type", "citation_present", "confidence"]
} as const;

export type AnalyzeBrandPresenceOutput = {
  result: BrandPresenceResult;
  rawResponse: string;
};

export async function analyzeBrandPresence(args: {
  template: AiPromptTemplateRow;
  brand: string;
  model: string;
}): Promise<AnalyzeBrandPresenceOutput> {
  const input = [
    "You are a strict evaluator. Follow the prompt template intent and only return JSON that matches the schema.",
    `Brand name: ${args.brand}`,
    "",
    args.template.prompt_template
  ].join("\n");

  const { raw, outputText } = await runOpenAiJsonSchema({
    model: args.model,
    input,
    jsonSchema: brandPresenceSchema
  });

  const parsed = JSON.parse(outputText) as {
    brand_detected: boolean;
    mention_type: "explicit" | "implicit" | "none" | null;
    citation_present: boolean;
    confidence: number | null;
  };

  return {
    rawResponse: raw,
    result: {
      brandDetected: parsed.brand_detected,
      mentionType:
        parsed.mention_type === "none" ? null : (parsed.mention_type as string | null),
      citationPresent: parsed.citation_present,
      confidence: parsed.confidence
    }
  };
}

