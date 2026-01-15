"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/components/ui/cn";
import {
  DEMO_PROMPT_DETAIL_BY_RUN_ID,
  getDemoPromptPreview
} from "@/lib/demo/demo-prompt-details";
import { DEMO_PRIMARY_BRAND } from "@/lib/demo/demo-brands";

type IntentFilter = "informational" | "comparative" | "transactional" | "trust";
type MentionFilter = "any" | "primary" | "secondary" | "implied" | "none";
type MentionType = Exclude<MentionFilter, "any">;

export type PromptExplorerRow = {
  runId: string | null;
  promptName: string;
  intent: string;
  promptAsked: string | null;
  answerPreview: string | null;
  citationCount: number | null;
  mentionType: MentionType | null;
  mentions?: Array<{ brand: string; type: MentionType }> | null;
};

function normalizeIntent(intent: string): IntentFilter | null {
  const value = intent.trim().toLowerCase();
  if (value === "informational") return "informational";
  if (value === "comparative" || value === "comparison") return "comparative";
  if (value === "transactional") return "transactional";
  if (value === "trust" || value === "authority") return "trust";
  return null;
}

function mentionLabel(value: MentionFilter) {
  switch (value) {
    case "any":
      return "Any Mention";
    case "primary":
      return "Primary";
    case "secondary":
      return "Secondary";
    case "implied":
      return "Implied";
    case "none":
      return "Not Found";
  }
}

