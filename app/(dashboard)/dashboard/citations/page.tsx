import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/ui/cn";

import {
  citationTypeLabel,
  getDemoCitationsData,
  type DemoCitationType
} from "@/lib/demo/demo-citations";

type SearchParams = Record<string, string | string[] | undefined>;

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function pillClass(type: DemoCitationType) {
  switch (type) {
    case "brand_owned":
      return "bg-blue-600/10 text-blue-300 border-blue-600/20";
    case "wikipedia":
      return "bg-slate-800/50 text-slate-200 border-slate-700";
    case "publisher":
      return "bg-indigo-500/10 text-indigo-300 border-indigo-500/20";
    case "competitor":
      return "bg-amber-500/10 text-amber-300 border-amber-500/20";
    case "government":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  }
}

function DonutChart({
  segments
}: {
  segments: Array<{ label: string; value: number; color: string }>;
}) {
  const size = 240;
  const stroke = 22;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label="Donut chart">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(30,41,59,0.75)"
          strokeWidth={stroke}
        />
        {segments.map((s) => {
          const dash = s.value * c;
          const dashArray = `${dash} ${c - dash}`;
          const dashOffset = -offset;
          offset += dash;
          return (
            <circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={stroke}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
        })}
      </svg>
    </div>
  );
}

function typeColor(type: DemoCitationType) {
  switch (type) {
    case "brand_owned":
      return "#3b82f6";
    case "wikipedia":
      return "#94a3b8";
    case "publisher":
      return "#6366f1";
    case "competitor":
      return "#f59e0b";
    case "government":
      return "#34d399";
  }
}

