import { analyzeBrandPresence } from "@/lib/ai/analyzeBrandPresence";
import { parseStrictJson, runOpenAiJsonSchema } from "@/lib/ai/openai";
import { getActivePromptTemplates } from "@/lib/prompts/getPromptTemplates";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { RunVisibilityRequest } from "@/types/ai";

export const runtime = "nodejs";

const answerSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    answer_text: { type: "string" },
    citations: { type: "array", items: { type: "string" } }
  },
  required: ["answer_text", "citations"]
} as const;

function interpolateTemplate(template: string, values: Record<string, string | null>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? `{${key}}`);
}

export async function POST(req: Request) {
  const body = (await req.json()) as RunVisibilityRequest;

  if (!body.brand_name || body.brand_name.trim().length === 0) {
    return Response.json(
      { success: false, error: "brand_name is required" },
      { status: 400 }
    );
  }

  const templates = await getActivePromptTemplates();
  if (templates.length === 0) {
    return Response.json(
      { success: false, error: "No active prompt templates" },
      { status: 400 }
    );
  }

  const model = body.model ?? "gpt-4.1-mini";
  const supabase = createSupabaseAdminClient();
  const auditId = body.audit_id ?? crypto.randomUUID();
  const brandName = body.brand_name.trim();
  const category = body.category?.trim() || null;

  if (body.audit_id) {
    const { data: existingRuns, error: existingRunsError } = await supabase
      .from("ai_prompt_runs")
      .select("id")
      .eq("audit_id", auditId)
      .eq("brand_name", brandName)
      .limit(1000);

    if (existingRunsError) {
      return Response.json({ success: false, error: existingRunsError.message }, { status: 500 });
    }

    const runIds = (existingRuns ?? []).map((row) => row.id as string);
    if (runIds.length > 0) {
      const { error: deleteCitationsError } = await supabase
        .from("ai_citations")
        .delete()
        .in("prompt_run_id", runIds);
      if (deleteCitationsError) {
        return Response.json(
          { success: false, error: deleteCitationsError.message },
          { status: 500 }
        );
      }

      const { error: deletePresenceError } = await supabase
        .from("ai_brand_presence")
        .delete()
        .in("prompt_run_id", runIds);
      if (deletePresenceError) {
        return Response.json(
          { success: false, error: deletePresenceError.message },
          { status: 500 }
        );
      }

      const { error: deleteRunsError } = await supabase
        .from("ai_prompt_runs")
        .delete()
        .in("id", runIds);
      if (deleteRunsError) {
        return Response.json({ success: false, error: deleteRunsError.message }, { status: 500 });
      }
    }
  }

  for (const template of templates) {
    const renderedPrompt = interpolateTemplate(template.prompt_template, {
      brand: brandName,
      category
    });

    const input = [
      "Answer the question clearly and concisely. If you include sources, include their URLs.",
      renderedPrompt
    ].join("\n\n");

    const { raw: openaiRaw, outputText } = await runOpenAiJsonSchema({
      model,
      input,
      jsonSchema: answerSchema,
      schemaName: "ai_visibility_answer_v1"
    });

    const parsed = parseStrictJson<{ answer_text: string; citations: string[] }>(outputText);
    const analyzed = analyzeBrandPresence({
      responseText: parsed.answer_text,
      brandName,
      citations: parsed.citations
    });

    const promptRunId = crypto.randomUUID();
    const executedAt = new Date().toISOString();

    const { error: runError } = await supabase.from("ai_prompt_runs").insert({
      id: promptRunId,
      audit_id: auditId,
      prompt_id: template.id,
      brand_name: brandName,
      model,
      raw_response: JSON.stringify({
        prompt: renderedPrompt,
        category,
        answer_text: parsed.answer_text,
        citations: parsed.citations,
        openai_raw: openaiRaw
      }),
      executed_at: executedAt
    });

    if (runError) {
      return Response.json({ success: false, error: runError.message }, { status: 500 });
    }

    const { error: presenceError } = await supabase.from("ai_brand_presence").insert({
      id: crypto.randomUUID(),
      prompt_run_id: promptRunId,
      brand_detected: analyzed.result.brandDetected,
      mention_type: analyzed.result.mentionType,
      citation_present: analyzed.result.citationPresent,
      confidence: analyzed.result.confidence
    });

    if (presenceError) {
      return Response.json(
        { success: false, error: presenceError.message },
        { status: 500 }
      );
    }

    const urls = Array.from(
      new Set([...(parsed.citations ?? []), ...(analyzed.extractedUrls ?? [])].filter(Boolean))
    );
    if (urls.length > 0) {
      const { error: citationError } = await supabase.from("ai_citations").insert(
        urls.map((url) => ({
          id: crypto.randomUUID(),
          prompt_run_id: promptRunId,
          source_url: url,
          source_type: null
        }))
      );

      if (citationError) {
        return Response.json({ success: false, error: citationError.message }, { status: 500 });
      }
    }
  }

  return Response.json({ success: true, audit_id: auditId });
}
