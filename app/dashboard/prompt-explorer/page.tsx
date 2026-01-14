import type { DashboardResponse } from "@/types/dashboard";

import { PromptExplorer } from "@/app/dashboard/prompt-explorer/prompt-explorer";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const dynamic = "force-dynamic";

export default async function PromptExplorerPage() {
  const data: DashboardResponse = await getDashboardData();

  return (
    <>
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Prompt Explorer</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Explore AI answers and brand visibility across all prompts.
        </p>
      </div>

      <div className="mt-6">
        <PromptExplorer audit={data.audit} prompts={data.prompts} />
      </div>
    </>
  );
}

