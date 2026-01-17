import "server-only";

import { openai } from "@/lib/ai/openaiClient";
import { getOpenAiModelEnv } from "@/lib/env.server";
import { analyzeBrandPresence, extractUrls } from "@/lib/ai/analyzeBrandPresence";
import { classifySourceType, authorityScoreForType } from "@/lib/citations/classifySource";
import { getActivePromptTemplates } from "@/lib/prompts/getPromptTemplates";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

type MentionType = "primary" | "secondary" | "implied" | "none";

type SelfAnnotation = {
  prompt_asked: string;
  answer_text: string;
  citations: string[];
  mentions: Array<{
    brand: string;
    type: MentionType;
  }>;
  scores: {
    presence_rate: number;
    citation_rate: number;
    recommendation_rate: number;
    authority_diversity: number;
  };
  primary_brand: {
    detected: boolean;
    mention_type: MentionType;
    confidence: number | null;
    reasoning: string | null;
  };
};

const selfAnnotationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prompt_asked: { type: "string" },
    answer_text: { type: "string" },
    citations: { type: "array", items: { type: "string" } },
    mentions: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          brand: { type: "string" },
          type: { type: "string", enum: ["primary", "secondary", "implied", "none"] }
        },
        required: ["brand", "type"]
      }
    },
    scores: {
      type: "object",
      additionalProperties: false,
      properties: {
        presence_rate: { type: "number" },
        citation_rate: { type: "number" },
        recommendation_rate: { type: "number" },
        authority_diversity: { type: "number" }
      },
      required: ["presence_rate", "citation_rate", "recommendation_rate", "authority_diversity"]
    },
    primary_brand: {
      type: "object",
      additionalProperties: false,
      properties: {
        detected: { type: "boolean" },
        mention_type: { type: "string", enum: ["primary", "secondary", "implied", "none"] },
        confidence: { type: ["number", "null"] },
        reasoning: { type: ["string", "null"] }
      },
      required: ["detected", "mention_type", "confidence", "reasoning"]
    }
  },
  required: ["prompt_asked", "answer_text", "citations", "mentions", "scores", "primary_brand"]
} as const;

