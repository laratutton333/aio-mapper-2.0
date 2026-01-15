"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/components/ui/cn";
import type {
  BrandMetrics,
  BrandVsCompetitorsData,
  IntentGroup,
  VisibilityMetric
} from "@/lib/demo/demo-brand-vs-competitors";
import { getDemoComparisonSummary } from "@/lib/demo/demo-brand-vs-competitors";

type View = "overview" | "intent" | "detail";

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function overallScore(row: BrandMetrics) {
  return (row.presence + row.citations + row.recommendations) / 3;
}

function MetricPill({ ok }: { ok: boolean }) {
  return (
    <span className={cn("text-sm font-semibold", ok ? "text-emerald-300" : "text-slate-400")}>
      ~ Leading
    </span>
  );
}

function TabButton({
  active,
  onClick,
  children
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md px-3 py-2 text-sm transition-colors",
        active
          ? "bg-slate-950 text-slate-100 shadow-sm shadow-black/20 dark:bg-slate-900"
          : "text-slate-500 hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function Legend() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
      <div className="flex items-center gap-2">
        <span className="h-2 w-3 rounded-sm bg-blue-500" />
        <span>Presence Rate</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-3 rounded-sm bg-emerald-400" />
        <span>Citation Rate</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="h-2 w-3 rounded-sm bg-slate-300" />
        <span>Recommendation Rate</span>
      </div>
    </div>
  );
}

function TripleBarRow({ row }: { row: BrandMetrics }) {
  return (
    <div className="grid gap-3 sm:grid-cols-12 sm:items-center">
      <div className="min-w-0 sm:col-span-3">
        <div className="truncate text-sm font-semibold text-slate-100">{row.brand.name}</div>
      </div>
      <div className="space-y-2 sm:col-span-9">
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-slate-800">
            <div className="h-2 rounded-full bg-blue-500" style={{ width: `${row.presence * 100}%` }} />
          </div>
          <div className="w-10 text-right text-xs text-slate-400">{percent(row.presence)}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-emerald-400"
              style={{ width: `${row.citations * 100}%` }}
            />
          </div>
          <div className="w-10 text-right text-xs text-slate-400">{percent(row.citations)}</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 flex-1 rounded-full bg-slate-800">
            <div
              className="h-2 rounded-full bg-slate-300"
              style={{ width: `${row.recommendations * 100}%` }}
            />
          </div>
          <div className="w-10 text-right text-xs text-slate-400">{percent(row.recommendations)}</div>
        </div>
      </div>
    </div>
  );
}

