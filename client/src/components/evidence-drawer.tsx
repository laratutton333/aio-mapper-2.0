import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MentionBadge, CitationBadge } from "@/components/mention-badge";
import { ScoreBreakdown } from "@/components/score-bar";
import { MessageSquare, Link2, BarChart3, FileText } from "lucide-react";
import type { PromptRunDetail } from "@shared/schema";

interface EvidenceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: PromptRunDetail | null;
}

export function EvidenceDrawer({ open, onOpenChange, data }: EvidenceDrawerProps) {
  if (!data) return null;

  const { run, template, mentions, citations, metrics } = data;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl">
        <SheetHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {template.intent}
            </Badge>
            <Badge
              variant={run.runStatus === "completed" ? "default" : "secondary"}
              className="capitalize"
            >
              {run.runStatus}
            </Badge>
          </div>
          <SheetTitle className="text-lg">{template.name}</SheetTitle>
          <SheetDescription>
            Evidence breakdown for this prompt run
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)] pr-4 mt-6">
          <div className="space-y-6">
            <section>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Prompt Asked
                </h3>
              </div>
              <div className="rounded-md bg-muted/50 p-4 font-mono text-sm">
                {run.promptText || template.template}
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Answer
                </h3>
              </div>
              <div className="rounded-md border border-border bg-card p-4 text-sm leading-relaxed">
                {run.rawAnswer || "No answer recorded"}
              </div>
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Brand Mentions
                </h3>
              </div>
              {mentions.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {mentions.map((mention) => (
                    <MentionBadge
                      key={mention.id}
                      type={mention.matchType as any}
                      brandName={mention.brandName}
                      isTargetBrand={mention.isTargetBrand}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No brand mentions detected</p>
              )}
            </section>

            <Separator />

            <section>
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Citations ({citations.length})
                </h3>
              </div>
              {citations.length > 0 ? (
                <div className="space-y-2">
                  {citations.map((citation) => (
                    <div
                      key={citation.id}
                      className="flex items-center justify-between gap-2 rounded-md border border-border bg-card p-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CitationBadge sourceType={citation.sourceType} />
                        <a
                          href={citation.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline truncate"
                        >
                          {citation.sourceDomain || citation.sourceUrl}
                        </a>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        Authority: {(citation.authorityScore * 100).toFixed(0)}%
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No citations found</p>
              )}
            </section>

            {metrics && (
              <>
                <Separator />
                <section>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
                    Visibility Scores
                  </h3>
                  <ScoreBreakdown
                    scores={[
                      {
                        label: "Presence Rate",
                        value: metrics.presenceRate * 100,
                        tooltip: "How often your brand appears in AI answers",
                      },
                      {
                        label: "Recommendation Rate",
                        value: metrics.recommendationRate * 100,
                        tooltip: "How often AI recommends your brand as a primary choice",
                      },
                      {
                        label: "Citation Rate",
                        value: metrics.citationRate * 100,
                        tooltip: "How often your content is cited as a source",
                      },
                      {
                        label: "Authority Diversity",
                        value: metrics.authorityDiversity * 100,
                        tooltip: "Diversity of authoritative sources mentioning your brand",
                      },
                    ]}
                  />
                </section>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
