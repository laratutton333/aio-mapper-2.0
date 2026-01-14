import type { BrandPresenceResult } from "@/types/ai";

export type PromptResult = {
  promptId: string;
  promptName: string;
  intent: string;
  result: BrandPresenceResult;
};

export type Recommendation = {
  title: string;
  rationale: string;
};

export type DashboardResponse = {
  summary: {
    presenceRate: number;
    citationRate: number;
  };
  prompts: PromptResult[];
  recommendations: Recommendation[];
};