function interpolateTemplate(template: string, values: Record<string, string | null>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function safeJsonParse<T>(label: string, value: string): T {
  try {
    return JSON.parse(value) as T;
  } catch (err) {
    const preview = value.length > 600 ? `${value.slice(0, 600)}…` : value;
    const message = err instanceof Error ? err.message : "Unknown JSON parse error";
    throw new Error(`${label}: ${message}. Raw: ${preview}`);
  }
}

export async function runAudit(args: {
  userId: string;
  auditId?: string | null;
  brandName: string;
  category: string | null;
  primaryDomain: string | null;
}) {
  const { OPENAI_MODEL_MAIN, OPENAI_MODEL_ANALYSIS } = getOpenAiModelEnv();
  const supabase = createSupabaseAdminClient();

  const templates = await getActivePromptTemplates();
  if (templates.length === 0) {
    throw new Error("No active prompt templates");
  }

  const auditId = args.auditId ?? crypto.randomUUID();
  const brandName = args.brandName.trim();
  const category = args.category?.trim() || null;
  const primaryDomain = args.primaryDomain?.trim() || null;

  const { data: existingAudit, error: existingAuditError } = await supabase
    .from("ai_audits")
    .select("id,user_id")
    .eq("id", auditId)
    .maybeSingle();
  if (existingAuditError) {
    if (!existingAuditError.message.includes("ai_audits") && !existingAuditError.message.includes("relation")) {
      throw new Error(existingAuditError.message);
    }
  }

  if (existingAudit && (existingAudit.user_id as string) !== args.userId) {
    throw new Error("Forbidden");
  }

  const { error: upsertAuditError } = await supabase.from("ai_audits").upsert(
    {
      id: auditId,
      user_id: args.userId,
      brand_name: brandName,
      category,
      primary_domain: primaryDomain,
      status: "running"
    },
    { onConflict: "id" }
  );
  if (upsertAuditError) throw new Error(upsertAuditError.message);

  // NOTE: These are prompt processing issues (e.g. OpenAI/JSON/insert failures), not user-facing "recommendations".
  const issues: Array<{ promptId: string; promptName: string; error: string }> = [];

  for (const template of templates) {
    const renderedPrompt = interpolateTemplate(template.prompt_template, {
      brand: brandName,
      category
    });

    const promptAsked = renderedPrompt;

    try {
      const mainResponse = await openai.responses.create({
        model: OPENAI_MODEL_MAIN,
        temperature: 0.2,
        input: [
          "You are answering a user question. Be clear and concise.",
          "If you reference sources, include their URLs inline.",
          promptAsked
        ].join("\n\n")
      });

      const answerText = (mainResponse.output_text ?? "").trim();

      const urlsFromAnswer = extractUrls(answerText);

      const analysisResponse = await openai.responses.create({
        model: OPENAI_MODEL_ANALYSIS,
        temperature: 0,
        text: {
          format: {
            type: "json_schema",
            name: "aio_visibility_self_annotation_v1",
            schema: selfAnnotationSchema,
            strict: true
          }
        },
        input: [
          "You are annotating an AI answer for analytics. Return JSON only, matching the provided schema.",
          "Use only the information present in the prompt and answer; do not invent sources.",
          `Primary brand: ${brandName}`,
          category ? `Category: ${category}` : null,
          primaryDomain ? `Primary domain: ${primaryDomain}` : null,
          "",
          "PROMPT ASKED:",
          promptAsked,
          "",
          "AI ANSWER:",
          answerText,
          "",
          "URLS OBSERVED IN ANSWER (may be empty):",
          (urlsFromAnswer ?? []).join("\n")
        ]
          .filter(Boolean)
          .join("\n")
      });

      const annotation = safeJsonParse<SelfAnnotation>(
        "Failed to parse self-annotation JSON",
        analysisResponse.output_text ?? ""
      );

      const runId = crypto.randomUUID();
      const executedAt = new Date().toISOString();
      const citationUrls = Array.from(
        new Set([...(annotation.citations ?? []), ...(urlsFromAnswer ?? [])].filter(Boolean))
      );

      const analyzed = analyzeBrandPresence({
        responseText: answerText,
        brandName,
        citations: citationUrls
      });

      const { error: runError } = await supabase.from("ai_prompt_runs").insert({
        id: runId,
        audit_id: auditId,
        prompt_id: template.id,
        brand_name: brandName,
        model: OPENAI_MODEL_MAIN,
        raw_response: JSON.stringify({
          prompt: promptAsked,
          category,
          answer_text: answerText,
          citations: citationUrls,
          openai_main_response_id: mainResponse.id,
          openai_analysis_response_id: analysisResponse.id
        }),
        executed_at: executedAt
      });
      if (runError) throw new Error(runError.message);

      const { error: analysisError } = await supabase.from("ai_prompt_analysis").insert({
        id: crypto.randomUUID(),
        prompt_run_id: runId,
        analysis: {
          ...annotation,
          scores: {
            presence_rate: clamp01(annotation.scores?.presence_rate ?? (analyzed.result.brandDetected ? 1 : 0)),
            citation_rate: clamp01(annotation.scores?.citation_rate ?? (analyzed.result.citationPresent ? 1 : 0)),
            recommendation_rate: clamp01(
              annotation.scores?.recommendation_rate ?? (analyzed.result.mentionType === "primary" ? 1 : 0)
            ),
            authority_diversity: clamp01(annotation.scores?.authority_diversity ?? 0)
          }
        },
        created_at: executedAt
      });
      if (analysisError) throw new Error(analysisError.message);

      const { error: presenceError } = await supabase.from("ai_brand_presence").insert({
        id: crypto.randomUUID(),
        prompt_run_id: runId,
        brand_detected: annotation.primary_brand.detected ?? analyzed.result.brandDetected,
        mention_type: annotation.primary_brand.mention_type ?? analyzed.result.mentionType,
        citation_present: citationUrls.length > 0,
        confidence: annotation.primary_brand.confidence ?? analyzed.result.confidence,
        reasoning: annotation.primary_brand.reasoning ?? null,
        created_at: executedAt
      });
      if (presenceError) throw new Error(presenceError.message);

      if (citationUrls.length > 0) {
        const { error: citationsError } = await supabase.from("ai_citations").insert(
          citationUrls.map((url) => {
            const sourceType = classifySourceType({ url, brandName });
            return {
              id: crypto.randomUUID(),
              prompt_run_id: runId,
              source_url: url,
              source_type: sourceType,
              authority_score: authorityScoreForType(sourceType),
              created_at: executedAt
            };
          })
        );
        if (citationsError) throw new Error(citationsError.message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      issues.push({ promptId: template.id, promptName: template.name, error: message });
      continue;
    }
  }

  const issuesRatio = issues.length / templates.length;

  try {
    // Recommendations are generated once per audit and stored.
    const { OPENAI_MODEL_ANALYSIS } = getOpenAiModelEnv();

    const recommendationsSchema = {
      type: "object",
      additionalProperties: false,
      properties: {
        items: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            properties: {
              category: { type: "string", enum: ["content", "authority", "structure"] },
              title: { type: "string" },
              description: { type: "string" },
              why_it_matters: { type: "string" },
              impact: { type: "string", enum: ["high", "medium", "low"] },
              effort: { type: "string", enum: ["high", "medium", "low"] }
            },
            required: ["category", "title", "description", "why_it_matters", "impact", "effort"]
          }
        }
      },
      required: ["items"]
    } as const;

    const promptSummary = issues.length
      ? `Issues (${issues.length}/${templates.length}):\n${issues
            .slice(0, 8)
            .map((f) => `- ${f.promptName}: ${f.error}`)
            .join("\n")}`
      : "No prompt issues.";

    const recResponse = await openai.responses.create({
      model: OPENAI_MODEL_ANALYSIS,
      temperature: 0,
      text: {
        format: {
          type: "json_schema",
          name: "aio_recommendations_v1",
          schema: recommendationsSchema,
          strict: true
        }
      },
      input: [
        "Generate actionable recommendations based on observed answer patterns from an audit.",
        "Do NOT claim guarantees, requirements, or internal model details.",
        "Prefer wording like: 'Based on observed answer patterns', 'Common in AI-generated responses', 'Frequently referenced in similar questions'.",
        "",
        `Brand: ${brandName}`,
        category ? `Category: ${category}` : null,
        "",
        promptSummary,
        "",
        "Return 5 recommendations."
      ]
        .filter(Boolean)
        .join("\n")
    });

    const recJson = safeJsonParse<{
      items: Array<{
        category: "content" | "authority" | "structure";
        title: string;
        description: string;
        why_it_matters: string;
        impact: "high" | "medium" | "low";
        effort: "high" | "medium" | "low";
      }>;
    }>("Failed to parse recommendations JSON", recResponse.output_text ?? "");

    if (recJson.items?.length) {
      const { error: insertRecsError } = await supabase.from("ai_recommendations").insert(
        recJson.items.slice(0, 20).map((item) => ({
          id: crypto.randomUUID(),
          audit_id: auditId,
          category: item.category,
          title: item.title,
          description: item.description,
          why_it_matters: item.why_it_matters,
          impact: item.impact,
          effort: item.effort,
          status: "pending"
        }))
      );
      if (insertRecsError) throw new Error(insertRecsError.message);
    }
  } catch (err) {
    // If recommendation generation fails, keep the audit usable, but don't fail silently.
    console.error("[runAudit] Recommendation generation failed", err);
  }

  const finalStatus = issuesRatio >= 0.5 ? "failed" : "completed";
  const { error: finishError } = await supabase
    .from("ai_audits")
    .update({ status: finalStatus })
    .eq("id", auditId);
  if (finishError) throw new Error(finishError.message);

  return { auditId, status: finalStatus, failures: issues };
}
