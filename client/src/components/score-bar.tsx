import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface ScoreBarProps {
  label: string;
  value: number;
  maxValue?: number;
  tooltip?: string;
  className?: string;
}

const getScoreColor = (value: number): string => {
  if (value >= 70) return "bg-success";
  if (value >= 50) return "bg-warning";
  return "bg-destructive";
};

const getScoreTextColor = (value: number): string => {
  if (value >= 70) return "text-success";
  if (value >= 50) return "text-warning";
  return "text-destructive";
};

export function ScoreBar({
  label,
  value,
  maxValue = 100,
  tooltip,
  className,
}: ScoreBarProps) {
  const percentage = Math.min(100, (value / maxValue) * 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-medium">{label}</span>
          {tooltip && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                <p className="text-xs">{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className={cn("text-sm font-semibold tabular-nums", getScoreTextColor(value))}>
          {value.toFixed(0)}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all duration-500 ease-out", getScoreColor(value))}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface ScoreBreakdownProps {
  scores: Array<{
    label: string;
    value: number;
    tooltip?: string;
  }>;
  className?: string;
}

export function ScoreBreakdown({ scores, className }: ScoreBreakdownProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {scores.map((score) => (
        <ScoreBar
          key={score.label}
          label={score.label}
          value={score.value}
          tooltip={score.tooltip}
        />
      ))}
    </div>
  );
}
