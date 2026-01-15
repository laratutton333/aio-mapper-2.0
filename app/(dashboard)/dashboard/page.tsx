import Link from "next/link";

import { RunVisibilityForm } from "@/components/dashboard/run-visibility-form";
import { Sparkline } from "@/components/ui/sparkline";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/components/ui/cn";
import { getDemoDashboardData } from "@/lib/demo/demo-dashboard";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";
import { requireUser } from "@/lib/auth/requireUser";
import { getCompetitorsForAudit } from "@/lib/competitors/getCompetitorsForAudit";

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function formatDelta(value: number) {
  const percent = Math.abs(value) * 100;
  const sign = value >= 0 ? "+" : "-";
  return `${sign}${percent.toFixed(1)}%`;
}

function DeltaPill({ value }: { value: number }) {
  const isPositive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
        isPositive ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
      )}
    >
      {formatDelta(value)} <span className="font-normal text-slate-400">vs last week</span>
    </span>
  );
}

function DemoBanner() {
  return (
    <div className="rounded-xl border border-blue-600/40 bg-blue-600/10 px-4 py-3 text-sm text-slate-200">
      <span className="font-semibold text-blue-300">Demo Mode</span>{" "}
      <span className="text-slate-300">
        Sample data only. Nothing here is real, exportable, or saved.
      </span>
    </div>
  );
}

function IntentBadge({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs text-slate-300">
      {value}
    </span>
  );
}

function StatusBadge({ value }: { value: "Completed" | "Queued" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
        value === "Completed"
          ? "bg-blue-600/15 text-blue-300"
          : "bg-slate-800/50 text-slate-300"
      )}
    >
      {value}
    </span>
  );
}

function PresenceBadge({ brandName, mentionType }: { brandName: string; mentionType: string }) {
  const label =
    mentionType === "primary"
      ? `${brandName} (Primary)`
      : mentionType === "secondary"
        ? `${brandName} (Secondary)`
        : mentionType === "implied"
          ? `${brandName} (Implied)`
          : "No mention";

  const className =
    mentionType === "primary"
      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/20"
      : mentionType === "secondary"
        ? "bg-blue-600/10 text-blue-300 border-blue-600/20"
        : mentionType === "implied"
          ? "bg-slate-800/40 text-slate-300 border-slate-700"
          : "bg-slate-950 text-slate-400 border-slate-800";

  return (
    <span className={cn("inline-flex items-center rounded-full border px-2 py-0.5 text-xs", className)}>
      {label}
    </span>
  );
}

type SearchParams = Record<string, string | string[] | undefined>;