// TODO(nextjs): Revert searchParams typing to `{ searchParams: SearchParams }`
// once Next.js PageProps no longer requires Promise-wrapped searchParams.
// This is a temporary workaround for a Next.js 15.x typing regression.
export default async function DashboardCitationsPage({
  searchParams
}: {
  searchParams?: Promise<SearchParams>;
}) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const isDemo = resolvedSearchParams.demo === "true";
  const demo = isDemo ? getDemoCitationsData() : null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Citation Source Breakdown</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Understand which sources are referenced or implied in AI-generated answers
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-900">
          <CardHeader>
            <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              TOTAL CITATIONS
            </CardTitle>
          </CardHeader>
          <div className="mt-1 text-3xl font-semibold text-slate-100">
            {demo ? demo.totals.totalCitations : "—"}
          </div>
          <CardDescription className="mt-2">across all prompts</CardDescription>
        </Card>

        <Card className="border-slate-200 dark:border-slate-900">
          <CardHeader>
            <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              BRAND-OWNED
            </CardTitle>
          </CardHeader>
          <div className="mt-1 text-3xl font-semibold text-slate-100">
            {demo ? percent(demo.totals.brandOwnedRate) : "—"}
          </div>
          <div className="mt-3">
            <Progress value={demo ? Math.round(demo.totals.brandOwnedRate * 100) : 0} className="bg-slate-800" />
          </div>
        </Card>

        <Card className="border-slate-200 dark:border-slate-900">
          <CardHeader>
            <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              AUTHORITY SCORE
            </CardTitle>
          </CardHeader>
          <div className="mt-1 text-3xl font-semibold text-slate-100">
            {demo ? `${Math.round(demo.totals.averageAuthority)}%` : "—"}
          </div>
          <CardDescription className="mt-2">average across sources</CardDescription>
        </Card>

        <Card className={cn("border-slate-200 dark:border-slate-900", demo ? "border-amber-500/40" : "")}>
          <CardHeader>
            <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              MISSING CITATIONS
            </CardTitle>
          </CardHeader>
          <div className="mt-1 text-3xl font-semibold text-slate-100">
            {demo ? demo.totals.missingCitations : "—"}
          </div>
          <CardDescription className="mt-2">prompts without sources</CardDescription>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Citation Distribution by Type</CardTitle>
            <CardDescription className="text-xs">
              {demo ? "Illustrative example — not real measurements." : "UI-only placeholder."}
            </CardDescription>
          </CardHeader>
          {demo ? (
            <div className="mt-6 grid gap-6 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <DonutChart
                  segments={[
                    { label: "Brand Owned", value: demo.byType.find((t) => t.type === "brand_owned")?.percent ?? 0, color: "#3b82f6" },
                    { label: "Wikipedia", value: demo.byType.find((t) => t.type === "wikipedia")?.percent ?? 0, color: "#94a3b8" },
                    { label: "Publisher", value: demo.byType.find((t) => t.type === "publisher")?.percent ?? 0, color: "#6366f1" },
                    { label: "Competitor", value: demo.byType.find((t) => t.type === "competitor")?.percent ?? 0, color: "#f59e0b" },
                    { label: "Government", value: demo.byType.find((t) => t.type === "government")?.percent ?? 0, color: "#34d399" }
                  ]}
                />
              </div>

              <div className="md:col-span-5">
                <div className="space-y-2 text-sm">
                  {demo.byType.map((row) => (
                    <div key={row.type} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-slate-300">
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: typeColor(row.type) }} />
                        <span>{row.label}</span>
                      </div>
                      <div className="text-slate-400">{percent(row.percent)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {["brand_owned", "wikipedia", "government", "publisher", "unknown"].map((t) => (
                <div key={t} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Badge>{t}</Badge>
                      <span className="text-slate-600 dark:text-slate-400">— citations</span>
                    </div>
                    <span className="text-slate-600 dark:text-slate-400">—</span>
                  </div>
                  <Progress value={0} />
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source Type Analysis</CardTitle>
            <CardDescription className="text-xs">
              {demo ? "How citations break down across source types." : "UI-only placeholder."}
            </CardDescription>
          </CardHeader>
          {demo ? (
            <div className="mt-4 space-y-3">
              {demo.byType.map((row) => (
                <div
                  key={row.type}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold",
                        pillClass(row.type)
                      )}
                    >
                      {row.label}
                    </span>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {row.count} {row.count === 1 ? "citation" : "citations"}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">{(row.percent * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {["brand_owned", "wikipedia", "government", "publisher", "unknown"].map((t) => (
                <div
                  key={t}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="flex items-center gap-2">
                    <Badge>{t}</Badge>
                    <div className="text-sm text-slate-600 dark:text-slate-400">—</div>
                  </div>
                  <div className="text-sm font-medium">—</div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Citations</CardTitle>
          <CardDescription className="text-xs">
            {demo ? "Sample citations extracted from demo prompts." : "TODO: render citation rows."}
          </CardDescription>
        </CardHeader>
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-[720px] w-full text-left text-sm">
            <thead className="text-xs text-slate-600 dark:text-slate-400">
              <tr className="border-b border-slate-200 dark:border-slate-900">
                <th className="py-2 pr-4">Source URL</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Domain</th>
                <th className="py-2 text-right">Authority Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-900">
              {demo ? (
                demo.rows.map((row) => (
                  <tr key={row.url} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="py-4 pr-4">
                      <a
                        href={row.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
                      >
                        <span className="break-all">{row.url}</span>
                        <span className="text-slate-500">↗</span>
                      </a>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md border px-2 py-1 text-[11px] font-semibold",
                          pillClass(row.type)
                        )}
                      >
                        {citationTypeLabel(row.type)}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-slate-600 dark:text-slate-400">{row.domain}</td>
                    <td className="py-4 text-right">
                      <span className="inline-flex items-center rounded-md bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
                        {row.authority}%
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-4 text-slate-600 dark:text-slate-400" colSpan={4}>
                    No citations loaded.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {demo ? (
        <Card className="border-amber-500/40 bg-amber-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="text-amber-300">ⓘ</span>
              <CardTitle>Missing Citation Opportunities</CardTitle>
            </div>
          </CardHeader>
          <CardDescription>
            {demo.totals.missingCitations} prompt generated answers without citing any sources. This may
            indicate opportunities to improve content discoverability or authority signals.
          </CardDescription>
        </Card>
      ) : null}
    </div>
  );
}
