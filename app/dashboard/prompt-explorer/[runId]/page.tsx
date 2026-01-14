import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getPromptRunDetail } from "@/lib/promptRuns/getPromptRunDetail";

export const dynamic = "force-dynamic";

export default async function PromptRunDetailPage({
  params
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const detail = await getPromptRunDetail(runId);

  if (!detail) {
    return (
      <div>
        <div className="text-sm text-slate-600 dark:text-slate-400">Not found.</div>
        <div className="mt-3">
          <Link className="text-sm text-blue-600 hover:underline" href="/dashboard/prompt-explorer">
            Back to Prompt Explorer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{detail.brandName}</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            Evidence breakdown for this prompt run.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {detail.presence?.mentionType ? <Badge>{detail.presence.mentionType}</Badge> : null}
            <Badge>{detail.model}</Badge>
            {detail.executedAt ? <Badge>{new Date(detail.executedAt).toLocaleString()}</Badge> : null}
          </div>
        </div>
        <Link
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          href="/dashboard/prompt-explorer"
        >
          Back
        </Link>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Prompt Asked</CardTitle>
            <CardDescription className="text-xs">Stored in `ai_prompt_runs.raw_response`.</CardDescription>
          </CardHeader>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {detail.promptAsked ?? "—"}
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Visibility Scores</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">Presence</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {detail.presence?.brandDetected ? "Yes" : "No"}
                </span>
              </div>
              <div className="mt-2">
                <Progress value={detail.presence?.brandDetected ? 100 : 0} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">Recommendation</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {detail.presence?.mentionType === "primary" ? "Primary" : "—"}
                </span>
              </div>
              <div className="mt-2">
                <Progress value={detail.presence?.mentionType === "primary" ? 100 : 0} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-300">Citations</span>
                <span className="text-slate-600 dark:text-slate-400">
                  {detail.citations.length}
                </span>
              </div>
              <div className="mt-2">
                <Progress value={detail.citations.length ? 100 : 0} />
              </div>
            </div>
          </div>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>AI Answer</CardTitle>
            <CardDescription className="text-xs">Raw text stored for auditability.</CardDescription>
          </CardHeader>
          <div className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            {detail.answerText ?? "—"}
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Citations ({detail.citations.length})</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-3">
            {detail.citations.length === 0 ? (
              <div className="text-sm text-slate-600 dark:text-slate-400">No citations detected.</div>
            ) : (
              detail.citations.map((c) => (
                <div
                  key={c.url}
                  className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      <a
                        className="text-blue-600 hover:underline dark:text-blue-400"
                        href={c.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.domain ?? c.url}
                      </a>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      <Badge>{c.sourceType ?? "unknown"}</Badge>
                      <Badge className="text-slate-600 dark:text-slate-300">
                        Authority: {Math.round(c.authorityScore * 100)}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}

