import { analyzeBrandPresence } from "@/lib/ai/analyzeBrandPresence";
import { getActivePromptTemplates } from "@/lib/prompts/getPromptTemplates";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { RunVisibilityRequest } from "@/types/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json()) as RunVisibilityRequest;

  if (!body.brand || body.brand.trim().length === 0) {
    return Response.json({ success: false, error: "brand is required" }, { status: 400 });
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
  const auditId = body.auditId ?? null;
  const brandName = body.brand.trim();

  for (const template of templates) {
    if (auditId) {
      const { data: existingRuns, error: existingRunsError } = await supabase
        .from("ai_prompt_runs")
        .select("id")
        .eq("audit_id", auditId)
        .eq("prompt_id", template.id)
        .eq("brand_name", brandName)
        .limit(50);

      if (existingRunsError) {
        return Response.json(
          { success: false, error: existingRunsError.message },
          { status: 500 }
        );
      }

      const runIds = (existingRuns ?? []).map((row) => row.id as string);
      if (runIds.length > 0) {
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
          return Response.json(
            { success: false, error: deleteRunsError.message },
            { status: 500 }
          );
        }
      }
    }

    const analyzed = await analyzeBrandPresence({
      template,
      brand: brandName,
      model
    });

    const promptRunId = crypto.randomUUID();
    const executedAt = new Date().toISOString();

    const { error: runError } = await supabase.from("ai_prompt_runs").insert({
      id: promptRunId,
      audit_id: auditId,
      prompt_id: template.id,
      brand_name: brandName,
      model,
      raw_response: analyzed.rawResponse,
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
  }

  return Response.json({ success: true });
}
