import Link from "next/link";

import { RunVisibilityForm } from "@/app/dashboard/run-visibility-form";
import { Sparkline } from "@/components/charts/sparkline";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { DashboardResponse } from "@/types/dashboard";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data: DashboardResponse = await getDashboardData();
  const trendValues = data.trend.map((t) => t.visibilityScore * 100);

  const percent = (value: number) => `${Math.round(value * 100)}%`;
  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">AI Visibility Overview</h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Track how {data.audit.brandName ?? "your brand"} appears across AI-generated answers.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
              href="/dashboard"
            >
              Refresh
            </Link>
            <Link
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
              href="#run-audit"
            >
              Run Audit
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200 dark:border-slate-900">
            <CardHeader>
              <CardTitle>Visibility Score</CardTitle>
              <Badge className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                Transparent
              </Badge>
            </CardHeader>
            <div className="mt-4 text-3xl font-semibold">
              {percent(data.summary.visibilityScore)}
            </div>
            <CardDescription className="mt-2">
              Average of presence, citations, and recommendations.
            </CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Presence Rate</CardTitle>
            </CardHeader>
            <div className="mt-4 text-3xl font-semibold">{percent(data.summary.presenceRate)}</div>
            <CardDescription className="mt-2">Prompts with any brand mention.</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Citation Rate</CardTitle>
            </CardHeader>
            <div className="mt-4 text-3xl font-semibold">{percent(data.summary.citationRate)}</div>
            <CardDescription className="mt-2">Prompts with at least one source URL.</CardDescription>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendation Rate</CardTitle>
            </CardHeader>
            <div className="mt-4 text-3xl font-semibold">
              {percent(data.summary.recommendationRate)}
            </div>
            <CardDescription className="mt-2">Prompts where brand is primary.</CardDescription>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Visibility Score Trend</CardTitle>
              <CardDescription className="text-xs">Last 10 audits for this brand.</CardDescription>
            </CardHeader>
            <div className="mt-4">
              <Sparkline values={trendValues.length ? trendValues : [0, data.summary.visibilityScore * 100]} />
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
            </CardHeader>
            <div className="mt-4 space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">Presence</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {percent(data.summary.presenceRate)}
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={data.summary.presenceRate * 100} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">Citations</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {percent(data.summary.citationRate)}
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={data.summary.citationRate * 100} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">Recommendations</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {percent(data.summary.recommendationRate)}
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={data.summary.recommendationRate * 100} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">Authority Diversity</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {percent(data.summary.authorityDiversity)}
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={data.summary.authorityDiversity * 100} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Prompt Results</CardTitle>
              <CardDescription className="text-xs">
                Evidence is available per prompt run.
              </CardDescription>
            </CardHeader>
            <div className="mt-4 divide-y divide-slate-200 dark:divide-slate-900">
              {data.prompts.map((prompt) => (
                <div key={prompt.promptId} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{prompt.intent}</Badge>
                      <Badge className="bg-slate-900 text-white dark:bg-slate-800">Completed</Badge>
                    </div>
                    <div className="mt-2 text-sm font-medium">{prompt.promptName}</div>
                    <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {prompt.answerPreview ?? "Run an audit to generate an answer preview."}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge
                        className={
                          prompt.result.mentionType === "primary"
                            ? "border-emerald-900/40 bg-emerald-950/50 text-emerald-200"
                            : prompt.result.mentionType === "secondary"
                              ? "border-blue-900/40 bg-blue-950/50 text-blue-200"
                              : prompt.result.mentionType === "implied"
                                ? "border-amber-900/40 bg-amber-950/50 text-amber-200"
                                : "border-slate-800 bg-slate-900 text-slate-200"
                        }
                      >
                        {data.audit.brandName ?? "Brand"} ({prompt.result.mentionType})
                      </Badge>
                      <Badge className="text-slate-600 dark:text-slate-300">
                        {prompt.citationCount} citations
                      </Badge>
                    </div>
                  </div>
                  <div className="shrink-0">
                    {prompt.runId ? (
                      <Link
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
                        href={`/dashboard/prompt-explorer/${prompt.runId}`}
                      >
                        View
                      </Link>
                    ) : (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card id="run-audit">
            <CardHeader>
              <CardTitle>Run Audit</CardTitle>
              <CardDescription>
                Executes active prompt templates sequentially and logs every response.
              </CardDescription>
            </CardHeader>
            <div className="mt-4">
              <RunVisibilityForm />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
