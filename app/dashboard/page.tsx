import { RunVisibilityForm } from "@/app/dashboard/run-visibility-form";
import type { DashboardResponse } from "@/types/dashboard";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data: DashboardResponse = await getDashboardData();
  return (
    <>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-600">
          Summary metrics and prompt-by-prompt results (no UI parsing of model
          text).
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-600">Presence Rate</div>
          <div className="mt-1 text-2xl font-semibold">
            {(data.summary.presenceRate * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-600">Citation Rate</div>
          <div className="mt-1 text-2xl font-semibold">
            {(data.summary.citationRate * 100).toFixed(0)}%
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-600">Prompts</div>
          <div className="mt-1 text-2xl font-semibold">{data.prompts.length}</div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
        <div className="text-sm font-semibold">Run Visibility Check</div>
        <div className="mt-1 text-sm text-slate-600">
          Executes active prompt templates sequentially and logs every response.
        </div>
        <div className="mt-4">
          <RunVisibilityForm />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold">Prompt Results</div>
          <div className="mt-4 space-y-3">
            {data.prompts.map((prompt) => (
              <div
                key={prompt.promptId}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="text-sm font-medium">{prompt.promptName}</div>
                  <div className="text-xs text-slate-600">{prompt.intent}</div>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-slate-700">
                  <div>
                    Detected:{" "}
                    <span className="font-medium">
                      {prompt.result.brandDetected ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    Citation:{" "}
                    <span className="font-medium">
                      {prompt.result.citationPresent ? "Yes" : "No"}
                    </span>
                  </div>
                  <div>
                    Confidence:{" "}
                    <span className="font-medium">
                      {prompt.result.confidence === null
                        ? "n/a"
                        : prompt.result.confidence.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="text-sm font-semibold">Recommendations</div>
          <div className="mt-4 space-y-3">
            {data.recommendations.map((rec) => (
              <div
                key={rec.title}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="text-sm font-medium">{rec.title}</div>
                <div className="mt-1 text-sm text-slate-600">{rec.rationale}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
