import type { DashboardResponse, PromptResult } from "@/types/dashboard";
import type { AiPromptTemplateRow, BrandPresenceResult } from "@/types/ai";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getActivePromptTemplates } from "@/lib/prompts/getPromptTemplates";
import { getRecommendationsFromDashboard } from "@/lib/recommendations/getRecommendations";

function calculateSummary(prompts: PromptResult[]) {
  const total = prompts.length || 1;
  const detectedCount = prompts.filter((p) => p.result.brandDetected).length;
  const citedCount = prompts.filter((p) => p.result.citationPresent).length;

  return {
    presenceRate: detectedCount / total,
    citationRate: citedCount / total
  };
}

function toPromptResult(
  template: AiPromptTemplateRow,
  result: BrandPresenceResult
): PromptResult {
  return {
    promptId: template.id,
    promptName: template.name,
    intent: template.intent,
    result
  };
}

export async function getDashboardData(): Promise<DashboardResponse> {
  const supabase = createSupabaseAdminClient();
  const templates = await getActivePromptTemplates();
  const templateIds = templates.map((t) => t.id);

  const { data: runRows, error: runError } = await supabase
    .from("ai_prompt_runs")
    .select("id,prompt_id,executed_at")
    .in("prompt_id", templateIds)
    .order("executed_at", { ascending: false })
    .limit(500);

  if (runError) {
    throw new Error(runError.message);
  }

  const latestRunByPromptId = new Map<string, string>();
  for (const row of runRows ?? []) {
    const promptId = row.prompt_id as string | null;
    const runId = row.id as string;
    if (!promptId) continue;
    if (!latestRunByPromptId.has(promptId)) {
      latestRunByPromptId.set(promptId, runId);
    }
  }

  const runIds = Array.from(new Set(latestRunByPromptId.values()));
  const { data: presenceRows, error: presenceError } = await supabase
    .from("ai_brand_presence")
    .select("brand_detected,mention_type,citation_present,confidence,prompt_run_id,created_at")
    .in("prompt_run_id", runIds)
    .order("created_at", { ascending: false })
    .limit(500);

  if (presenceError) {
    throw new Error(presenceError.message);
  }

  const latestPresenceByRunId = new Map<string, (typeof presenceRows)[number]>();
  for (const row of presenceRows ?? []) {
    const runId = row.prompt_run_id as string | null;
    if (!runId) continue;
    if (!latestPresenceByRunId.has(runId)) {
      latestPresenceByRunId.set(runId, row);
    }
  }

  const fallbackResult: BrandPresenceResult = {
    brandDetected: false,
    mentionType: null,
    citationPresent: false,
    confidence: null
  };

  const prompts: PromptResult[] = templates.map((template) => {
    const runId = latestRunByPromptId.get(template.id) ?? null;
    const presence = runId ? latestPresenceByRunId.get(runId) : undefined;

    if (!presence) {
      return toPromptResult(template, fallbackResult);
    }

    return toPromptResult(template, {
      brandDetected: Boolean(presence.brand_detected),
      mentionType: (presence.mention_type as string | null) ?? null,
      citationPresent: Boolean(presence.citation_present),
      confidence: (presence.confidence as number | null) ?? null
    });
  });

  const summary = calculateSummary(prompts);
  const dashboard: DashboardResponse = {
    summary,
    prompts,
    recommendations: []
  };
  dashboard.recommendations = getRecommendationsFromDashboard(dashboard);

  return dashboard;
}
