import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { getSavedCompetitorsForUser } from "@/lib/competitors/getSavedCompetitorsForUser";

type Mention = { brand: string; type: string };

export async function getCompetitorsForAudit(args: {
  auditId: string;
  primaryBrandName: string | null;
}) {
  const supabase = createSupabaseAdminClient();

  const { data: audit, error: auditError } = await supabase
    .from("ai_audits")
    .select("user_id")
    .eq("id", args.auditId)
    .maybeSingle();
  if (auditError) throw new Error(auditError.message);

  const auditUserId = (audit?.user_id as string | null) ?? null;
  if (auditUserId) {
    const savedCompetitors = await getSavedCompetitorsForUser(auditUserId);
    const primaryLower = args.primaryBrandName?.trim().toLowerCase() ?? null;
    const seen = new Set<string>();

    const rows = savedCompetitors
      .map((c) => ({ name: c.name.trim(), domain: c.domain }))
      .filter((c) => c.name.length > 0)
      .filter((c) => (primaryLower ? c.name.toLowerCase() !== primaryLower : true))
      .filter((c) => {
        const key = c.name.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });

    if (rows.length > 0) {
      return rows.slice(0, 10).map((row) => ({
        id: `competitor-settings-${row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
        name: row.name,
        domain: row.domain,
        source: "settings" as const
      }));
    }
  }

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
      domain: null as string | null,
      source: "inferred" as const
    }));
}
