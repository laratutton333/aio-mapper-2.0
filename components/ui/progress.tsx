import { cn } from "@/lib/utils";

export function Progress({
  value,
  className
}: {
  value: number;
  className?: string;
}) {
  const safe = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : 0;
  return (
    <div
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800",
        className
      )}
      aria-label="progress"
      aria-valuenow={safe}
      aria-valuemin={0}
      aria-valuemax={100}
      role="progressbar"
    >
      <div
        className="h-full rounded-full bg-blue-600 dark:bg-blue-500"
        style={{ width: `${safe}%` }}
      />
    </div>
  );
}
