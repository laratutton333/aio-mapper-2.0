import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PromptResultCard } from "@/components/prompt-result-card";
import { EvidenceDrawer } from "@/components/evidence-drawer";
import { Search, Filter, X } from "lucide-react";
import type { PromptRunDetail, PromptIntent, MatchType } from "@shared/schema";

interface PromptListItem {
  run: PromptRunDetail["run"];
  template: PromptRunDetail["template"];
  mentions: PromptRunDetail["mentions"];
  citations: PromptRunDetail["citations"];
}

interface PromptsPageData {
  runs: PromptListItem[];
  filters: {
    intents: PromptIntent[];
    statuses: string[];
  };
}

const intentOptions: { value: PromptIntent; label: string }[] = [
  { value: "informational", label: "Informational" },
  { value: "comparative", label: "Comparative" },
  { value: "transactional", label: "Transactional" },
  { value: "trust", label: "Trust" },
];

const presenceOptions: { value: MatchType | "any"; label: string }[] = [
  { value: "any", label: "Any Mention" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "implied", label: "Implied" },
  { value: "none", label: "Not Found" },
];

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIntents, setSelectedIntents] = useState<PromptIntent[]>([]);
  const [selectedPresence, setSelectedPresence] = useState<(MatchType | "any")[]>([]);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useQuery<PromptsPageData>({
    queryKey: ["/api/prompt-runs"],
  });

  const { data: runDetail } = useQuery<PromptRunDetail>({
    queryKey: ["/api/prompt-runs", selectedRunId],
    enabled: !!selectedRunId,
  });

  const filteredRuns = data?.runs.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.template.template.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIntent =
      selectedIntents.length === 0 ||
      selectedIntents.includes(item.template.intent as PromptIntent);

    const matchesPresence =
      selectedPresence.length === 0 ||
      selectedPresence.includes("any") ||
      item.mentions.some((m) =>
        m.isTargetBrand && selectedPresence.includes(m.matchType as MatchType)
      );

    return matchesSearch && matchesIntent && matchesPresence;
  });

  const toggleIntent = (intent: PromptIntent) => {
    setSelectedIntents((prev) =>
      prev.includes(intent)
        ? prev.filter((i) => i !== intent)
        : [...prev, intent]
    );
  };

  const togglePresence = (presence: MatchType | "any") => {
    setSelectedPresence((prev) =>
      prev.includes(presence)
        ? prev.filter((p) => p !== presence)
        : [...prev, presence]
    );
  };

  const clearFilters = () => {
    setSelectedIntents([]);
    setSelectedPresence([]);
    setSearchQuery("");
  };

  const hasActiveFilters =
    selectedIntents.length > 0 || selectedPresence.length > 0 || searchQuery;

  const handleExpand = (runId: string) => {
    setSelectedRunId(runId);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return <PromptsPageSkeleton />;
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <Card className="w-72 shrink-0 h-fit">
        <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              data-testid="button-clear-filters"
            >
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search-prompts"
            />
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Intent Type
            </Label>
            <div className="space-y-2">
              {intentOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`intent-${option.value}`}
                    checked={selectedIntents.includes(option.value)}
                    onCheckedChange={() => toggleIntent(option.value)}
                    data-testid={`checkbox-intent-${option.value}`}
                  />
                  <Label
                    htmlFor={`intent-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Brand Presence
            </Label>
            <div className="space-y-2">
              {presenceOptions.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <Checkbox
                    id={`presence-${option.value}`}
                    checked={selectedPresence.includes(option.value)}
                    onCheckedChange={() => togglePresence(option.value)}
                    data-testid={`checkbox-presence-${option.value}`}
                  />
                  <Label
                    htmlFor={`presence-${option.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Prompt Explorer</h1>
            <p className="text-muted-foreground mt-1">
              Explore AI answers and brand visibility across all prompts
            </p>
          </div>
          <Badge variant="secondary" className="text-sm">
            {filteredRuns?.length || 0} results
          </Badge>
        </div>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="grid gap-4 pr-4">
            {filteredRuns?.map((item) => (
              <PromptResultCard
                key={item.run.id}
                run={item.run}
                template={item.template}
                mentions={item.mentions}
                citations={item.citations}
                onExpand={() => handleExpand(item.run.id)}
              />
            ))}
            {filteredRuns?.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium">No prompts found</p>
                <p className="text-muted-foreground mt-1">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <EvidenceDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        data={runDetail || null}
      />
    </div>
  );
}

function PromptsPageSkeleton() {
  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <Skeleton className="w-72 h-96 shrink-0" />
      <div className="flex-1">
        <div className="mb-6">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80 mt-2" />
        </div>
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    </div>
  );
}
