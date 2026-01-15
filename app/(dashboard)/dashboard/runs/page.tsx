import { PromptExplorer } from "@/components/dashboard/prompt-explorer";
import { DEMO_PRIMARY_BRAND } from "@/lib/demo/demo-brands";
import { DEMO_PROMPT_DETAILS } from "@/lib/demo/demo-prompt-details";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { requireUser } from "@/lib/auth/requireUser";
import { getPromptMentionsForRuns } from "@/lib/promptRuns/getPromptMentionsForRuns";

type SearchParams = Record<string, string | string[] | undefined>;

type MentionType = "primary" | "secondary" | "implied" | "none";

function toMentionTypeForPrimary(args: { mentions: { brand: string; type: string }[]; brand: string }): MentionType {
  const match = args.mentions.find((m) => m.brand === args.brand);
  const value = match?.type ?? "none";
  if (value === "primary") return "primary";
  if (value === "secondary") return "secondary";
  if (value === "implied") return "implied";
  return "none";
}

export default async function DashboardRunsPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isDemo = resolvedSearchParams.demo === "true";
  const auditIdParam =
    typeof resolvedSearchParams.audit_id === "string" ? resolvedSearchParams.audit_id : null;

  const demoPrompts = DEMO_PROMPT_DETAILS.map((detail) => ({
    runId: detail.runId,
    promptName: detail.promptName,
    intent: detail.intent,
    promptAsked: detail.promptAsked,
    answerPreview: null,
    citationCount: detail.citations.length,
    mentionType: toMentionTypeForPrimary({ mentions: detail.mentions, brand: DEMO_PRIMARY_BRAND.name }),
    mentions: detail.mentions
  }));

  const user = isDemo ? null : await requireUser();
  const dashboard = isDemo ? null : await getDashboardData({ auditId: auditIdParam, userId: user?.id });

  const liveMentions = dashboard
    ? await getPromptMentionsForRuns(dashboard.prompts.map((p) => p.runId).filter(Boolean) as string[])
    : new Map();

  const livePrompts = (dashboard?.prompts ?? []).map((row) => ({
    runId: row.runId,
    promptName: row.promptName,
    intent: row.intent,
    promptAsked: row.promptAsked,
    answerPreview: row.answerPreview,
    citationCount: row.citationCount,
    mentionType: row.result.mentionType,
    mentions: row.runId ? (liveMentions.get(row.runId) ?? null) : null
  }));

  const prompts = isDemo ? demoPrompts : livePrompts;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Prompt Explorer</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          {isDemo
            ? "Explore AI answers and brand visibility across all prompts"
            : "Explore AI answers and brand visibility across all prompts"}
        </p>
      </div>

      <PromptExplorer
        demoMode={isDemo}
        brandName={isDemo ? DEMO_PRIMARY_BRAND.name : dashboard?.audit.brandName ?? null}
        category={isDemo ? DEMO_PRIMARY_BRAND.industry : dashboard?.audit.category ?? null}
        prompts={prompts}
      />
    </div>
  );
}
