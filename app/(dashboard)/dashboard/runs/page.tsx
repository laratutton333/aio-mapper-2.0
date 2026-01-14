import { PromptExplorer } from "@/components/dashboard/prompt-explorer";

export default function DashboardRunsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Prompt Explorer</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          UI-only: provide rows from your backend to populate this view.
        </p>
      </div>

      <PromptExplorer brandName={null} category={null} prompts={[]} />
    </div>
  );
}

