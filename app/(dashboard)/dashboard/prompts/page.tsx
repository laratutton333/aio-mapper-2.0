import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPromptsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Prompts</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          UI-only: prompt library management will be wired later.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Prompt Templates</CardTitle>
          <CardDescription>TODO: list prompt templates.</CardDescription>
        </CardHeader>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
          No prompts loaded.
        </div>
      </Card>
    </div>
  );
}

