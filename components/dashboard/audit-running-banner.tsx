"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/components/ui/cn";
import { Progress } from "@/components/ui/progress";
import type { AuditStatus } from "@/lib/audits/getAuditStatus";

export function AuditRunningBanner({
  auditId,
  status,
  runCount,
  totalPrompts
}: {
  auditId: string;
  status: AuditStatus;
  runCount: number;
  totalPrompts: number;
}) {
  const router = useRouter();

  React.useEffect(() => {
    if (status !== "running") return;

    const interval = window.setInterval(() => {
      router.refresh();
    }, 2500);

    return () => window.clearInterval(interval);
  }, [router, status]);

  const progressTotal = Math.max(totalPrompts, 1);
  const progressValue = Math.min(runCount, progressTotal);
  const percent = Math.round((progressValue / progressTotal) * 100);

  if (status === "completed") return null;

  return (
    <div
      className={cn(
        "rounded-xl border px-4 py-3 text-sm",
        status === "running"
          ? "border-blue-200 bg-blue-50 text-slate-900 dark:border-blue-600/40 dark:bg-blue-600/10 dark:text-slate-100"
          : "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100"
      )}
      aria-live="polite"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-semibold">
            {status === "running" ? "Audit running" : "Audit failed"}
          </div>
          <div className="mt-0.5 text-xs text-slate-600 dark:text-slate-300">
            {status === "running"
              ? `Collecting results for audit ${auditId}. This page will refresh automatically.`
              : `Audit ${auditId} failed. You can try running it again.`}
          </div>
        </div>
        {status === "running" ? (
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {progressValue}/{progressTotal} prompts
          </div>
        ) : null}
      </div>

      {status === "running" ? (
        <div className="mt-3 space-y-2">
          <Progress value={percent} />
          <div className="text-xs text-slate-600 dark:text-slate-300">{percent}% complete</div>
        </div>
      ) : null}
    </div>
  );
}
