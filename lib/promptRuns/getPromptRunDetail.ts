import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { parsePromptRunRaw } from "@/lib/promptRuns/parsePromptRunRaw";
import { classifySourceType, authorityScoreForType, getDomain } from "@/lib/citations/classifySource";

export type PromptRunDetail = {
  id: string;
  auditId: string | null;
  promptId: string | null;
  brandName: string;
  model: string;
  executedAt: string | null;
  promptAsked: string | null;
  answerText: string | null;
  citations: Array<{
    url: string;
    domain: string | null;
    sourceType: string | null;
    authorityScore: number;
  }>;
  openaiRaw: string | null;
  presence: {
    brandDetected: boolean;
    mentionType: string | null;
    citationPresent: boolean;
    confidence: number | null;
  } | null;
};

export async function getPromptRunDetail(runId: string): Promise<PromptRunDetail | null> {
  const supabase = createSupabaseAdminClient();
  const { data: run, error: runError } = await supabase
    .from("ai_prompt_runs")
    .select("id,audit_id,prompt_id,brand_name,model,raw_response,executed_at")
    .eq("id", runId)
    .maybeSingle();

  if (runError) throw new Error(runError.message);
  if (!run) return null;

  const raw = parsePromptRunRaw((run.raw_response as string) ?? "");

  const { data: presence, error: presenceError } = await supabase
    .from("ai_brand_presence")
    .select("brand_detected,mention_type,citation_present,confidence")
    .eq("prompt_run_id", runId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (presenceError) throw new Error(presenceError.message);

  const { data: citationRows, error: citationError } = await supabase
    .from("ai_citations")
    .select("source_url,source_type")
    .eq("prompt_run_id", runId)
    .limit(200);

  if (citationError) {
    if (!citationError.message.includes("ai_citations") && !citationError.message.includes("relation")) {
      throw new Error(citationError.message);
    }
  }

  const citations =
    (citationRows ?? []).map((row) => {
      const url = row.source_url as string;
      const storedType = (row.source_type as string | null) ?? null;
      const computedType = classifySourceType({ url, brandName: run.brand_name as string });
      const authorityScore = authorityScoreForType(computedType);
      return {
        url,
        domain: getDomain(url),
        sourceType: storedType ?? computedType,
        authorityScore
      };
    }) ?? [];

  return {
    id: run.id as string,
    auditId: (run.audit_id as string | null) ?? null,
    promptId: (run.prompt_id as string | null) ?? null,
    brandName: run.brand_name as string,
    model: run.model as string,
    executedAt: (run.executed_at as string | null) ?? null,
    promptAsked: raw.prompt,
    answerText: raw.answer_text,
    citations,
    openaiRaw: raw.openai_raw,
    presence: presence
      ? {
          brandDetected: Boolean(presence.brand_detected),
          mentionType: (presence.mention_type as string | null) ?? null,
          citationPresent: Boolean(presence.citation_present),
          confidence: (presence.confidence as number | null) ?? null
        }
      : null
  };
}

