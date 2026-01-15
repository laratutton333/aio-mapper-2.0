import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

type Mention = { brand: string; type: string };

export async function getCompetitorsForAudit(args: {
  auditId: string;
  primaryBrandName: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { data: runs, error: runsError } = await supabase
    .from("ai_prompt_runs")
    .select("id")
    .eq("audit_id", args.auditId)
    .limit(2500);

  if (runsError) throw new Error(runsError.message);
  const runIds = (runs ?? []).map((r) => r.id as string);
  if (runIds.length === 0) return [];

  const { data, error } = await supabase
    .from("ai_prompt_analysis")
    .select("analysis,prompt_run_id")
    .in("prompt_run_id", runIds)
    .limit(5000);

  if (error) {
    if (error.message.includes("ai_prompt_analysis") || error.message.includes("relation")) {
      return [];
    }
    throw new Error(error.message);
  }

  const primary = args.primaryBrandName?.toLowerCase() ?? null;
  const names = new Map<string, string>();

  for (const row of data ?? []) {
    const analysis = (row as { analysis?: unknown }).analysis as { mentions?: unknown } | null;
    const mentions = (analysis?.mentions ?? []) as Mention[];
    for (const mention of mentions) {
      const brand = typeof mention?.brand === "string" ? mention.brand.trim() : "";
      if (!brand) continue;
      const key = brand.toLowerCase();
      if (primary && key === primary) continue;
      names.set(key, brand);
    }
  }

  return Array.from(names.values())
    .slice(0, 10)
    .map((name) => ({
      id: `competitor-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      name,
      domain: null as string | null
    }));
}