function OverviewCharts({ data, demoMode }: { data: BrandVsCompetitorsData; demoMode?: boolean }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI Visibility Comparison</CardTitle>
          <CardDescription className="text-xs">
            {demoMode ? "Illustrative example — not real measurements." : "Comparison across your brand and competitors."}
          </CardDescription>
        </CardHeader>
        <div className="mt-4 space-y-6">
          {data.brands.map((row) => (
            <TripleBarRow key={row.brand.id} row={row} />
          ))}
        </div>
        <Legend />
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <span className="text-slate-300">Share of AI Recommendations</span>
            {demoMode ? (
              <Badge className="border-slate-800 bg-slate-900 text-slate-200">Sample Data</Badge>
            ) : null}
          </div>
        </CardHeader>
        <div className="mt-4 space-y-4">
          {data.brands
            .slice()
            .sort((a, b) => b.recommendations - a.recommendations)
            .map((row) => (
              <div key={row.brand.id}>
                <div className="flex items-center justify-between text-sm">
                  <div className="text-slate-200">{row.brand.name}</div>
                  <div className="text-slate-200">{percent(row.recommendations)}</div>
                </div>
                <div className="mt-2">
                  <Progress value={Math.round(row.recommendations * 100)} className="bg-slate-800" />
                </div>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}

function IntentCard({ title, rows }: { title: IntentGroup; rows: BrandMetrics[] }) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-base">{title} Prompts</CardTitle>
      </CardHeader>
      <div className="mt-4 space-y-6">
        {rows.map((row) => (
          <TripleBarRow key={`${title}-${row.brand.id}`} row={row} />
        ))}
      </div>
      <Legend />
    </Card>
  );
}

function DetailedTable({ data, demoMode }: { data: BrandVsCompetitorsData; demoMode?: boolean }) {
  const rows = data.brands
    .slice()
    .sort((a, b) => overallScore(b) - overallScore(a))
    .map((row) => ({
      ...row,
      overall: overallScore(row)
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Metrics Comparison</CardTitle>
        <CardDescription className="text-xs">
          {demoMode ? "Sample data for illustration." : "Per-brand metrics derived from stored audit results."}
        </CardDescription>
      </CardHeader>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-[720px] w-full text-left text-sm">
          <thead className="text-xs text-slate-400">
            <tr className="border-b border-slate-800">
              <th className="px-4 py-3 font-semibold">Brand</th>
              <th className="px-4 py-3 font-semibold">Presence</th>
              <th className="px-4 py-3 font-semibold">Citations</th>
              <th className="px-4 py-3 font-semibold">Recommendations</th>
              <th className="px-4 py-3 text-right font-semibold">Overall Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {rows.map((row) => {
              const isPrimary = row.brand.id === data.primary.id;
              return (
                <tr key={row.brand.id} className={cn(isPrimary ? "bg-blue-600/5" : "")}>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-slate-100">{row.brand.name}</span>
                      {isPrimary ? (
                        <span className="rounded-full border border-slate-800 bg-slate-950 px-2 py-0.5 text-xs text-slate-200">
                          You
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-100">{percent(row.presence)}</td>
                  <td className="px-4 py-4 text-slate-100">{percent(row.citations)}</td>
                  <td className="px-4 py-4 text-slate-100">{percent(row.recommendations)}</td>
                  <td className="px-4 py-4 text-right font-semibold text-slate-100">{percent(row.overall)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export function BrandVsCompetitors({
  data,
  demoMode
}: {
  data: BrandVsCompetitorsData;
  demoMode?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const viewParam = searchParams.get("view");
  const view: View = viewParam === "intent" || viewParam === "detail" ? viewParam : "overview";

  function setView(next: View) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", next);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const summary = React.useMemo(() => getDemoComparisonSummary(data), [data]);

  const cards: Array<{ metric: VisibilityMetric; label: string; value: number; avg: number; leading: boolean }> =
    [
      {
        metric: "presence",
        label: "PRESENCE RATE",
        value: summary.primary.presence,
        avg: summary.competitorAverages.presence,
        leading: summary.leading.presence
      },
      {
        metric: "citations",
        label: "CITATION RATE",
        value: summary.primary.citations,
        avg: summary.competitorAverages.citations,
        leading: summary.leading.citations
      },
      {
        metric: "recommendations",
        label: "RECOMMENDATION RATE",
        value: summary.primary.recommendations,
        avg: summary.competitorAverages.recommendations,
        leading: summary.leading.recommendations
      }
    ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Brand vs Competitors</h1>
          {demoMode ? (
            <Badge className="border-slate-800 bg-slate-900 text-slate-200">Sample Data</Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Compare AI visibility metrics across your brand and competitors
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.metric} className="border-slate-200 dark:border-slate-900">
            <CardHeader>
              <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {card.label}
              </CardTitle>
            </CardHeader>
            <div className="mt-1 flex items-end justify-between gap-4">
              <div>
                <div className="text-3xl font-semibold text-slate-100">{percent(card.value)}</div>
                <div className="mt-1 text-xs text-slate-400">vs {percent(card.avg)} competitor avg</div>
              </div>
              <MetricPill ok={card.leading} />
            </div>
          </Card>
        ))}
      </div>

      <div className="flex w-full flex-wrap items-center gap-1 rounded-xl border border-slate-800 bg-slate-950/40 p-1">
        <TabButton active={view === "overview"} onClick={() => setView("overview")}>
          Overview
        </TabButton>
        <TabButton active={view === "intent"} onClick={() => setView("intent")}>
          By Intent
        </TabButton>
        <TabButton active={view === "detail"} onClick={() => setView("detail")}>
          Detailed View
        </TabButton>
      </div>

      {view === "overview" ? (
        <OverviewCharts data={data} demoMode={demoMode} />
      ) : view === "intent" ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {(Object.keys(data.byIntent) as IntentGroup[]).map((intent) => (
            <IntentCard key={intent} title={intent} rows={data.byIntent[intent]} />
          ))}
        </div>
      ) : (
        <DetailedTable data={data} demoMode={demoMode} />
      )}
    </div>
  );
}
