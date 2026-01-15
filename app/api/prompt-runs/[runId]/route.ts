import { requireUser } from "@/lib/auth/requireUser";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { classifySourceType, authorityScoreForType, getDomain } from "@/lib/citations/classifySource";
import { parsePromptRunRaw } from "@/lib/promptRuns/parsePromptRunRaw";

export const runtime = "nodejs";

type MentionType = "primary" | "secondary" | "implied" | "none";
type PromptAnalysis = {
  mentions?: Array<{ brand: string; type: MentionType }>;
  scores?: {
    presence_rate?: number;
    recommendation_rate?: number;
    citation_rate?: number;
    authority_diversity?: number;
  };
};

function labelForSourceType(type: string) {
  switch (type) {
    case "brand_owned":
      return "Brand Owned";
    case "wikipedia":
      return "Wikipedia";
    case "publisher":
      return "Publisher";
    case "government":
      return "Government";
    case "competitor":
      return "Competitor";
    default:
      return "Unknown";
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ runId: string }> }) {
  let userId: string;
  try {
    const user = await requireUser();
    userId = user.id;
  } catch {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { runId } = await params;
  const supabase = createSupabaseAdminClient();

  const { data: run, error: runError } = await supabase
    .from("ai_prompt_runs")
    .select("id,audit_id,prompt_id,brand_name,model,raw_response,executed_at,ai_audits!inner(user_id),ai_prompt_templates(name,intent)")
    .eq("id", runId)
    .eq("ai_audits.user_id", userId)
    .maybeSingle();

  if (runError) return Response.json({ error: runError.message }, { status: 500 });
  if (!run) return Response.json({ error: "Not found" }, { status: 404 });

  const raw = parsePromptRunRaw((run.raw_response as string) ?? "");

  const { data: analysisRow } = await supabase
    .from("ai_prompt_analysis")
    .select("analysis")
    .eq("prompt_run_id", runId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const analysis = (analysisRow?.analysis as PromptAnalysis | null) ?? null;
  const mentions = Array.isArray(analysis?.mentions) ? analysis!.mentions! : [];
  const scores = analysis?.scores ?? null;

  const { data: citationRows, error: citationError } = await supabase
    .from("ai_citations")
    .select("source_url,source_type,authority_score")
    .eq("prompt_run_id", runId)
    .limit(200);

  if (citationError) return Response.json({ error: citationError.message }, { status: 500 });

  const citations = (citationRows ?? []).map((row) => {
    const url = row.source_url as string;
    const storedType = (row.source_type as string | null) ?? null;
    const computedType = classifySourceType({ url, brandName: run.brand_name as string });
    const type = storedType ?? computedType;
    const authority =
      row.authority_score !== null && row.authority_score !== undefined
        ? Math.round((row.authority_score as number) * 100)
        : Math.round(authorityScoreForType(computedType) * 100);

    return {
      label: labelForSourceType(type),
      domain: getDomain(url),
      authority
    };
  });

  return Response.json({
    id: run.id as string,
    auditId: (run.audit_id as string | null) ?? null,
    promptId: (run.prompt_id as string | null) ?? null,
    promptName: (() => {
      const tmpl = run.ai_prompt_templates as { name?: unknown } | null;
      return typeof tmpl?.name === "string" ? tmpl.name : null;
    })(),
    intent: (() => {
      const tmpl = run.ai_prompt_templates as { intent?: unknown } | null;
      return typeof tmpl?.intent === "string" ? tmpl.intent : null;
    })(),
    brandName: run.brand_name as string,
    executedAt: (run.executed_at as string | null) ?? null,
    promptAsked: raw.prompt ?? null,
    answerText: raw.answer_text ?? null,
    mentions,
    citations,
    scores: {
      presenceRate: typeof scores?.presence_rate === "number" ? scores.presence_rate : 0,
      recommendationRate: typeof scores?.recommendation_rate === "number" ? scores.recommendation_rate : 0,
      citationRate: typeof scores?.citation_rate === "number" ? scores.citation_rate : 0,
      authorityDiversity: typeof scores?.authority_diversity === "number" ? scores.authority_diversity : 0
    }
  });
}
