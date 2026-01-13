import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CitationDonutChart } from "@/components/citation-chart";
import { CitationBadge } from "@/components/mention-badge";
import { AlertCircle, ExternalLink, Shield, Globe } from "lucide-react";
import type { Citation } from "@shared/schema";

interface CitationStats {
  type: string;
  count: number;
  percentage: number;
}

interface CitationsPageData {
  citations: Citation[];
  distribution: CitationStats[];
  totalCitations: number;
  brandOwnedPercentage: number;
  authorityAverage: number;
  missingCitationPrompts: number;
}

export default function CitationsPage() {
  const { data, isLoading } = useQuery<CitationsPageData>({
    queryKey: ["/api/citations"],
  });

  if (isLoading) {
    return <CitationsPageSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Unable to load citation data</p>
      </div>
    );
  }

  const {
    citations,
    distribution,
    totalCitations,
    brandOwnedPercentage,
    authorityAverage,
    missingCitationPrompts,
  } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Citation Source Breakdown</h1>
        <p className="text-muted-foreground mt-1">
          Understand which sources AI models rely on when answering questions
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Citations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalCitations}</div>
            <p className="text-xs text-muted-foreground mt-1">across all prompts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5" />
              Brand-Owned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{brandOwnedPercentage.toFixed(0)}%</div>
            <Progress value={brandOwnedPercentage} className="mt-2 h-1.5" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5" />
              Authority Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{(authorityAverage * 100).toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">average across sources</p>
          </CardContent>
        </Card>

        <Card className={missingCitationPrompts > 0 ? "border-chart-4/50" : ""}>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Missing Citations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{missingCitationPrompts}</div>
            <p className="text-xs text-muted-foreground mt-1">prompts without sources</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <CitationDonutChart data={distribution} title="Citation Distribution by Type" />

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Source Type Analysis</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {distribution.map((stat) => (
              <div
                key={stat.type}
                className="flex items-center justify-between rounded-md border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <CitationBadge sourceType={stat.type} />
                  <div>
                    <p className="text-sm font-medium capitalize">
                      {stat.type.replace("_", " ")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.count} citation{stat.count !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold tabular-nums">
                    {stat.percentage.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">All Citations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source URL</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Domain</TableHead>
                <TableHead className="text-right">Authority Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {citations.map((citation) => (
                <TableRow key={citation.id} className="hover-elevate">
                  <TableCell className="max-w-md">
                    <a
                      href={citation.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-primary hover:underline truncate"
                      data-testid={`link-citation-${citation.id}`}
                    >
                      {citation.sourceUrl}
                      <ExternalLink className="h-3 w-3 shrink-0" />
                    </a>
                  </TableCell>
                  <TableCell>
                    <CitationBadge sourceType={citation.sourceType} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {citation.sourceDomain || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={(citation.authorityScore ?? 0) > 0.7 ? "default" : "secondary"}
                    >
                      {((citation.authorityScore ?? 0) * 100).toFixed(0)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {missingCitationPrompts > 0 && (
        <Card className="border-chart-4/50 bg-chart-4/5">
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-chart-4" />
              Missing Citation Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {missingCitationPrompts} prompt{missingCitationPrompts !== 1 ? "s" : ""} generated
              answers without citing any sources. This may indicate opportunities to improve
              content discoverability or authority signals.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CitationsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-28 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>

      <Skeleton className="h-96" />
    </div>
  );
}