function intentLabel(value: IntentFilter) {
  switch (value) {
    case "informational":
      return "Informational";
    case "comparative":
      return "Comparative";
    case "transactional":
      return "Transactional";
    case "trust":
      return "Trust";
  }
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

function intentPillClass(value: IntentFilter | null) {
  if (value === "comparative") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/15";
  if (value === "informational") return "bg-blue-600/10 text-blue-300 border-blue-600/15";
  if (value === "transactional") return "bg-amber-500/10 text-amber-300 border-amber-500/15";
  if (value === "trust") return "bg-slate-800/60 text-slate-200 border-slate-700";
  return "bg-slate-950 text-slate-300 border-slate-800";
}

function mentionPillClass(value: MentionType) {
  if (value === "primary") return "bg-emerald-500/10 text-emerald-300 border-emerald-500/15";
  if (value === "secondary") return "bg-blue-600/10 text-blue-300 border-blue-600/15";
  if (value === "implied") return "bg-slate-800/50 text-slate-200 border-slate-700";
  return "bg-slate-950 text-slate-400 border-slate-800";
}

function ChevronRight() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5L21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function PromptExplorer({
  demoMode,
  brandName,
  category,
  prompts
}: {
  demoMode?: boolean;
  brandName?: string | null;
  category?: string | null;
  prompts: PromptExplorerRow[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = React.useState<string>("");
  const [intent, setIntent] = React.useState<Record<IntentFilter, boolean>>({
    informational: true,
    comparative: true,
    transactional: true,
    trust: true
  });
  const [mention, setMention] = React.useState<Record<MentionFilter, boolean>>({
    any: true,
    primary: true,
    secondary: true,
    implied: true,
    none: true
  });

  const openRunId = searchParams.get("run");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      const intentValue = normalizeIntent(p.intent);
      if (intentValue && !intent[intentValue]) return false;

      const mentionValue = (p.mentionType ?? "none") as MentionType;
      const includeNone = mention.none;
      const includeAnyMention = mention.any;
      const includeSpecific = mention[mentionValue] ?? false;
      if (includeAnyMention) {
        if (mentionValue === "none" && !includeNone) return false;
        if (mentionValue !== "none") {
          // ok: any mention allowed
        }
      } else {
        if (mentionValue === "none") {
          if (!includeNone) return false;
        } else if (!includeSpecific) {
          return false;
        }
      }

      if (!q) return true;
      const preview =
        demoMode && p.runId ? getDemoPromptPreview(p.runId)?.answerPreview ?? "" : p.answerPreview ?? "";
      const haystack = [p.promptName, p.promptAsked ?? "", p.answerPreview ?? "", preview, p.intent, mentionValue]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [demoMode, intent, mention, prompts, query]);

  const selectedDetail = React.useMemo(() => {
    if (!demoMode || !openRunId) return null;
    return DEMO_PROMPT_DETAIL_BY_RUN_ID.get(openRunId) ?? null;
  }, [demoMode, openRunId]);

  const [liveDetail, setLiveDetail] = React.useState<null | {
    id: string;
    promptName: string | null;
    intent: string | null;
    promptAsked: string | null;
    answerText: string | null;
    mentions: Array<{ brand: string; type: MentionType }>;
    citations: Array<{ label: string; domain: string | null; authority: number }>;
    scores: { presenceRate: number; recommendationRate: number; citationRate: number; authorityDiversity: number };
  }>(null);

  React.useEffect(() => {
    if (demoMode) return;
    if (!openRunId) {
      setLiveDetail(null);
      return;
    }

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(`/api/prompt-runs/${encodeURIComponent(openRunId)}`, {
          signal: controller.signal
        });
        if (!res.ok) {
          setLiveDetail(null);
          return;
        }
        const json = (await res.json()) as {
          promptName?: string | null;
          intent?: string | null;
          promptAsked?: string | null;
          answerText?: string | null;
          mentions?: Array<{ brand: string; type: MentionType }>;
          citations?: Array<{ label: string; domain: string | null; authority: number }>;
          scores?: {
            presenceRate: number;
            recommendationRate: number;
            citationRate: number;
            authorityDiversity: number;
          };
        };
        setLiveDetail({
          id: openRunId,
          promptName: json.promptName ?? null,
          intent: json.intent ?? null,
          promptAsked: json.promptAsked ?? null,
          answerText: json.answerText ?? null,
          mentions: json.mentions ?? [],
          citations: json.citations ?? [],
          scores: json.scores ?? { presenceRate: 0, recommendationRate: 0, citationRate: 0, authorityDiversity: 0 }
        });
      } catch {
        setLiveDetail(null);
      }
    })();

    return () => controller.abort();
  }, [demoMode, openRunId]);

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key);
    else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div className="grid gap-4 xl:grid-cols-12">
      <Card className="xl:col-span-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Filters</CardTitle>
            {demoMode ? (
              <Badge className="border-slate-800 bg-slate-900 text-slate-200">Sample Data</Badge>
            ) : null}
          </div>
          <CardDescription className="text-xs">Search and filter prompt results.</CardDescription>
        </CardHeader>
        <div className="mt-4 space-y-6">
          <div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Search</div>
            <div className="mt-2 flex h-10 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus-within:ring-2 focus-within:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus-within:ring-slate-700">
              <span className="text-slate-500">
                <SearchIcon />
              </span>
              <input
                className="h-full w-full bg-transparent outline-none"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search prompts…"
              />
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Intent Type</div>
            <div className="mt-3 space-y-2">
              {(Object.keys(intent) as IntentFilter[]).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={intent[key]}
                    onChange={(e) => setIntent((prev) => ({ ...prev, [key]: e.target.checked }))}
                  />
                  <span className="text-slate-700 dark:text-slate-300">{intentLabel(key)}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">Brand Presence</div>
            <div className="mt-3 space-y-2">
              {(Object.keys(mention) as MentionFilter[]).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={mention[key]}
                    onChange={(e) => setMention((prev) => ({ ...prev, [key]: e.target.checked }))}
                  />
                  <span className="text-slate-700 dark:text-slate-300">{mentionLabel(key)}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="xl:col-span-8">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {brandName ? (
              <>
                Brand:{" "}
                <span className="font-medium text-slate-900 dark:text-slate-100">{brandName}</span>
                {category ? (
                  <>
                    {" "}
                    · Category:{" "}
                    <span className="font-medium text-slate-900 dark:text-slate-100">{category}</span>
                  </>
                ) : null}
              </>
            ) : (
              "Explore AI answers and brand visibility across all prompts."
            )}
          </div>
          <Badge>{filtered.length} results</Badge>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            No prompt rows loaded.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {filtered.map((prompt) => (
              <button
                key={`${prompt.promptName}-${prompt.runId ?? "none"}`}
                type="button"
                onClick={() => (prompt.runId ? setParam("run", prompt.runId) : null)}
                className="w-full text-left"
                disabled={!prompt.runId}
              >
                <Card className="overflow-hidden transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <CardHeader>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                          intentPillClass(normalizeIntent(prompt.intent))
                        )}
                      >
                        {prompt.intent}
                      </span>
                      <span className="inline-flex items-center rounded-md bg-blue-600/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
                        Completed
                      </span>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {prompt.promptName}
                        </div>
                        <div className="mt-2 flex min-w-0 items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <span className="text-slate-400">▸</span>
                          <span className="min-w-0 flex-1 truncate">
                            {prompt.promptAsked ??
                              (demoMode && prompt.runId
                                ? getDemoPromptPreview(prompt.runId)?.promptAskedPreview
                                : null) ??
                              "—"}
                          </span>
                        </div>

                        <div className="mt-3 break-words rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                          {demoMode && prompt.runId
                            ? getDemoPromptPreview(prompt.runId)?.answerPreview ?? "—"
                            : prompt.answerPreview ?? "—"}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            {demoMode && prompt.runId ? (
                              (DEMO_PROMPT_DETAIL_BY_RUN_ID.get(prompt.runId)?.mentions ?? []).map((m) => (
                                <span
                                  key={`${prompt.runId}-${m.brand}-${m.type}`}
                                  className={cn(
                                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                                    mentionPillClass(m.type)
                                  )}
                                >
                                  {m.brand}{" "}
                                  <span className="ml-1 text-[10px] opacity-80">({m.type})</span>
                                </span>
                              ))
                            ) : prompt.mentions && prompt.mentions.length > 0 ? (
                              prompt.mentions.map((m) => (
                                <span
                                  key={`${prompt.runId ?? "none"}-${m.brand}-${m.type}`}
                                  className={cn(
                                    "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                                    mentionPillClass(m.type)
                                  )}
                                >
                                  {m.brand}{" "}
                                  <span className="ml-1 text-[10px] opacity-80">({m.type})</span>
                                </span>
                              ))
                            ) : (
                              <span
                                className={cn(
                                  "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                                  mentionPillClass((prompt.mentionType ?? "none") as MentionType)
                                )}
                              >
                                {brandName ?? DEMO_PRIMARY_BRAND.name}{" "}
                                <span className="ml-1 text-[10px] opacity-80">
                                  ({prompt.mentionType ?? "none"})
                                </span>
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>⟲</span>
                            <span>{prompt.citationCount ?? 0} citations</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 text-slate-400">
                        <ChevronRight />
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>

      {demoMode && selectedDetail ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setParam("run", null)}
            aria-label="Close prompt detail"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto overflow-x-hidden border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                      intentPillClass(normalizeIntent(selectedDetail.intent))
                    )}
                  >
                    {selectedDetail.intent}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-600/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
                    {selectedDetail.status}
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold text-white">{selectedDetail.promptName}</div>
                <div className="mt-1 text-sm text-slate-400">Evidence breakdown for this prompt run</div>
              </div>

              <button
                type="button"
                onClick={() => setParam("run", null)}
                className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">PROMPT ASKED</div>
                <div className="mt-3 break-words rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100">
                  {selectedDetail.promptAsked}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">AI ANSWER</div>
                <div className="mt-3 break-words whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100">
                  {selectedDetail.answer}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">BRAND MENTIONS</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedDetail.mentions.map((m) => (
                    <span
                      key={`${selectedDetail.runId}-${m.brand}-${m.type}`}
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                        mentionPillClass(m.type)
                      )}
                    >
                      {m.brand} <span className="ml-1 text-[10px] opacity-80">({m.type})</span>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-wide text-slate-400">
                    CITATIONS ({selectedDetail.citations.length})
                  </div>
                  <div className="text-xs text-slate-500">Demo data</div>
                </div>
                <div className="mt-3 space-y-2">
                  {selectedDetail.citations.length === 0 ? (
                    <div className="text-sm text-slate-400">No citations in this example.</div>
                  ) : (
                    selectedDetail.citations.map((citation) => (
                      <div
                        key={`${citation.domain}-${citation.label}`}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200">
                            {citation.label}
                          </span>
                          <span className="text-sm text-slate-200">{citation.domain}</span>
                        </div>
                        <div className="text-xs text-slate-400">Authority: {citation.authority}%</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">VISIBILITY SCORES</div>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "Presence Rate", value: selectedDetail.scores.presenceRate },
                    { label: "Recommendation Rate", value: selectedDetail.scores.recommendationRate },
                    { label: "Citation Rate", value: selectedDetail.scores.citationRate },
                    { label: "Authority Diversity", value: selectedDetail.scores.authorityDiversity }
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{row.label}</span>
                        <span className="text-slate-200">{percent(row.value)}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={Math.round(row.value * 100)} className="dark:bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-500">
                Demo views display fictional brands and simulated data for illustrative purposes only.
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!demoMode && openRunId && liveDetail ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setParam("run", null)}
            aria-label="Close prompt detail"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto overflow-x-hidden border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                      intentPillClass(normalizeIntent(liveDetail.intent ?? ""))
                    )}
                  >
                    {liveDetail.intent ?? "—"}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-600/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
                    Completed
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold text-white">{liveDetail.promptName ?? "Prompt"}</div>
                <div className="mt-1 text-sm text-slate-400">Evidence breakdown for this prompt run</div>
              </div>

              <button
                type="button"
                onClick={() => setParam("run", null)}
                className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">PROMPT ASKED</div>
                <div className="mt-3 break-words rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100">
                  {liveDetail.promptAsked ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">AI ANSWER</div>
                <div className="mt-3 break-words whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100">
                  {liveDetail.answerText ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">BRAND MENTIONS</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {liveDetail.mentions.length === 0 ? (
                    <span className="text-sm text-slate-400">No mentions detected.</span>
                  ) : (
                    liveDetail.mentions.map((m) => (
                      <span
                        key={`${openRunId}-${m.brand}-${m.type}`}
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                          mentionPillClass(m.type)
                        )}
                      >
                        {m.brand} <span className="ml-1 text-[10px] opacity-80">({m.type})</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-wide text-slate-400">
                    CITATIONS ({liveDetail.citations.length})
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {liveDetail.citations.length === 0 ? (
                    <div className="text-sm text-slate-400">No citations found for this run.</div>
                  ) : (
                    liveDetail.citations.map((citation) => (
                      <div
                        key={`${citation.domain ?? "unknown"}-${citation.label}`}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200">
                            {citation.label}
                          </span>
                          <span className="text-sm text-slate-200">{citation.domain ?? "—"}</span>
                        </div>
                        <div className="text-xs text-slate-400">Authority: {citation.authority}%</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">VISIBILITY SCORES</div>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "Presence Rate", value: liveDetail.scores.presenceRate },
                    { label: "Recommendation Rate", value: liveDetail.scores.recommendationRate },
                    { label: "Citation Rate", value: liveDetail.scores.citationRate },
                    { label: "Authority Diversity", value: liveDetail.scores.authorityDiversity }
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{row.label}</span>
                        <span className="text-slate-200">{percent(row.value)}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={Math.round(row.value * 100)} className="dark:bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {!demoMode && openRunId && liveDetail ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            onClick={() => setParam("run", null)}
            aria-label="Close prompt detail"
          />

          <div className="absolute right-0 top-0 h-full w-full max-w-xl overflow-y-auto overflow-x-hidden border-l border-slate-800 bg-slate-950 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold",
                      intentPillClass(normalizeIntent(liveDetail.intent ?? ""))
                    )}
                  >
                    {liveDetail.intent ?? "—"}
                  </span>
                  <span className="inline-flex items-center rounded-md bg-blue-600/15 px-2 py-0.5 text-xs font-semibold text-blue-300">
                    Completed
                  </span>
                </div>
                <div className="mt-3 text-xl font-semibold text-white">{liveDetail.promptName ?? "Prompt"}</div>
                <div className="mt-1 text-sm text-slate-400">Evidence breakdown for this prompt run</div>
              </div>

              <button
                type="button"
                onClick={() => setParam("run", null)}
                className="rounded-md border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-slate-200 hover:bg-slate-900"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">PROMPT ASKED</div>
                <div className="mt-3 break-words rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100">
                  {liveDetail.promptAsked ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">AI ANSWER</div>
                <div className="mt-3 break-words whitespace-pre-wrap rounded-xl border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-100">
                  {liveDetail.answerText ?? "—"}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">BRAND MENTIONS</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {liveDetail.mentions.length === 0 ? (
                    <span className="text-sm text-slate-400">No mentions detected.</span>
                  ) : (
                    liveDetail.mentions.map((m) => (
                      <span
                        key={`${liveDetail.id}-${m.brand}-${m.type}`}
                        className={cn(
                          "inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                          mentionPillClass(m.type)
                        )}
                      >
                        {m.brand} <span className="ml-1 text-[10px] opacity-80">({m.type})</span>
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold tracking-wide text-slate-400">
                    CITATIONS ({liveDetail.citations.length})
                  </div>
                </div>
                <div className="mt-3 space-y-2">
                  {liveDetail.citations.length === 0 ? (
                    <div className="text-sm text-slate-400">No citations found for this run.</div>
                  ) : (
                    liveDetail.citations.map((citation) => (
                      <div
                        key={`${citation.domain ?? "unknown"}-${citation.label}`}
                        className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="rounded-md bg-slate-800 px-2 py-1 text-[11px] font-semibold text-slate-200">
                            {citation.label}
                          </span>
                          <span className="text-sm text-slate-200">{citation.domain ?? "—"}</span>
                        </div>
                        <div className="text-xs text-slate-400">Authority: {citation.authority}%</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold tracking-wide text-slate-400">VISIBILITY SCORES</div>
                <div className="mt-4 space-y-4">
                  {[
                    { label: "Presence Rate", value: liveDetail.scores.presenceRate },
                    { label: "Recommendation Rate", value: liveDetail.scores.recommendationRate },
                    { label: "Citation Rate", value: liveDetail.scores.citationRate },
                    { label: "Authority Diversity", value: liveDetail.scores.authorityDiversity }
                  ].map((row) => (
                    <div key={row.label}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-300">{row.label}</span>
                        <span className="text-slate-200">{percent(row.value)}</span>
                      </div>
                      <div className="mt-2">
                        <Progress value={Math.round(row.value * 100)} className="dark:bg-slate-800" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
