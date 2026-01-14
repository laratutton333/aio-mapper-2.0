import type { DashboardResponse, PromptResult } from "@/types/dashboard";
import type { AiPromptTemplateRow, BrandPresenceResult } from "@/types/ai";

import { getDomain } from "@/lib/citations/classifySource";
import { parsePromptRunRaw, toAnswerPreview } from "@/lib/promptRuns/parsePromptRunRaw";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getActivePromptTemplates } from "@/lib/prompts/getPromptTemplates";
import { getRecommendationsFromDashboard } from "@/lib/recommendations/getRecommendations";

function calculateSummary(prompts: PromptResult[]) {
  const total = prompts.length || 1;
  const detectedCount = prompts.filter((p) => p.result.brandDetected).length;
  const citedCount = prompts.filter((p) => p.result.citationPresent).length;
  const recommendedCount = prompts.filter((p) => p.result.mentionType === "primary").length;

  return {
    presenceRate: detectedCount / total,
    citationRate: citedCount / total,
    recommendationRate: recommendedCount / total
  };
}

function toPromptResult(
  template: AiPromptTemplateRow,
  args: {
    runId: string | null;
    executedAt: string | null;
    promptAsked: string | null;
    answerPreview: string | null;
    citationCount: number;
    result: BrandPresenceResult;
  }
): PromptResult {
  return {
    runId: args.runId,
    promptId: template.id,
    promptName: template.name,
    intent: template.intent,
    promptAsked: args.promptAsked,
    answerPreview: args.answerPreview,
    citationCount: args.citationCount,
    executedAt: args.executedAt,
    result: args.result
  };
}

async function safeLoadCitationsByRunId(args: {
  supabase: ReturnType<typeof createSupabaseAdminClient>;
  runIds: string[];
  brandName: string | null;
}) {
  if (args.runIds.length === 0) {
    return {
      citationCountByRunId: new Map<string, number>(),
      uniqueDomains: new Set<string>(),
      totalCitations: 0
    };
  }

  const { data, error } = await args.supabase
    .from("ai_citations")
    .select("prompt_run_id,source_url,source_type")
    .in("prompt_run_id", args.runIds)
    .limit(5000);

  if (error) {
    if (error.message.includes("ai_citations") || error.message.includes("relation")) {
      return {
        citationCountByRunId: new Map<string, number>(),
        uniqueDomains: new Set<string>(),
        totalCitations: 0
      };
    }
    throw new Error(error.message);
  }

  const citationCountByRunId = new Map<string, number>();
  const uniqueDomains = new Set<string>();
  let totalCitations = 0;

  for (const row of data ?? []) {
    const runId = (row.prompt_run_id as string | null) ?? null;
    const url = (row.source_url as string | null) ?? null;
    if (!runId || !url) continue;

    const domain = getDomain(url);
    if (domain) uniqueDomains.add(domain);

    const prev = citationCountByRunId.get(runId) ?? 0;
    citationCountByRunId.set(runId, prev + 1);
    totalCitations += 1;

  }

  return { citationCountByRunId, uniqueDomains, totalCitations };
}

