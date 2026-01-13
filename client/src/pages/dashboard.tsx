import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { TrendChart } from "@/components/comparison-chart";
import { ScoreBreakdown } from "@/components/score-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MentionBadge } from "@/components/mention-badge";
import {
  Eye,
  Quote,
  Award,
  TrendingUp,
  ChevronRight,
  Play,
  RefreshCw,
} from "lucide-react";
import { Link } from "wouter";
import type { AuditSummary, PromptRun, PromptTemplate, PromptMention } from "@shared/schema";

interface DashboardData {
  summary: AuditSummary;
  recentRuns: Array<{
    run: PromptRun;
    template: PromptTemplate;
    mentions: PromptMention[];
  }>;
}

export default function Dashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ["/api/dashboard"],
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">Unable to load dashboard data</p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  const { summary, recentRuns } = data;
  const { metrics, recentTrend } = summary;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI Visibility Overview</h1>
          <p className="text-muted-foreground mt-1">
            Track how {summary.brand.name} appears across AI-generated answers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" data-testid="button-refresh-audit">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button data-testid="button-run-audit">
            <Play className="h-4 w-4 mr-2" />
            Run Audit
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Visibility Score"
          value={`${(metrics.visibilityScore * 100).toFixed(0)}%`}
          trend={{ value: 3.2, label: "vs last week" }}
          icon={<Eye className="h-4 w-4" />}
        />
        <MetricCard
          title="Presence Rate"
          value={`${(metrics.presenceRate * 100).toFixed(0)}%`}
          trend={{ value: 1.8, label: "vs last week" }}
          icon={<TrendingUp className="h-4 w-4" />}
        />
        <MetricCard
          title="Citation Rate"
          value={`${(metrics.citationRate * 100).toFixed(0)}%`}
          trend={{ value: -0.5, label: "vs last week" }}
          icon={<Quote className="h-4 w-4" />}
        />
        <MetricCard
          title="Recommendation Rate"
          value={`${(metrics.recommendationRate * 100).toFixed(0)}%`}
          trend={{ value: 2.1, label: "vs last week" }}
          icon={<Award className="h-4 w-4" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <TrendChart
          data={recentTrend}
          title="Visibility Score Trend"
          className="lg:col-span-2"
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold">Score Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ScoreBreakdown
              scores={[
                {
                  label: "Presence",
                  value: metrics.presenceRate * 100,
                  tooltip: "How often your brand appears in AI answers",
                },
                {
                  label: "Citations",
                  value: metrics.citationRate * 100,
                  tooltip: "How often your content is cited as a source",
                },
                {
                  label: "Recommendations",
                  value: metrics.recommendationRate * 100,
                  tooltip: "How often AI recommends your brand",
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base font-semibold">Recent Prompt Results</CardTitle>
          <Link href="/prompts">
            <Button variant="ghost" size="sm" data-testid="button-view-all-prompts">
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Prompt</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Brand Presence</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentRuns.map(({ run, template, mentions }) => {
                const targetMention = mentions.find((m) => m.isTargetBrand);
                return (
                  <TableRow key={run.id} className="hover-elevate">
                    <TableCell className="font-medium max-w-xs truncate">
                      {template.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {template.intent}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={run.runStatus === "completed" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {run.runStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {targetMention ? (
                        <MentionBadge
                          type={targetMention.matchType as any}
                          brandName={targetMention.brandName}
                          isTargetBrand
                        />
                      ) : (
                        <span className="text-muted-foreground text-sm">Not found</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/prompts?id=${run.id}`}>
                        <Button variant="ghost" size="sm" data-testid={`button-view-run-${run.id}`}>
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold">Competitors Tracked</CardTitle>
            <Badge variant="secondary">{summary.competitors.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {summary.competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="flex items-center justify-between rounded-md border border-border p-3 hover-elevate"
                >
                  <div>
                    <p className="font-medium">{competitor.name}</p>
                    <p className="text-xs text-muted-foreground">{competitor.domain}</p>
                  </div>
                  <Link href={`/comparison?competitor=${competitor.id}`}>
                    <Button variant="ghost" size="sm" data-testid={`button-compare-${competitor.id}`}>
                      Compare
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="text-base font-semibold">Audit Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Prompts</span>
                <span className="font-semibold">{metrics.totalPrompts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-semibold text-chart-2">{metrics.completedPrompts}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Audit Name</span>
                <span className="font-medium">{summary.audit.auditName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Category</span>
                <Badge variant="outline">{summary.audit.targetCategory}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-5 w-96 mt-2" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-32 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-80 lg:col-span-2" />
        <Skeleton className="h-80" />
      </div>

      <Skeleton className="h-96" />
    </div>
  );
}
