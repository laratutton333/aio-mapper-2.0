import { cn } from "@/components/ui/cn";

export function Sparkline({ values, className }: { values: number[]; className?: string }) {
  const points = values.filter((v) => Number.isFinite(v));
  if (points.length < 2) {
    return (
      <div
        className={cn("h-40 w-full rounded-xl border border-slate-800 bg-slate-950", className)}
      />
    );
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const width = 640;
  const height = 220;
  const padding = 18;
  const step = (width - padding * 2) / (points.length - 1);

  const svgPoints = points
    .map((value, index) => {
      const x = padding + index * step;
      const y = padding + (height - padding * 2) * (1 - (value - min) / range);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-4",
        className
      )}
    >
      <svg viewBox={`0 0 ${width} ${height}`} className="h-40 w-full">
        <polyline fill="none" stroke="rgba(59,130,246,0.9)" strokeWidth="3" points={svgPoints} />
        {points.map((value, index) => {
          const x = padding + index * step;
          const y = padding + (height - padding * 2) * (1 - (value - min) / range);
          return (
            <circle key={`${index}-${value}`} cx={x} cy={y} r="4" fill="rgba(59,130,246,0.9)" />
          );
        })}
      </svg>
    </div>
  );
}

