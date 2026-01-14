export type PromptIntent = "informational" | "comparative" | "transactional" | "trust";
export type MatchType = "primary" | "secondary" | "implied" | "none";
export type SourceType = "brand_owned" | "publisher" | "government" | "wikipedia" | "ugc" | "other";
export type RecommendationPriority = "high" | "medium" | "low";
export type RecommendationStatus = "pending" | "in_progress" | "completed" | "dismissed";
export type RecommendationCategory = "content" | "seo" | "technical" | "outreach";

export interface SafeUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  profileImageUrl: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  compositeScore: number;
  compositeScoreTrend: number;
  presenceRate: number;
  presenceRateTrend: number;
  citationRate: number;
  citationRateTrend: number;
  recommendationRate: number;
  recommendationRateTrend: number;
  totalPrompts: number;
  totalCitations: number;
  avgPosition: number;
}

export interface ScoreByIntent {
  intent: PromptIntent;
  score: number;
  count: number;
}

export interface CitationByType {
  type: SourceType;
  count: number;
  percentage: number;
}

export interface TrendDataPoint {
  date: string;
  compositeScore: number;
  presenceRate: number;
  citationRate: number;
}

export interface RecentRun {
  id: string;
  promptName: string;
  intent: PromptIntent;
  executedAt: string;
  matchType: MatchType;
  isCited: boolean;
  compositeScore: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  scoresByIntent: ScoreByIntent[];
  citationsByType: CitationByType[];
  trendData: TrendDataPoint[];
  recentRuns: RecentRun[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  intent: PromptIntent;
  template: string;
  isActive: boolean;
  sortOrder: number;
}

export interface PromptRun {
  id: string;
  auditId: string;
  promptTemplateId: string;
  llmModel: string;
  runStatus: string;
  executedAt: string;
  rawAnswer: string;
  promptText: string;
}

export interface PromptMention {
  id: string;
  promptRunId: string;
  brandName: string;
  matchType: MatchType;
  mentionPosition: number;
  confidence: number;
  isCited: boolean;
  isTargetBrand: boolean;
}

export interface Citation {
  id: string;
  promptRunId: string;
  sourceUrl: string;
  sourceType: SourceType;
  sourceDomain: string;
  authorityScore: number;
}

export interface PromptRunDetail {
  run: PromptRun;
  template: PromptTemplate;
  mentions: PromptMention[];
  citations: Citation[];
}

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  priority: RecommendationPriority;
  title: string;
  description: string;
  impact: string;
  effort: string;
  status: RecommendationStatus;
}

export interface BrandComparison {
  brand: string;
  presenceRate: number;
  citationRate: number;
  recommendationRate: number;
  compositeScore: number;
}
