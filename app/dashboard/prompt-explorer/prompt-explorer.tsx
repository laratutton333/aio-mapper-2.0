"use client";

import Link from "next/link";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardResponse, PromptResult } from "@/types/dashboard";

type IntentFilter = "informational" | "comparative" | "transactional" | "trust";
type MentionFilter = "any" | "primary" | "secondary" | "implied" | "none";

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

export function PromptExplorer({
  audit,
  prompts
}: {
  audit: DashboardResponse["audit"];
  prompts: PromptResult[];
}) {
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

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return prompts.filter((p) => {
      const intentValue = normalizeIntent(p.intent);
      if (intentValue && !intent[intentValue]) return false;

      const mentionValue = p.result.mentionType ?? "none";
      const mentionMatches =
        mention.any || mention[mentionValue as MentionFilter] || false;
      if (!mentionMatches) return false;

      if (!q) return true;
      const haystack = [
        p.promptName,
        p.promptAsked ?? "",
        p.answerPreview ?? "",
        p.intent,
        p.result.mentionType
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(q);
    });
  }, [intent, mention, prompts, query]);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription className="text-xs">
            Narrow down prompts by intent and presence.
          </CardDescription>
        </CardHeader>
        <div className="mt-4 space-y-6">
          <div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Search prompts…
            </div>
            <input
              className="mt-2 h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-slate-700"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
            />
          </div>

          <div>
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Intent Type
            </div>
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
            <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
              Brand Presence
            </div>
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

      <div className="lg:col-span-8">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            {audit.brandName ? (
              <>
                Brand: <span className="font-medium text-slate-900 dark:text-slate-100">{audit.brandName}</span>
                {audit.category ? (
                  <>
                    {" "}
                    · Category: <span className="font-medium text-slate-900 dark:text-slate-100">{audit.category}</span>
                  </>
                ) : null}
              </>
            ) : (
              "Run an audit to populate results."
            )}
          </div>
          <Badge>{filtered.length} results</Badge>
        </div>

        <div className="mt-4 space-y-4">
          {filtered.map((prompt) => (
            <Card key={prompt.promptId}>
              <CardHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>{prompt.intent}</Badge>
                  <Badge className="bg-slate-900 text-white dark:bg-slate-800">Completed</Badge>
                </div>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold">{prompt.promptName}</div>
                    {prompt.promptAsked ? (
                      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        {prompt.promptAsked}
                      </div>
                    ) : null}
                    {prompt.answerPreview ? (
                      <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                        {prompt.answerPreview}
                      </div>
                    ) : null}
                    <div className="mt-3 flex flex-wrap gap-2">
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
                        {audit.brandName ?? "Brand"} ({prompt.result.mentionType})
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
                    ) : null}
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