export async function getDashboardData(args?: {
  auditId?: string | null;
  userId?: string | null;
}): Promise<DashboardResponse> {
  const supabase = createSupabaseAdminClient();
  const templates = await getActivePromptTemplates();
  const templateIds = templates.map((t) => t.id);

  const fallbackResult: BrandPresenceResult = {
    brandDetected: false,
    mentionType: "none",
    citationPresent: false,
    confidence: null
  };

  const requestedAuditId = args?.auditId ?? null;
  const userId = args?.userId ?? null;

  const auditsQuery = supabase
    .from("ai_audits")
    .select("id,brand_name,created_at,user_id")
    .order("created_at", { ascending: false });

  const { data: latestAudit, error: latestAuditError } = requestedAuditId
    ? await auditsQuery.eq("id", requestedAuditId).maybeSingle()
    : userId
      ? await auditsQuery.eq("user_id", userId).limit(1).maybeSingle()
      : await auditsQuery.limit(1).maybeSingle();

  if (latestAuditError) {
    if (!latestAuditError.message.includes("ai_audits") && !latestAuditError.message.includes("relation")) {
      throw new Error(latestAuditError.message);
    }
  }

  if (userId && latestAudit && (latestAudit.user_id as string | null) !== userId) {
    // If an explicit audit id is provided but doesn't belong to this user, return an empty dashboard.
    const emptyPrompts: PromptResult[] = templates.map((t) =>
      toPromptResult(t, {
        runId: null,
        executedAt: null,
        promptAsked: null,
        answerPreview: null,
        citationCount: 0,
        result: fallbackResult
      })
    );
    const summary = calculateSummary(emptyPrompts);
    const dashboard: DashboardResponse = {
      audit: { auditId: null, brandName: null, category: null, executedAt: null },
      summary: { ...summary, visibilityScore: 0, authorityDiversity: 0 },
      trend: [],
      prompts: emptyPrompts,
      recommendations: []
    };
    dashboard.recommendations = getRecommendationsFromDashboard(dashboard);
    return dashboard;
  }

  const auditId = (latestAudit?.id as string | null) ?? null;
  const brandName = (latestAudit?.brand_name as string | null) ?? null;
  const category = null;
  const executedAt = (latestAudit?.created_at as string | null) ?? null;

  if (!auditId) {
    const emptyPrompts: PromptResult[] = templates.map((t) =>
      toPromptResult(t, {
        runId: null,
        executedAt: null,
        promptAsked: null,
        answerPreview: null,
        citationCount: 0,
        result: fallbackResult
      })
    );
    const summary = calculateSummary(emptyPrompts);
    const dashboard: DashboardResponse = {
      audit: { auditId: null, brandName: null, category: null, executedAt: null },
      summary: { ...summary, visibilityScore: 0, authorityDiversity: 0 },
      trend: [],
      prompts: emptyPrompts,
      recommendations: []
    };
    dashboard.recommendations = getRecommendationsFromDashboard(dashboard);
    return dashboard;
  }

  const { data: auditRuns, error: auditRunsError } = await supabase
    .from("ai_prompt_runs")
    .select("id,prompt_id,executed_at,raw_response")
    .eq("audit_id", auditId)
    .in("prompt_id", templateIds)
    .order("executed_at", { ascending: false })
    .limit(2000);

  if (auditRunsError) {
    throw new Error(auditRunsError.message);
  }

  const latestRunByPromptId = new Map<string, (typeof auditRuns)[number]>();
  for (const row of auditRuns ?? []) {
    const promptId = row.prompt_id as string | null;
    if (!promptId) continue;
    if (!latestRunByPromptId.has(promptId)) {
      latestRunByPromptId.set(promptId, row);
    }
  };

  const runIds = Array.from(latestRunByPromptId.values()).map((r) => r.id as string);

  const { data: presenceRows, error: presenceError } = await supabase
    .from("ai_brand_presence")
    .select("brand_detected,mention_type,citation_present,confidence,prompt_run_id,created_at")
    .in("prompt_run_id", runIds)
    .order("created_at", { ascending: false })
    .limit(2000);

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

  const citations = await safeLoadCitationsByRunId({ supabase, runIds, brandName });

  const prompts: PromptResult[] = templates.map((template) => {
    const run = latestRunByPromptId.get(template.id) ?? null;
    const runId = (run?.id as string | null) ?? null;
    const raw = run?.raw_response ? parsePromptRunRaw(run.raw_response as string) : null;
    const presence = runId ? latestPresenceByRunId.get(runId) : undefined;

    const result: BrandPresenceResult = presence
      ? {
          brandDetected: Boolean(presence.brand_detected),
          mentionType: ((presence.mention_type as string | null) ?? "none") as
            | "primary"
            | "secondary"
            | "implied"
            | "none",
          citationPresent: Boolean(presence.citation_present),
          confidence: (presence.confidence as number | null) ?? null
        }
      : fallbackResult;

    return toPromptResult(template, {
      runId,
      executedAt: (run?.executed_at as string | null) ?? null,
      promptAsked: raw?.prompt ?? null,
      answerPreview: toAnswerPreview(raw?.answer_text ?? null),
      citationCount: runId ? (citations.citationCountByRunId.get(runId) ?? 0) : 0,
      result
    });
  });

  const summaryBase = calculateSummary(prompts);
  const authorityDiversity =
    citations.totalCitations === 0 ? 0 : citations.uniqueDomains.size / citations.totalCitations;

  const summary: DashboardResponse["summary"] = {
    ...summaryBase,
    visibilityScore:
      (summaryBase.presenceRate + summaryBase.citationRate + summaryBase.recommendationRate) / 3,
    authorityDiversity
  };

  const trend = await buildTrend({ supabase, templateIds, brandName });

  const dashboard: DashboardResponse = {
    audit: { auditId, brandName, category, executedAt },
    summary,
    trend,
    prompts,
    recommendations: []
  };
  dashboard.recommendations = getRecommendationsFromDashboard(dashboard);

  return dashboard;
}

