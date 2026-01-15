import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { BrandVsCompetitorsData, IntentGroup } from "@/lib/demo/demo-brand-vs-competitors";
import type { DemoBrand } from "@/lib/demo/demo-brands";

type MentionType = "primary" | "secondary" | "implied" | "none";
type Mention = { brand: string; type: MentionType };

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toIntentGroup(value: string): IntentGroup {
  const v = value.trim().toLowerCase();
  if (v === "informational") return "Informational";
  if (v === "comparative" || v === "comparison") return "Comparative";
  if (v === "transactional") return "Transactional";
  return "Trust";
}

function clamp01(value: number) {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

function mentionTypeForBrand(mentions: Mention[], brand: string): MentionType {
  const match = mentions.find((m) => m.brand.toLowerCase() === brand.toLowerCase());
  const type = match?.type ?? "none";
  return type === "primary" || type === "secondary" || type === "implied" ? type : "none";
}

function buildBrand(name: string, industry: string | null, domain: string | null): DemoBrand {
  const slug = slugify(name) || "brand";
  return {
    id: `brand-${slug}`,
    name,
    industry: industry ?? "—",
    domain: domain ?? `${slug}.example`
  };
}

export async function getBrandVsCompetitorsData(args: { auditId: string; userId: string }): Promise<BrandVsCompetitorsData | null> {
  const supabase = createSupabaseAdminClient();

  const { data: audit, error: auditError } = await supabase
    .from("ai_audits")
    .select("id,user_id,brand_name,primary_domain")
    .eq("id", args.auditId)
    .maybeSingle();

  if (auditError) throw new Error(auditError.message);
  if (!audit) return null;
  if ((audit.user_id as string) !== args.userId) return null;

  const primaryBrandName = (audit.brand_name as string) ?? "Your brand";

  const { data: runs, error: runsError } = await supabase
    .from("ai_prompt_runs")
    .select("id,prompt_id")
    .eq("audit_id", args.auditId)
    .limit(2500);

  if (runsError) throw new Error(runsError.message);
  const runRows = runs ?? [];
  const runIds = runRows.map((r) => r.id as string);
  if (runIds.length === 0) {
    const primary = buildBrand(primaryBrandName, null, (audit.primary_domain as string | null) ?? null);
    return {
      primary,
      brands: [{ brand: primary, presence: 0, citations: 0, recommendations: 0 }],
      byIntent: {
        Informational: [{ brand: primary, presence: 0, citations: 0, recommendations: 0 }],
        Comparative: [{ brand: primary, presence: 0, citations: 0, recommendations: 0 }],
        Transactional: [{ brand: primary, presence: 0, citations: 0, recommendations: 0 }],
        Trust: [{ brand: primary, presence: 0, citations: 0, recommendations: 0 }]
      }
    };
  }

  const templateIds = Array.from(new Set(runRows.map((r) => r.prompt_id as string | null).filter(Boolean))) as string[];
  const { data: templates, error: templatesError } = await supabase
    .from("ai_prompt_templates")
    .select("id,intent")
    .in("id", templateIds)
    .limit(5000);

  if (templatesError) throw new Error(templatesError.message);
  const intentByPromptId = new Map<string, string>();
  for (const row of templates ?? []) {
    intentByPromptId.set(row.id as string, (row.intent as string) ?? "");
  }

  const { data: analysisRows, error: analysisError } = await supabase
    .from("ai_prompt_analysis")
    .select("prompt_run_id,analysis")
    .in("prompt_run_id", runIds)
    .limit(5000);

  if (analysisError) {
    if (!analysisError.message.includes("ai_prompt_analysis") && !analysisError.message.includes("relation")) {
      throw new Error(analysisError.message);
    }
  }

  const mentionsByRunId = new Map<string, Mention[]>();
  for (const row of analysisRows ?? []) {
    const runId = (row.prompt_run_id as string | null) ?? null;
    if (!runId) continue;
    const analysis = (row as { analysis?: unknown }).analysis as { mentions?: unknown } | null;
    const mentions = Array.isArray(analysis?.mentions) ? (analysis!.mentions as Mention[]) : [];
    const cleaned = mentions
      .map((m) => ({
        brand: typeof m.brand === "string" ? m.brand.trim() : "",
        type: (typeof m.type === "string" ? m.type.trim() : "none") as MentionType
      }))
      .filter((m) => m.brand.length > 0);
    mentionsByRunId.set(runId, cleaned);
  }

  const { data: citations, error: citationsError } = await supabase
    .from("ai_citations")
    .select("prompt_run_id")
    .in("prompt_run_id", runIds)
    .limit(5000);

  if (citationsError) throw new Error(citationsError.message);
  const hasCitations = new Set<string>();
  for (const row of citations ?? []) {
    const runId = (row.prompt_run_id as string | null) ?? null;
    if (runId) hasCitations.add(runId);
  }

  const competitorPresenceCounts = new Map<string, number>();
  for (const runId of runIds) {
    const mentions = mentionsByRunId.get(runId) ?? [];
    for (const mention of mentions) {
      const name = mention.brand.trim();
      if (!name) continue;
      if (name.toLowerCase() === primaryBrandName.toLowerCase()) continue;
      if (mention.type === "none") continue;
      competitorPresenceCounts.set(name, (competitorPresenceCounts.get(name) ?? 0) + 1);
    }
  }

  const competitors = Array.from(competitorPresenceCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => buildBrand(name, null, null));

  const primary = buildBrand(primaryBrandName, null, (audit.primary_domain as string | null) ?? null);
  const allBrands: DemoBrand[] = [primary, ...competitors];

  function computeMetrics(runIdsForScope: string[]) {
    const total = runIdsForScope.length || 1;
    return allBrands.map((brand) => {
      let presence = 0;
      let recommendations = 0;
      let citationsHit = 0;

      for (const runId of runIdsForScope) {
        const mentions = mentionsByRunId.get(runId) ?? [];
        const type = mentionTypeForBrand(mentions, brand.name);
        const mentioned = type !== "none";
        if (mentioned) {
          presence += 1;
          if (type === "primary") recommendations += 1;
          if (hasCitations.has(runId)) citationsHit += 1;
        }
      }

      return {
        brand,
        presence: clamp01(presence / total),
        citations: clamp01(citationsHit / total),
        recommendations: clamp01(recommendations / total)
      };
    });
  }

  const byIntent: BrandVsCompetitorsData["byIntent"] = {
    Informational: [],
    Comparative: [],
    Transactional: [],
    Trust: []
  };

  const runIdsByIntent = new Map<IntentGroup, string[]>();
  for (const run of runRows) {
    const runId = run.id as string;
    const promptId = (run.prompt_id as string | null) ?? null;
    const intent = promptId ? intentByPromptId.get(promptId) ?? "" : "";
    const group = toIntentGroup(intent);
    const list = runIdsByIntent.get(group) ?? [];
    list.push(runId);
    runIdsByIntent.set(group, list);
  }

  (Object.keys(byIntent) as IntentGroup[]).forEach((group) => {
    byIntent[group] = computeMetrics(runIdsByIntent.get(group) ?? []);
  });

  return {
    primary,
    brands: computeMetrics(runIds),
    byIntent
  };
}

