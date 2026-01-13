import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Brands table - the primary brand being tracked
export const brands = pgTable("brands", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  primaryDomain: text("primary_domain"),
  brandVariants: text("brand_variants").array(),
});

export const insertBrandSchema = createInsertSchema(brands).omit({ id: true });
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type Brand = typeof brands.$inferSelect;

// Competitors table - manually entered competitors for comparison
export const competitors = pgTable("competitors", {
  id: varchar("id", { length: 36 }).primaryKey(),
  auditId: varchar("audit_id", { length: 36 }).notNull(),
  name: text("name").notNull(),
  domain: text("domain"),
});

export const insertCompetitorSchema = createInsertSchema(competitors).omit({ id: true });
export type InsertCompetitor = z.infer<typeof insertCompetitorSchema>;
export type Competitor = typeof competitors.$inferSelect;

// Audits table - represents a visibility audit session
export const audits = pgTable("audits", {
  id: varchar("id", { length: 36 }).primaryKey(),
  brandId: varchar("brand_id", { length: 36 }).notNull(),
  auditName: text("audit_name").notNull(),
  targetCategory: text("target_category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertAuditSchema = createInsertSchema(audits).omit({ id: true, createdAt: true });
export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type Audit = typeof audits.$inferSelect;

// Prompt templates - fixed library of prompts by intent
export const promptIntents = ["informational", "comparative", "transactional", "trust"] as const;
export type PromptIntent = typeof promptIntents[number];

export const promptTemplates = pgTable("prompt_templates", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  intent: text("intent").notNull(),
  template: text("template").notNull(),
  isActive: boolean("is_active").default(true),
  sortOrder: integer("sort_order").default(0),
});

export const insertPromptTemplateSchema = createInsertSchema(promptTemplates).omit({ id: true });
export type InsertPromptTemplate = z.infer<typeof insertPromptTemplateSchema>;
export type PromptTemplate = typeof promptTemplates.$inferSelect;

// Prompt runs - individual prompt executions
export const runStatuses = ["pending", "running", "completed", "failed"] as const;
export type RunStatus = typeof runStatuses[number];

export const promptRuns = pgTable("prompt_runs", {
  id: varchar("id", { length: 36 }).primaryKey(),
  auditId: varchar("audit_id", { length: 36 }).notNull(),
  promptTemplateId: varchar("prompt_template_id", { length: 36 }).notNull(),
  llmModel: text("llm_model").notNull().default("gpt-4"),
  runStatus: text("run_status").notNull().default("pending"),
  executedAt: timestamp("executed_at"),
  rawAnswer: text("raw_answer"),
  promptText: text("prompt_text"),
});

export const insertPromptRunSchema = createInsertSchema(promptRuns).omit({ id: true, executedAt: true });
export type InsertPromptRun = z.infer<typeof insertPromptRunSchema>;
export type PromptRun = typeof promptRuns.$inferSelect;

// Prompt mentions - detected brand/competitor mentions in answers
export const matchTypes = ["primary", "secondary", "implied", "none"] as const;
export type MatchType = typeof matchTypes[number];

export const promptMentions = pgTable("prompt_mentions", {
  id: varchar("id", { length: 36 }).primaryKey(),
  promptRunId: varchar("prompt_run_id", { length: 36 }).notNull(),
  brandName: text("brand_name").notNull(),
  matchType: text("match_type").notNull(),
  mentionPosition: integer("mention_position"),
  confidence: real("confidence").default(0),
  isCited: boolean("is_cited").default(false),
  isTargetBrand: boolean("is_target_brand").default(false),
});

export const insertPromptMentionSchema = createInsertSchema(promptMentions).omit({ id: true });
export type InsertPromptMention = z.infer<typeof insertPromptMentionSchema>;
export type PromptMention = typeof promptMentions.$inferSelect;

// Citations - extracted source URLs from AI answers
export const sourceTypes = ["wikipedia", "government", "publisher", "brand_owned", "competitor", "other"] as const;
export type SourceType = typeof sourceTypes[number];

export const citations = pgTable("citations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  promptRunId: varchar("prompt_run_id", { length: 36 }).notNull(),
  sourceUrl: text("source_url").notNull(),
  sourceType: text("source_type").notNull(),
  authorityScore: real("authority_score").default(0),
  sourceDomain: text("source_domain"),
});

export const insertCitationSchema = createInsertSchema(citations).omit({ id: true });
export type InsertCitation = z.infer<typeof insertCitationSchema>;
export type Citation = typeof citations.$inferSelect;

// Prompt metrics - calculated visibility scores per prompt run
export const promptMetrics = pgTable("prompt_metrics", {
  id: varchar("id", { length: 36 }).primaryKey(),
  promptRunId: varchar("prompt_run_id", { length: 36 }).notNull(),
  presenceRate: real("presence_rate").default(0),
  recommendationRate: real("recommendation_rate").default(0),
  citationRate: real("citation_rate").default(0),
  authorityDiversity: real("authority_diversity").default(0),
  compositeScore: real("composite_score").default(0),
});

export const insertPromptMetricSchema = createInsertSchema(promptMetrics).omit({ id: true });
export type InsertPromptMetric = z.infer<typeof insertPromptMetricSchema>;
export type PromptMetric = typeof promptMetrics.$inferSelect;

// Recommendations - actionable insights from the analysis
export const impactLevels = ["high", "medium", "low"] as const;
export const effortLevels = ["high", "medium", "low"] as const;
export const recommendationStatuses = ["pending", "in_progress", "completed", "dismissed"] as const;

export const recommendations = pgTable("recommendations", {
  id: varchar("id", { length: 36 }).primaryKey(),
  auditId: varchar("audit_id", { length: 36 }).notNull(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  category: text("category").notNull(),
  evidencePromptRunId: varchar("evidence_prompt_run_id", { length: 36 }),
  impact: text("impact").notNull(),
  effort: text("effort").notNull(),
  status: text("status").notNull().default("pending"),
  rationale: text("rationale"),
});

export const insertRecommendationSchema = createInsertSchema(recommendations).omit({ id: true });
export type InsertRecommendation = z.infer<typeof insertRecommendationSchema>;
export type Recommendation = typeof recommendations.$inferSelect;

// Timeline snapshots - historical KPI data for trend tracking
export const timelineSnapshots = pgTable("timeline_snapshots", {
  id: varchar("id", { length: 36 }).primaryKey(),
  auditId: varchar("audit_id", { length: 36 }).notNull(),
  capturedAt: timestamp("captured_at").defaultNow().notNull(),
  kpiData: jsonb("kpi_data"),
});

export const insertTimelineSnapshotSchema = createInsertSchema(timelineSnapshots).omit({ id: true, capturedAt: true });
export type InsertTimelineSnapshot = z.infer<typeof insertTimelineSnapshotSchema>;
export type TimelineSnapshot = typeof timelineSnapshots.$inferSelect;

// Aggregated types for API responses
export interface AuditSummary {
  audit: Audit;
  brand: Brand;
  competitors: Competitor[];
  metrics: {
    visibilityScore: number;
    presenceRate: number;
    citationRate: number;
    recommendationRate: number;
    totalPrompts: number;
    completedPrompts: number;
  };
  recentTrend: Array<{
    date: string;
    score: number;
  }>;
}

export interface PromptRunDetail {
  run: PromptRun;
  template: PromptTemplate;
  mentions: PromptMention[];
  citations: Citation[];
  metrics: PromptMetric | null;
}

export interface ComparisonData {
  brand: string;
  presenceRate: number;
  citationRate: number;
  recommendationRate: number;
  compositeScore: number;
}

// Re-export auth models (required for Replit Auth integration)
export * from "./models/auth";

// Re-export chat models (required for OpenAI chat integration)
export * from "./models/chat";
