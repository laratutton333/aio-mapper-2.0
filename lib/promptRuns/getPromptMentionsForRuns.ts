import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";

type Mention = { brand: string; type: string };

export async function getPromptMentionsForRuns(runIds: string[]) {
  if (runIds.length === 0) return new Map<string, Mention[]>();
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("ai_prompt_analysis")
    .select("prompt_run_id,analysis")
    .in("prompt_run_id", runIds)
    .limit(5000);

  if (error) {
    if (error.message.includes("ai_prompt_analysis") || error.message.includes("relation")) {
      return new Map<string, Mention[]>();
    }
    throw new Error(error.message);
  }

  const map = new Map<string, Mention[]>();
  for (const row of data ?? []) {
    const runId = (row.prompt_run_id as string | null) ?? null;
    if (!runId) continue;
    const analysis = (row as { analysis?: unknown }).analysis as { mentions?: unknown } | null;
    const mentions = Array.isArray(analysis?.mentions) ? (analysis!.mentions as Mention[]) : [];
    const cleaned = mentions
      .map((m) => ({
        brand: typeof m.brand === "string" ? m.brand.trim() : "",
        type: typeof m.type === "string" ? m.type.trim() : "none"
      }))
      .filter((m) => m.brand.length > 0);
    map.set(runId, cleaned);
  }
  return map;
}

