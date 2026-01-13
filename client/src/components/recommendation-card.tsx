import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Link2,
  Shield,
} from "lucide-react";
import type { Recommendation } from "@shared/schema";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onViewEvidence?: () => void;
  onStatusChange?: (status: string) => void;
  className?: string;
}

const impactColors: Record<string, string> = {
  high: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  low: "bg-muted text-muted-foreground",
};

const effortColors: Record<string, string> = {
  high: "bg-destructive/10 text-destructive border-destructive/20",
  medium: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  low: "bg-chart-2/10 text-chart-2 border-chart-2/20",
};

const categoryIcons: Record<string, React.ReactNode> = {
  content: <FileText className="h-4 w-4" />,
  authority: <Shield className="h-4 w-4" />,
  structure: <Link2 className="h-4 w-4" />,
};

const statusIcons: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  in_progress: <ArrowUpRight className="h-3.5 w-3.5" />,
  completed: <CheckCircle2 className="h-3.5 w-3.5" />,
  dismissed: <XCircle className="h-3.5 w-3.5" />,
};

export function RecommendationCard({
  recommendation,
  onViewEvidence,
  onStatusChange,
  className,
}: RecommendationCardProps) {
  const { title, summary, category, impact, effort, status, rationale } = recommendation;

  return (
    <Card className={cn("relative overflow-visible hover-elevate", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
              {categoryIcons[category] || <FileText className="h-4 w-4" />}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{title}</CardTitle>
              <span className="text-xs text-muted-foreground capitalize">{category}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className={cn("text-xs", impactColors[impact])}>
              {impact} impact
            </Badge>
            <Badge variant="outline" className={cn("text-xs", effortColors[effort])}>
              {effort} effort
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{summary}</p>
        
        {rationale && (
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Why:</span> {rationale}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-1.5">
            {statusIcons[status]}
            <span className="text-xs font-medium capitalize text-muted-foreground">
              {status.replace("_", " ")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {onViewEvidence && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onViewEvidence}
                data-testid={`button-view-evidence-${recommendation.id}`}
              >
                View Evidence
              </Button>
            )}
            {onStatusChange && status === "pending" && (
              <Button
                size="sm"
                onClick={() => onStatusChange("in_progress")}
                data-testid={`button-start-${recommendation.id}`}
              >
                Start
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
