import type { BrandPresenceResult } from "@/types/ai";

export type PromptResult = {
  runId: string | null;
  promptId: string;
  promptName: string;
  intent: string;
  promptAsked: string | null;
  answerPreview: string | null;
  citationCount: number;
  executedAt: string | null;
  result: BrandPresenceResult;
};

export type Recommendation = {
  title: string;
  rationale: string;
};

export type DashboardResponse = {
  audit: {
    auditId: string | null;
    brandName: string | null;
    category: string | null;
    executedAt: string | null;
  };
  summary: {
    presenceRate: number;
    citationRate: number;
    recommendationRate: number;
    visibilityScore: number;
    authorityDiversity: number;
  };
  trend: {
    auditId: string;
    executedAt: string;
    visibilityScore: number;
  }[];
  prompts: PromptResult[];
  recommendations: Recommendation[];
};