export default async function DashboardOverviewPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isDemo = resolvedSearchParams.demo === "true";
  const auditIdParam =
    typeof resolvedSearchParams.audit_id === "string" ? resolvedSearchParams.audit_id : null;

  const demo = isDemo ? getDemoDashboardData() : null;

  const user = isDemo ? null : await requireUser();
  const dashboard = isDemo ? null : await getDashboardData({ auditId: auditIdParam, userId: user?.id });

  const data = demo ?? dashboard;
  const brandName = data?.audit.brandName ?? "your brand";

  const competitors =
    isDemo
      ? demo?.demo.competitors ?? []
      : dashboard?.audit.auditId
        ? await getCompetitorsForAudit({
            auditId: dashboard.audit.auditId,
            primaryBrandName: dashboard.audit.brandName
          })
        : [];

  const metrics = data
    ? [
        {
          label: "VISIBILITY SCORE",
          value: formatPercent(data.summary.visibilityScore),
          delta: demo?.demo.deltas.visibilityScore ?? 0
        },
        {
          label: "PRESENCE RATE",
          value: formatPercent(data.summary.presenceRate),
          delta: demo?.demo.deltas.presenceRate ?? 0
        },
        {
          label: "CITATION RATE",
          value: formatPercent(data.summary.citationRate),
          delta: demo?.demo.deltas.citationRate ?? 0
        },
        {
          label: "RECOMMENDATION RATE",
          value: formatPercent(data.summary.recommendationRate),
          delta: demo?.demo.deltas.recommendationRate ?? 0
        }
      ]
    : [
        { label: "VISIBILITY SCORE", value: "—", delta: 0 },
        { label: "PRESENCE RATE", value: "—", delta: 0 },
        { label: "CITATION RATE", value: "—", delta: 0 },
        { label: "RECOMMENDATION RATE", value: "—", delta: 0 }
      ];

  return (
    <div className="flex flex-col gap-6">
      {isDemo ? <DemoBanner /> : null}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-semibold tracking-tight">AI Visibility Overview</h1>
            {isDemo ? (
              <Badge className="border-slate-800 bg-slate-900 text-slate-200">Sample Data</Badge>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {isDemo
              ? `Track how ${brandName} appears across AI-generated answers`
              : `Track how ${brandName} appears across AI-generated answers`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            href={isDemo ? "/dashboard?demo=true" : "/dashboard"}
          >
            Refresh
          </Link>

          <Link
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white",
              isDemo ? "cursor-not-allowed bg-blue-600/40 pointer-events-none" : "bg-blue-600 hover:bg-blue-500"
            )}
            href={isDemo ? "/account" : "#run-audit"}
            title={
              isDemo
                ? "Demo mode uses sample data only. Running a real audit requires an account."
                : "Run a new audit"
            }
          >
            Run Audit
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-slate-200 dark:border-slate-900">
            <CardHeader className="items-start">
              <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <div className="mt-1 text-3xl font-semibold">{metric.value}</div>
            <div className="mt-2">
              {data ? <DeltaPill value={metric.delta} /> : <CardDescription>—</CardDescription>}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visibility Score Trend</CardTitle>
            <CardDescription className="text-xs">
              {isDemo ? "Illustrative example — not real measurements." : "Latest audits over time."}
            </CardDescription>
          </CardHeader>
          <div className="mt-4">
            <Sparkline values={data ? data.trend.map((t) => t.visibilityScore) : []} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-4">
            {(
              data
                ? [
                    { label: "Presence", value: data.summary.presenceRate },
                    { label: "Citations", value: data.summary.citationRate },
                    { label: "Recommendations", value: data.summary.recommendationRate },
                    { label: "Authority Diversity", value: data.summary.authorityDiversity }
                  ]
                : [
                    { label: "Presence", value: 0 },
                    { label: "Citations", value: 0 },
                    { label: "Recommendations", value: 0 },
                    { label: "Authority Diversity", value: 0 }
                  ]
            ).map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{row.label}</span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {data ? formatPercent(row.value) : "—"}
                  </span>
                </div>
                <div className="mt-2">
                  <Progress value={Math.round(row.value * 100)} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Prompt Results</CardTitle>
              <CardDescription className="text-xs">
                {isDemo ? "Sample runs for illustration." : "Latest prompt runs for the selected audit."}
              </CardDescription>
            </div>
            <Link
              href={isDemo ? "/dashboard/runs?demo=true" : "/dashboard/runs"}
              className="text-sm text-slate-300 hover:text-white"
            >
              View All →
            </Link>
          </CardHeader>

          {data ? (
            <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs text-slate-600 dark:bg-slate-950 dark:text-slate-400">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Prompt</th>
                    <th className="px-4 py-3 font-semibold">Intent</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Brand Presence</th>
                    <th className="px-4 py-3 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-900 dark:bg-slate-950">
                  {data.prompts.slice(0, 6).map((row) => (
                    <tr key={row.promptId} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="px-4 py-4 text-slate-900 dark:text-slate-100">
                        {row.promptName}
                      </td>
                      <td className="px-4 py-4">
                        <IntentBadge value={row.intent} />
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge value="Completed" />
                      </td>
                      <td className="px-4 py-4">
                        <PresenceBadge brandName={brandName} mentionType={row.result.mentionType} />
                      </td>
                      <td className="px-4 py-4 text-right">
                        {row.runId ? (
                          <Link
                            href={isDemo ? `/dashboard/runs?demo=true&run=${row.runId}` : `/dashboard/runs?run=${row.runId}`}
                            className="text-xs text-slate-500 hover:text-slate-200"
                          >
                            View
                          </Link>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              No runs yet.
            </div>
          )}
        </Card>

        <Card id="run-audit">
          <CardHeader>
            <CardTitle>Run Audit</CardTitle>
            <CardDescription>
              {isDemo
                ? "Demo mode is read-only. Create an account to run a real audit."
                : "Run a new audit and save results to your dashboard."}
            </CardDescription>
          </CardHeader>
          <div className={cn("mt-4", isDemo ? "opacity-50 pointer-events-none" : "")}>
            <RunVisibilityForm />
          </div>
          {isDemo ? (
            <div className="mt-4">
              <Link
                href="/account"
                className="inline-flex h-10 w-full items-center justify-center rounded-md bg-blue-600 text-sm font-medium text-white hover:bg-blue-500"
              >
                Run on my site →
              </Link>
              <p className="mt-2 text-xs text-slate-500">
                Demo data is illustrative only. Running a real analysis will consume credits.
              </p>
            </div>
          ) : null}
        </Card>
      </div>

      {data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle>Competitors Tracked</CardTitle>
              <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs text-slate-200">
                {competitors.length}
              </span>
            </CardHeader>
            <div className="mt-4 space-y-2">
              {competitors.map((brand) => (
                  <div
                    key={brand.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-900 dark:bg-slate-950"
                  >
                    <div>
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {brand.name}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">{brand.domain ?? "—"}</div>
                    </div>
                    <button
                      type="button"
                      className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-900"
                      disabled
                      title={isDemo ? "Demo mode is read-only." : "Competitor comparisons are read-only in this view."}
                    >
                      Compare
                    </button>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Audit Summary</CardTitle>
              <CardDescription className="text-xs">
                {isDemo ? "Sample data for illustration." : "Summary for the selected audit."}
              </CardDescription>
            </CardHeader>
            <div className="mt-4 space-y-3 text-sm">
              {[
                {
                  label: "Total Prompts",
                  value: String(isDemo ? demo!.demo.totalPrompts : data.prompts.length)
                },
                {
                  label: "Completed",
                  value: String(
                    isDemo ? demo!.demo.completedPrompts : data.prompts.filter((p) => p.runId).length
                  )
                },
                { label: "Audit Name", value: isDemo ? demo!.demo.auditName : "AI Visibility Audit" },
                { label: "Category", value: data.audit.category ?? "—", pill: true }
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between gap-4">
                  <div className="text-slate-600 dark:text-slate-400">{row.label}</div>
                  {row.pill ? (
                    <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs text-slate-200">
                      {row.value}
                    </span>
                  ) : (
                    <div className="text-slate-900 dark:text-slate-100">{row.value}</div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
