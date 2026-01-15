"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/components/ui/cn";
import type {
  DemoEffort,
  DemoImpact,
  DemoRecommendation,
  DemoRecommendationCategory,
  DemoRecommendationStatus,
  DemoRecommendationsData
} from "@/lib/demo/demo-recommendations";

type CategoryFilter = "All" | DemoRecommendationCategory;
type StatusFilter = "All" | DemoRecommendationStatus;

function metricLabel(status: DemoRecommendationStatus) {
  if (status === "Pending") return "PENDING";
  if (status === "In Progress") return "IN PROGRESS";
  return "COMPLETED";
}

function impactPill(impact: DemoImpact) {
  if (impact === "High") return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-300";
  if (impact === "Medium") return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300";
  return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/60 dark:text-slate-200 dark:border-slate-700";
}

function effortPill(effort: DemoEffort) {
  if (effort === "Low") return "bg-teal-500/10 text-teal-700 border-teal-500/20 dark:text-teal-300";
  if (effort === "Medium") return "bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-300";
  return "bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-300";
}

function statusPill(status: DemoRecommendationStatus) {
  if (status === "Pending") return "text-slate-500 dark:text-slate-400";
  if (status === "In Progress") return "text-blue-700 dark:text-blue-300";
  return "text-emerald-700 dark:text-emerald-300";
}

function FilterChip({
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
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
        active
          ? "border-slate-300 bg-slate-100 text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
          : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-400 dark:hover:bg-slate-900/40 dark:hover:text-slate-200"
      )}
    >
      {children}
    </button>
  );
}

function TopButton({
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
        "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
        active
          ? "border-blue-600/40 bg-blue-600 text-white dark:border-blue-600/50"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-900"
      )}
    >
      {children}
    </button>
  );
}

function RecommendationIcon({ category }: { category: DemoRecommendationCategory }) {
  if (category === "Structure") return <span className="text-slate-500 dark:text-slate-300">S</span>;
  if (category === "Authority") return <span className="text-slate-500 dark:text-slate-300">A</span>;
  return <span className="text-slate-500 dark:text-slate-300">C</span>;
}

function EvidenceDrawer({
  item,
  onClose,
  demoMode
}: {
  item: DemoRecommendation;
  onClose: () => void;
  demoMode?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-label="Close evidence"
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto overflow-x-hidden border-l border-slate-200 bg-white p-6 text-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {demoMode ? (
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-600/15 dark:text-blue-300">
                  Sample Data
                </span>
              ) : null}
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                  impactPill(item.impact)
                )}
              >
                {item.impact.toLowerCase()} impact
              </span>
              <span
                className={cn(
                  "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                  effortPill(item.effort)
                )}
              >
                {item.effort.toLowerCase()} effort
              </span>
            </div>
            <div className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{item.title}</div>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {demoMode ? "Evidence is illustrative only and not exportable in demo mode." : "Evidence highlights for this recommendation."}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-200 dark:hover:bg-slate-900"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-6">
          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">WHY THIS MATTERS</div>
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900/40 dark:text-slate-100">
              {item.why}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">BASED ON</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {item.evidence.basedOn.map((row) => (
                <div key={row} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span>{row}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold tracking-wide text-slate-500 dark:text-slate-400">OBSERVED PATTERNS</div>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {item.evidence.observedPatterns.map((row) => (
                <div key={row} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span>{row}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 text-xs text-slate-500">
            {demoMode
              ? "Demo views display fictional brands and simulated data for illustrative purposes only."
              : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecommendationsBoard({
  data,
  demoMode
}: {
  data: DemoRecommendationsData;
  demoMode?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const category = (searchParams.get("cat") as CategoryFilter | null) ?? "All";
  const status = (searchParams.get("status") as StatusFilter | null) ?? "All";
  const openEvidence = searchParams.get("evidence");

  const selected = React.useMemo(() => {
    if (!openEvidence) return null;
    return data.items.find((i) => i.id === openEvidence) ?? null;
  }, [data.items, openEvidence]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const filtered = React.useMemo(() => {
    return data.items.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (status !== "All" && item.status !== status) return false;
      return true;
    });
  }, [category, data.items, status]);

  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  async function startRecommendation(id: string) {
    if (demoMode) return;
    setUpdatingId(id);
    try {
      const res = await fetch("/api/recommendations", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id, status: "in_progress" })
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Recommendations</h1>
          {demoMode ? (
            <Badge className="border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-600/20 dark:bg-blue-600/15 dark:text-blue-300">
              Sample Data
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Actionable insights to improve {data.brandName}&apos;s AI visibility
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-900">
          <CardHeader>
            <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
              TOTAL RECOMMENDATIONS
            </CardTitle>
          </CardHeader>
          <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">{data.total}</div>
        </Card>
        {(Object.keys(data.counts) as DemoRecommendationStatus[]).map((key) => (
          <Card key={key} className="border-slate-200 dark:border-slate-900">
            <CardHeader>
              <CardTitle className="text-xs font-semibold tracking-wide text-slate-600 dark:text-slate-400">
                {metricLabel(key)}
              </CardTitle>
            </CardHeader>
            <div className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100">
              {data.counts[key]}
            </div>
          </Card>
        ))}
      </div>

      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-2">
          {(["All", "Content", "Authority", "Structure"] as CategoryFilter[]).map((value) => (
            <FilterChip
              key={value}
              active={category === value}
              onClick={() => setParam("cat", value === "All" ? null : value)}
            >
              {value}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {(["All", "Pending", "In Progress", "Completed"] as StatusFilter[]).map((value) => (
            <TopButton
              key={value}
              active={status === value}
              onClick={() => setParam("status", value === "All" ? null : value)}
            >
              {value}
            </TopButton>
          ))}
        </div>
      </div>

      <div className="text-xs text-slate-500">{filtered.length} recommendations</div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((item) => (
          <Card key={item.id} className="overflow-hidden border-slate-200 dark:border-slate-900">
            <CardHeader className="flex-col items-start">
              <div className="flex w-full items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
                    <RecommendationIcon category={item.category} />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {item.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{item.category}</div>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                      impactPill(item.impact)
                    )}
                  >
                    {item.impact.toLowerCase()} impact
                  </span>
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                      effortPill(item.effort)
                    )}
                  >
                    {item.effort.toLowerCase()} effort
                  </span>
                </div>
              </div>
            </CardHeader>

            <div className="px-4 pb-4">
              <p className="text-sm text-slate-700 dark:text-slate-300">{item.summary}</p>
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700 dark:border-slate-800 dark:bg-slate-900/30 dark:text-slate-300">
                <span className="font-semibold text-slate-900 dark:text-slate-200">Why:</span> {item.why}
              </div>

              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className={cn("text-sm", statusPill(item.status))}>{item.status}</div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setParam("evidence", item.id)}
                    className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  >
                    View Evidence
                  </button>
                  <button
                    type="button"
                    disabled={demoMode || item.status !== "Pending" || updatingId === item.id}
                    className={cn(
                      "inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium",
                      !demoMode && item.status === "Pending" && updatingId !== item.id
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                    )}
                    title={demoMode ? "Demo mode is read-only." : "Start tracking this recommendation."}
                    onClick={() => startRecommendation(item.id)}
                  >
                    {updatingId === item.id ? "Starting…" : "Start"}
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selected ? <EvidenceDrawer item={selected} demoMode={demoMode} onClose={() => setParam("evidence", null)} /> : null}
    </div>
  );
}
