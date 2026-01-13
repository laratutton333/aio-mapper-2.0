import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RecommendationCard } from "@/components/recommendation-card";
import { EvidenceDrawer } from "@/components/evidence-drawer";
import { queryClient, apiRequest } from "@/lib/queryClient";
import {
  FileText,
  Shield,
  Link2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Filter,
} from "lucide-react";
import type { Recommendation, PromptRunDetail } from "@shared/schema";

interface RecommendationsPageData {
  recommendations: Recommendation[];
  stats: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
  };
}

const categoryFilters = [
  { value: "all", label: "All", icon: Filter },
  { value: "content", label: "Content", icon: FileText },
  { value: "authority", label: "Authority", icon: Shield },
  { value: "structure", label: "Structure", icon: Link2 },
];

const statusFilters = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending", icon: Clock },
  { value: "in_progress", label: "In Progress", icon: ArrowUpRight },
  { value: "completed", label: "Completed", icon: CheckCircle2 },
];

export default function RecommendationsPage() {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvidenceId, setSelectedEvidenceId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useQuery<RecommendationsPageData>({
    queryKey: ["/api/recommendations"],
  });

  const { data: evidenceData } = useQuery<PromptRunDetail>({
    queryKey: ["/api/prompt-runs", selectedEvidenceId],
    enabled: !!selectedEvidenceId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiRequest("PATCH", `/api/recommendations/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recommendations"] });
    },
  });

  const filteredRecommendations = data?.recommendations.filter((rec) => {
    const matchesCategory = categoryFilter === "all" || rec.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || rec.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const handleViewEvidence = (evidenceId: string | null) => {
    if (evidenceId) {
      setSelectedEvidenceId(evidenceId);
      setDrawerOpen(true);
    }
  };

  const handleStatusChange = (id: string, status: string) => {
    updateStatusMutation.mutate({ id, status });
  };

  if (isLoading) {
    return <RecommendationsPageSkeleton />;
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Unable to load recommendations</p>
      </div>
    );
  }

  const { stats } = data;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Recommendations</h1>
        <p className="text-muted-foreground mt-1">
          Actionable insights to improve your AI visibility
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Total Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover-elevate ${statusFilter === "pending" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "pending" ? "all" : "pending")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-4">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover-elevate ${statusFilter === "in_progress" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "in_progress" ? "all" : "in_progress")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <ArrowUpRight className="h-3.5 w-3.5" />
              In Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-1">{stats.inProgress}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover-elevate ${statusFilter === "completed" ? "ring-2 ring-primary" : ""}`}
          onClick={() => setStatusFilter(statusFilter === "completed" ? "all" : "completed")}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-chart-2">{stats.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={categoryFilter} onValueChange={setCategoryFilter}>
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            {categoryFilters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                data-testid={`tab-category-${filter.value}`}
              >
                <filter.icon className="h-4 w-4 mr-1.5" />
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="flex items-center gap-2">
            {statusFilters.map((filter) => (
              <Button
                key={filter.value}
                variant={statusFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(filter.value)}
                data-testid={`button-status-${filter.value}`}
              >
                {filter.icon && <filter.icon className="h-3.5 w-3.5 mr-1.5" />}
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {categoryFilters.map((category) => (
          <TabsContent key={category.value} value={category.value} className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="secondary">
                {filteredRecommendations?.length || 0} recommendation
                {filteredRecommendations?.length !== 1 ? "s" : ""}
              </Badge>
            </div>

            {filteredRecommendations && filteredRecommendations.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredRecommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    onViewEvidence={
                      rec.evidencePromptRunId
                        ? () => handleViewEvidence(rec.evidencePromptRunId)
                        : undefined
                    }
                    onStatusChange={(status) => handleStatusChange(rec.id, status)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No recommendations found</p>
                <p className="text-muted-foreground mt-1">
                  {statusFilter !== "all"
                    ? `No ${statusFilter.replace("_", " ")} recommendations in this category`
                    : "All recommendations have been addressed"}
                </p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <EvidenceDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        data={evidenceData || null}
      />
    </div>
  );
}

function RecommendationsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-5 w-72 mt-2" />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-12" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    </div>
  );
}
