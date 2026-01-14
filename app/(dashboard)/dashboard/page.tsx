import Link from "next/link";

import { RunVisibilityForm } from "@/components/dashboard/run-visibility-form";
import { Sparkline } from "@/components/ui/sparkline";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI Visibility Overview</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            UI-only: data wiring will be added later.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-900"
            href="/dashboard"
          >
            Refresh
          </Link>
          <Link
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-500"
            href="#run-audit"
          >
            Run Audit
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-slate-200 dark:border-slate-900">
          <CardHeader>
            <CardTitle>Visibility Score</CardTitle>
            <Badge className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
              Preview
            </Badge>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">—</div>
          <CardDescription className="mt-2">
            Average of presence, citations, and recommendations.
          </CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Presence Rate</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">—</div>
          <CardDescription className="mt-2">Prompts with any brand mention.</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Citation Rate</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">—</div>
          <CardDescription className="mt-2">Prompts with at least one source URL.</CardDescription>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendation Rate</CardTitle>
          </CardHeader>
          <div className="mt-4 text-3xl font-semibold">—</div>
          <CardDescription className="mt-2">Prompts where brand is primary.</CardDescription>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visibility Score Trend</CardTitle>
            <CardDescription className="text-xs">UI-only placeholder.</CardDescription>
          </CardHeader>
          <div className="mt-4">
            <Sparkline values={[]} />
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
          </CardHeader>
          <div className="mt-4 space-y-4">
            {[
              { label: "Presence", value: 0 },
              { label: "Citations", value: 0 },
              { label: "Recommendations", value: 0 },
              { label: "Authority Diversity", value: 0 }
            ].map((row) => (
              <div key={row.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-700 dark:text-slate-300">{row.label}</span>
                  <span className="text-slate-600 dark:text-slate-400">—</span>
                </div>
                <div className="mt-2">
                  <Progress value={row.value} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Prompt Results</CardTitle>
            <CardDescription className="text-xs">
              TODO: render latest prompt runs.
            </CardDescription>
          </CardHeader>
          <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
            No runs yet.
          </div>
        </Card>

        <Card id="run-audit">
          <CardHeader>
            <CardTitle>Run Audit</CardTitle>
            <CardDescription>UI-only: hook this up to your existing backend.</CardDescription>
          </CardHeader>
          <div className="mt-4">
            <RunVisibilityForm />
          </div>
        </Card>
      </div>
    </div>
  );
}

