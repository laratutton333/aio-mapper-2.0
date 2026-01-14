import type { PromptResult } from "@/types/dashboard";

import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export async function getPromptRuns(args?: { auditId?: string | null }): Promise<PromptResult[]> {
  const dashboard = await getDashboardData({ auditId: args?.auditId ?? null });
  return dashboard.prompts;
}

