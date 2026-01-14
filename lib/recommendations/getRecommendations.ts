import type { DashboardResponse, Recommendation } from "@/types/dashboard";

export function getRecommendationsFromDashboard(
  dashboard: DashboardResponse
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  if (dashboard.summary.presenceRate < 0.5) {
    recommendations.push({
      title: "Increase brand mention consistency",
      rationale:
        "Many prompts do not detect the brand. Ensure the brand name appears in primary descriptions, headings, and structured metadata."
    });
  }

  if (dashboard.summary.citationRate < 0.5) {
    recommendations.push({
      title: "Add citation-friendly sources",
      rationale:
        "Low citation rate suggests the model lacks verifiable references. Publish authoritative pages and ensure they are easily discoverable."
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Maintain current visibility",
      rationale:
        "Presence and citation rates are strong. Keep content fresh and monitor for regressions across intents."
    });
  }

  return recommendations;
}

