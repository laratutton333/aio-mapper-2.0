import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { authorityScoreForType, classifySourceType, getDomain, type SourceType } from "@/lib/citations/classifySource";

export type CitationsReport = {
  totalCitations: number;
  brandOwnedRate: number;
  averageAuthorityScore: number;
  missingCitationsCount: number;
  byType: Array<{
    sourceType: SourceType;
    count: number;
    percent: number;
  }>;
  all: Array<{
    url: string;
    domain: string | null;
    sourceType: SourceType;
    authorityScore: number;
  }>;
};

export async function getCitationsReport(args?: { auditId?: string | null; brandName?: string | null }): Promise<CitationsReport> {
  const supabase = createSupabaseAdminClient();
  const auditId = args?.auditId ?? null;
  const brandName = args?.brandName ?? null;

  const { data: runs, error: runsError } = auditId
    ? await supabase
        .from("ai_prompt_runs")
        .select("id")
        .eq("audit_id", auditId)
        .limit(2000)
    : await supabase
        .from("ai_prompt_runs")
        .select("id")
        .order("executed_at", { ascending: false })
        .limit(2000);

  if (runsError) throw new Error(runsError.message);
  const runIds = (runs ?? []).map((r) => r.id as string);

  let citationRows:
    | Array<{ source_url: string; source_type: string | null; prompt_run_id: string | null }>
    | null = null;

  const { data: citations, error: citationsError } = await supabase
    .from("ai_citations")
    .select("source_url,source_type,prompt_run_id")
    .in("prompt_run_id", runIds)
    .limit(5000);

  if (citationsError) {
    if (!citationsError.message.includes("ai_citations") && !citationsError.message.includes("relation")) {
      throw new Error(citationsError.message);
    }
  } else {
    citationRows = (citations ?? [])
      .map((row) => ({
        source_url: (row as { source_url?: unknown }).source_url,
        source_type: (row as { source_type?: unknown }).source_type,
        prompt_run_id: (row as { prompt_run_id?: unknown }).prompt_run_id
      }))
      .filter(
        (row): row is { source_url: string; source_type: string | null; prompt_run_id: string | null } =>
          typeof row.source_url === "string" &&
          (typeof row.source_type === "string" || row.source_type === null || row.source_type === undefined) &&
          (typeof row.prompt_run_id === "string" || row.prompt_run_id === null || row.prompt_run_id === undefined)
      )
      .map((row) => ({
        source_url: row.source_url,
        source_type: (row.source_type as string | null | undefined) ?? null,
        prompt_run_id: (row.prompt_run_id as string | null | undefined) ?? null
      }));
  }

  const all = (citationRows ?? []).map((row) => {
    const url = row.source_url;
    const sourceType = classifySourceType({ url, brandName });
    return {
      url,
      domain: getDomain(url),
      sourceType,
      authorityScore: authorityScoreForType(sourceType)
    };
  });

  const totalCitations = all.length;
  const brandOwnedCount = all.filter((c) => c.sourceType === "brand_owned").length;
  const brandOwnedRate = totalCitations === 0 ? 0 : brandOwnedCount / totalCitations;

  const averageAuthorityScore =
    totalCitations === 0
      ? 0
      : all.reduce((sum, row) => sum + row.authorityScore, 0) / totalCitations;

  const byTypeMap = new Map<SourceType, number>();
  for (const row of all) {
    byTypeMap.set(row.sourceType, (byTypeMap.get(row.sourceType) ?? 0) + 1);
  }
  const byType = (Array.from(byTypeMap.entries()) as Array<[SourceType, number]>).map(
    ([sourceType, count]) => ({
      sourceType,
      count,
      percent: totalCitations === 0 ? 0 : count / totalCitations
    })
  );

  const citationsByRunId = new Map<string, number>();
  for (const row of citationRows ?? []) {
    const runId = row.prompt_run_id ?? null;
    if (!runId) continue;
    citationsByRunId.set(runId, (citationsByRunId.get(runId) ?? 0) + 1);
  }
  const missingCitationsCount = runIds.filter((id) => (citationsByRunId.get(id) ?? 0) === 0)
    .length;

  return {
    totalCitations,
    brandOwnedRate,
    averageAuthorityScore,
    missingCitationsCount,
    byType: byType.sort((a, b) => b.count - a.count),
    all
  };
}
