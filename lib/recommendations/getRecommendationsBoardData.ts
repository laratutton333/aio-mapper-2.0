import "server-only";

import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { DemoRecommendationsData, DemoRecommendation, DemoRecommendationCategory, DemoRecommendationStatus, DemoImpact, DemoEffort } from "@/lib/demo/demo-recommendations";
import { getCitationsReport } from "@/lib/citations/getCitationsReport";

function toCategory(value: string): DemoRecommendationCategory {
  if (value === "authority") return "Authority";
  if (value === "structure") return "Structure";
  return "Content";
}

function toImpact(value: string): DemoImpact {
  if (value === "medium") return "Medium";
  if (value === "low") return "Low";
  return "High";
}

function toEffort(value: string): DemoEffort {
  if (value === "high") return "High";
  if (value === "medium") return "Medium";
  return "Low";
}

function toStatus(value: string): DemoRecommendationStatus {
  if (value === "in_progress") return "In Progress";
  if (value === "completed") return "Completed";
  return "Pending";
}

export async function getRecommendationsBoardData(args: {
  auditId: string;
  brandName: string;
}): Promise<DemoRecommendationsData> {
  const supabase = createSupabaseAdminClient();

  const { data: rows, error } = await supabase
    .from("ai_recommendations")
    .select("id,category,title,description,why_it_matters,impact,effort,status,created_at")
    .eq("audit_id", args.auditId)
    .order("created_at", { ascending: true })
    .limit(100);

  if (error) {
    if (error.message.includes("ai_recommendations") || error.message.includes("relation")) {
      return { brandName: args.brandName, total: 0, counts: { Pending: 0, "In Progress": 0, Completed: 0 }, items: [] };
    }
    throw new Error(error.message);
  }

  const citations = await getCitationsReport({ auditId: args.auditId, brandName: args.brandName });

  const basedOn = [
    `Based on observed answer patterns for ${args.brandName} across recent prompts.`,
    `Citations observed: ${citations.totalCitations} (brand-owned ${(citations.brandOwnedRate * 100).toFixed(0)}%).`
  ];

  const observedPatterns = [
    "Some answers cite third-party sources more frequently than brand-owned pages.",
    "Comparative questions often reference sources with side-by-side feature or pricing breakdowns."
  ];

  const items: DemoRecommendation[] = (rows ?? []).map((row) => ({
    id: row.id as string,
    title: row.title as string,
    category: toCategory(row.category as string),
    impact: toImpact(row.impact as string),
    effort: toEffort(row.effort as string),
    status: toStatus(row.status as string),
    summary: row.description as string,
    why: row.why_it_matters as string,
    evidence: {
      basedOn,
      observedPatterns
    }
  }));

  const counts: DemoRecommendationsData["counts"] = {
    Pending: items.filter((i) => i.status === "Pending").length,
    "In Progress": items.filter((i) => i.status === "In Progress").length,
    Completed: items.filter((i) => i.status === "Completed").length
  };

  return { brandName: args.brandName, total: items.length, counts, items };
}

