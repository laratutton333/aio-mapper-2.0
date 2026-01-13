import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight, MessageSquare, Link2 } from "lucide-react";
import { MentionBadge } from "@/components/mention-badge";
import type { PromptRun, PromptTemplate, PromptMention, Citation } from "@shared/schema";

interface PromptResultCardProps {
  run: PromptRun;
  template: PromptTemplate;
  mentions: PromptMention[];
  citations: Citation[];
  onExpand: () => void;
  className?: string;
}

const intentColors: Record<string, string> = {
  informational: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  comparative: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  transactional: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  trust: "bg-chart-3/10 text-chart-3 border-chart-3/20",
};

const statusColors: Record<string, string> = {
  pending: "bg-muted text-muted-foreground",
  running: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  completed: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

export function PromptResultCard({
  run,
  template,
  mentions,
  citations,
  onExpand,
  className,
}: PromptResultCardProps) {
  const targetBrandMention = mentions.find((m) => m.isTargetBrand);
  const otherMentions = mentions.filter((m) => !m.isTargetBrand).slice(0, 3);
  const truncatedAnswer = run.rawAnswer 
    ? run.rawAnswer.slice(0, 200) + (run.rawAnswer.length > 200 ? "..." : "")
    : null;

  return (
    <Card className={cn("relative overflow-visible hover-elevate active-elevate-2 cursor-pointer", className)}>
      <div onClick={onExpand} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant="outline" className={cn("capitalize", intentColors[template.intent])}>
                  {template.intent}
                </Badge>
                <Badge variant="outline" className={cn("capitalize", statusColors[run.runStatus])}>
                  {run.runStatus}
                </Badge>
              </div>
              <CardTitle className="text-base font-semibold line-clamp-1">
                {template.name}
              </CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="shrink-0" data-testid={`button-expand-${run.id}`}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2">
            <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm font-mono text-muted-foreground line-clamp-2">
              {run.promptText || template.template}
            </p>
          </div>

          {truncatedAnswer && (
            <div className="rounded-md bg-muted/50 p-3">
              <p className="text-sm text-foreground line-clamp-3">{truncatedAnswer}</p>
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-1.5">
              {targetBrandMention && (
                <MentionBadge
                  type={targetBrandMention.matchType as any}
                  brandName={targetBrandMention.brandName}
                  isTargetBrand
                />
              )}
              {otherMentions.map((m) => (
                <MentionBadge
                  key={m.id}
                  type={m.matchType as any}
                  brandName={m.brandName}
                />
              ))}
              {mentions.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{mentions.length - 4} more
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground shrink-0">
              <Link2 className="h-3.5 w-3.5" />
              <span className="text-xs">{citations.length} citations</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
