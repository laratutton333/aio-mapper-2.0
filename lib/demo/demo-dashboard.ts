import type { DashboardResponse, PromptResult } from "@/types/dashboard";
import { DEMO_COMPETITORS, DEMO_PRIMARY_BRAND } from "@/lib/demo/demo-brands";
import { DEMO_PROMPTS } from "@/lib/demo/demo-prompts";

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function toPromptResult(args: {
  promptId: string;
  promptName: string;
  intent: string;
  citationCount: number;
  mentionType: PromptResult["result"]["mentionType"];
  citationPresent: boolean;
}): PromptResult {
  return {
    runId: `demo-run-${args.promptId}`,
    promptId: args.promptId,
    promptName: args.promptName,
    intent: args.intent,
    promptAsked: null,
    answerPreview: null,
    citationCount: args.citationCount,
    executedAt: null,
    result: {
      brandDetected: args.mentionType !== "none",
      mentionType: args.mentionType,
      citationPresent: args.citationPresent,
      confidence: null
    }
  };
}

export type DemoDashboardMeta = {
  deltas: {
    visibilityScore: number;
    presenceRate: number;
    citationRate: number;
    recommendationRate: number;
  };
  competitors: typeof DEMO_COMPETITORS;
  auditName: string;
  totalPrompts: number;
  completedPrompts: number;
};

export type DemoDashboardResponse = DashboardResponse & { demo: DemoDashboardMeta };

export function getDemoDashboardData(): DemoDashboardResponse {
  const presenceRate = 0.88;
  const citationRate = 0.66;
  const recommendationRate = 0.77;
  const authorityDiversity = 0.42;
  const visibilityScore = clamp01((presenceRate + citationRate + recommendationRate) / 3);

  const prompts: PromptResult[] = DEMO_PROMPTS.map((row, index) =>
    toPromptResult({
      promptId: `p${index + 1}`,
      promptName: row.promptName,
      intent: row.intent,
      citationCount: row.citationCount,
      mentionType: row.mentionType,
      citationPresent: row.citationPresent
    })
  );

  const trend: DashboardResponse["trend"] = [
    0.76, 0.75, 0.76, 0.74, 0.73, 0.75, 0.74
  ].map((score, index) => ({
    auditId: `demo-audit-${index + 1}`,
    executedAt: `2026-01-${8 + index}`,
    visibilityScore: clamp01(score)
  }));

  return {
    demo: {
      deltas: {
        visibilityScore: 0.032,
        presenceRate: 0.018,
        citationRate: -0.005,
        recommendationRate: 0.021
      },
      competitors: DEMO_COMPETITORS,
      auditName: "Q1 2026 Visibility Audit",
      totalPrompts: prompts.length,
      completedPrompts: prompts.length
    },
    audit: {
      auditId: "demo-audit-q1-2026",
      brandName: DEMO_PRIMARY_BRAND.name,
      category: DEMO_PRIMARY_BRAND.industry,
      executedAt: null
    },
    summary: {
      presenceRate,
      citationRate,
      recommendationRate,
      visibilityScore,
      authorityDiversity
    },
    trend,
    prompts,
    recommendations: []
  };
}