async function buildTrend(args: {
  supabase: ReturnType<typeof createSupabaseAdminClient>;
  templateIds: string[];
  brandName: string | null;
}): Promise<DashboardResponse["trend"]> {
  if (!args.brandName) return [];

  const { data: runs, error } = await args.supabase
    .from("ai_prompt_runs")
    .select("id,audit_id,prompt_id,executed_at,brand_name")
    .eq("brand_name", args.brandName)
    .in("prompt_id", args.templateIds)
    .order("executed_at", { ascending: false })
    .limit(2500);

  if (error) throw new Error(error.message);

  const auditMeta = new Map<string, string>();
  const latestRunByAuditPrompt = new Map<string, string>();

  for (const row of runs ?? []) {
    const auditId = row.audit_id as string | null;
    const promptId = row.prompt_id as string | null;
    const runId = row.id as string;
    const executedAt = row.executed_at as string | null;
    if (!auditId || !promptId || !executedAt) continue;

    if (!auditMeta.has(auditId)) auditMeta.set(auditId, executedAt);
    const key = `${auditId}:${promptId}`;
    if (!latestRunByAuditPrompt.has(key)) latestRunByAuditPrompt.set(key, runId);
  }

  const auditIds = Array.from(auditMeta.entries())
    .sort((a, b) => b[1].localeCompare(a[1]))
    .slice(0, 10)
    .map(([auditId]) => auditId);

  const runIds = Array.from(latestRunByAuditPrompt.entries())
    .filter(([key]) => auditIds.includes(key.split(":")[0] ?? ""))
    .map(([, runId]) => runId);

  if (runIds.length === 0) return [];

  const { data: presenceRows, error: presenceError } = await args.supabase
    .from("ai_brand_presence")
    .select("prompt_run_id,brand_detected,mention_type,citation_present,created_at")
    .in("prompt_run_id", runIds)
    .order("created_at", { ascending: false })
    .limit(5000);

  if (presenceError) throw new Error(presenceError.message);

  const presenceByRunId = new Map<string, (typeof presenceRows)[number]>();
  for (const row of presenceRows ?? []) {
    const runId = row.prompt_run_id as string | null;
    if (!runId) continue;
    if (!presenceByRunId.has(runId)) presenceByRunId.set(runId, row);
  }

  const perAudit: Array<{ auditId: string; executedAt: string; visibilityScore: number }> = [];
  for (const auditId of auditIds) {
    const auditRunIds = Array.from(latestRunByAuditPrompt.entries())
      .filter(([key]) => key.startsWith(`${auditId}:`))
      .map(([, runId]) => runId);

    const prompts: PromptResult[] = auditRunIds.map((runId) => {
      const row = presenceByRunId.get(runId);
      const result: BrandPresenceResult = row
        ? {
            brandDetected: Boolean(row.brand_detected),
            mentionType: ((row.mention_type as string | null) ?? "none") as
              | "primary"
              | "secondary"
              | "implied"
              | "none",
            citationPresent: Boolean(row.citation_present),
            confidence: null
          }
        : {
            brandDetected: false,
            mentionType: "none",
            citationPresent: false,
            confidence: null
          };

      return {
        runId,
        promptId: "",
        promptName: "",
        intent: "",
        promptAsked: null,
        answerPreview: null,
        citationCount: 0,
        executedAt: null,
        result
      };
    });

    const summary = calculateSummary(prompts);
    perAudit.push({
      auditId,
      executedAt: auditMeta.get(auditId) ?? new Date().toISOString(),
      visibilityScore: (summary.presenceRate + summary.citationRate + summary.recommendationRate) / 3
    });
  }

  return perAudit
    .sort((a, b) => a.executedAt.localeCompare(b.executedAt))
    .map((row) => ({
      auditId: row.auditId,
      executedAt: row.executedAt,
      visibilityScore: row.visibilityScore
    }));
}
