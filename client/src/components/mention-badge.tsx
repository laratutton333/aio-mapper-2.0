import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { MatchType } from "@shared/schema";

interface MentionBadgeProps {
  type: MatchType;
  brandName: string;
  isTargetBrand?: boolean;
  className?: string;
}

const typeStyles: Record<MatchType, { label: string; className: string }> = {
  primary: {
    label: "Primary",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  secondary: {
    label: "Secondary",
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  implied: {
    label: "Implied",
    className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  },
  none: {
    label: "Not Found",
    className: "bg-muted text-muted-foreground",
  },
};

export function MentionBadge({
  type,
  brandName,
  isTargetBrand,
  className,
}: MentionBadgeProps) {
  const style = typeStyles[type];

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 font-medium",
        style.className,
        isTargetBrand && "ring-1 ring-primary/30",
        className
      )}
    >
      <span className="max-w-24 truncate">{brandName}</span>
      <span className="text-[10px] opacity-70">({style.label})</span>
    </Badge>
  );
}

interface CitationBadgeProps {
  sourceType: string;
  domain?: string;
  className?: string;
}

const sourceTypeStyles: Record<string, { className: string }> = {
  wikipedia: { className: "bg-chart-3/10 text-chart-3 border-chart-3/20" },
  government: { className: "bg-chart-2/10 text-chart-2 border-chart-2/20" },
  publisher: { className: "bg-chart-1/10 text-chart-1 border-chart-1/20" },
  brand_owned: { className: "bg-primary/10 text-primary border-primary/20" },
  competitor: { className: "bg-chart-5/10 text-chart-5 border-chart-5/20" },
  other: { className: "bg-muted text-muted-foreground" },
};

export function CitationBadge({ sourceType, domain, className }: CitationBadgeProps) {
  const style = sourceTypeStyles[sourceType] || sourceTypeStyles.other;
  const label = sourceType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 font-medium", style.className, className)}
    >
      <span className="capitalize">{label}</span>
      {domain && (
        <span className="text-[10px] opacity-70 max-w-32 truncate">({domain})</span>
      )}
    </Badge>
  );
}
