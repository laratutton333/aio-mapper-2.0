import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// TODO(nextjs): Revert params typing to `{ params: { runId: string } }`
// once Next.js PageProps no longer requires Promise-wrapped params.
// This is a temporary workaround for a Next.js 15.x typing regression.
export default async function DashboardRunDetailPage({
  params
}: {
  params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Run detail</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            UI-only placeholder for run <span className="font-mono">{runId}</span>.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge>TODO</Badge>
            <Badge>model: —</Badge>
            <Badge>executed: —</Badge>
          </div>
        </div>
        <Link
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
          href="/dashboard/runs"
        >
          Back
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>Prompt Asked</CardTitle>
            <CardDescription className="text-xs">TODO: load prompt text.</CardDescription>
          </CardHeader>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            —
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Visibility Scores</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-4">
            {[
              { label: "Presence", value: 0, display: "—" },
              { label: "Recommendation", value: 0, display: "—" },
              { label: "Citations", value: 0, display: "—" }
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{row.label}</span>
                  <span className="text-slate-600 dark:text-slate-400">{row.display}</span>
                </div>
                <div className="mt-2">
                  <Progress value={row.value} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-7">
          <CardHeader>
            <CardTitle>AI Answer</CardTitle>
            <CardDescription className="text-xs">TODO: load raw answer text.</CardDescription>
          </CardHeader>
          <div className="mt-4 whitespace-pre-wrap rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            —
          </div>
        </Card>

        <Card className="lg:col-span-5">
          <CardHeader>
            <CardTitle>Citations</CardTitle>
            <CardDescription className="text-xs">TODO: load citations list.</CardDescription>
          </CardHeader>
          <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">No citations loaded.</div>
        </Card>
      </div>
    </div>
  );
}
