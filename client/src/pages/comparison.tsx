import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ComparisonBarChart } from "@/components/comparison-chart";
import { ScoreBar } from "@/components/score-bar";
import { TrendingUp, TrendingDown, Minus, Users } from "lucide-react";
import type { ComparisonData } from "@shared/schema";

interface ComparisonPageData {
  brands: ComparisonData[];
  byIntent: {
    intent: string;
    data: ComparisonData[];
  }[];
}

export default function ComparisonPage() {
  const { data, isLoading } = useQuery<ComparisonPageData>({
    queryKey: ["/api/comparison"],
  });

  if (isLoading) {
    return <ComparisonPageSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Unable to load comparison data</p>
      </div>
    );
  }

  const { brands, byIntent } = data;
  const targetBrand = brands[0];
  const competitors = brands.slice(1);

  const getTrendIndicator = (target: number, avg: number) => {
    const diff = target - avg;
    if (diff > 5)
      return (
        <span className="flex items-center gap-1 text-chart-2">
          <TrendingUp className="h-3 w-3" />
          Leading
        </span>
      );
    if (diff < -5)
      return (
        <span className="flex items-center gap-1 text-destructive">
          <TrendingDown className="h-3 w-3" />
          Behind
        </span>
      );
    return (
      <span className="flex items-center gap-1 text-muted-foreground">
        <Minus className="h-3 w-3" />
        On Par
      </span>
    );
  };

  const avgPresence = competitors.reduce((a, b) => a + b.presenceRate, 0) / competitors.length;
  const avgCitation = competitors.reduce((a, b) => a + b.citationRate, 0) / competitors.length;
  const avgRecommendation =
    competitors.reduce((a, b) => a + b.recommendationRate, 0) / competitors.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Brand vs Competitors</h1>
        <p className="text-muted-foreground mt-1">
          Compare AI visibility metrics across your brand and competitors
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Presence Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {(targetBrand.presenceRate * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs {(avgPresence * 100).toFixed(0)}% competitor avg
                </p>
              </div>
              {getTrendIndicator(targetBrand.presenceRate * 100, avgPresence * 100)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Citation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {(targetBrand.citationRate * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs {(avgCitation * 100).toFixed(0)}% competitor avg
                </p>
              </div>
              {getTrendIndicator(targetBrand.citationRate * 100, avgCitation * 100)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Recommendation Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold">
                  {(targetBrand.recommendationRate * 100).toFixed(0)}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  vs {(avgRecommendation * 100).toFixed(0)}% competitor avg
                </p>
              </div>
              {getTrendIndicator(
                targetBrand.recommendationRate * 100,
                avgRecommendation * 100
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
          <TabsTrigger value="by-intent" data-testid="tab-by-intent">By Intent</TabsTrigger>
          <TabsTrigger value="details" data-testid="tab-details">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <ComparisonBarChart data={brands} title="AI Visibility Comparison" />

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Share of AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {brands.map((brand, i) => (
                <ScoreBar
                  key={brand.brand}
                  label={brand.brand}
                  value={brand.compositeScore * 100}
                  tooltip={
                    i === 0
                      ? "Your brand's overall AI visibility score"
                      : `${brand.brand}'s overall AI visibility score`
                  }
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-intent" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {byIntent.map((intent) => (
              <ComparisonBarChart
                key={intent.intent}
                data={intent.data}
                title={`${intent.intent.charAt(0).toUpperCase() + intent.intent.slice(1)} Prompts`}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold">Detailed Metrics Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead className="text-right">Presence</TableHead>
                    <TableHead className="text-right">Citations</TableHead>
                    <TableHead className="text-right">Recommendations</TableHead>
                    <TableHead className="text-right">Overall Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {brands.map((brand, i) => (
                    <TableRow key={brand.brand} className={i === 0 ? "bg-primary/5" : ""}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {brand.brand}
                          {i === 0 && (
                            <Badge variant="outline" className="text-xs">
                              You
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {(brand.presenceRate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {(brand.citationRate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {(brand.recommendationRate * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right font-semibold tabular-nums">
                        {(brand.compositeScore * 100).toFixed(1)}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ComparisonPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-96 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-16" />
              <Skeleton className="h-4 w-40 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Skeleton className="h-96" />
    </div>
  );
}
