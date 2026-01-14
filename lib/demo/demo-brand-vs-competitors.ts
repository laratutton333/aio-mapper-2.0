import { DEMO_COMPETITORS, DEMO_PRIMARY_BRAND, type DemoBrand } from "@/lib/demo/demo-brands";

export type VisibilityMetric = "presence" | "citations" | "recommendations";
export type IntentGroup = "Informational" | "Comparative" | "Transactional" | "Trust";

export type BrandMetrics = {
  brand: DemoBrand;
  presence: number;
  citations: number;
  recommendations: number;
};

export type BrandVsCompetitorsData = {
  primary: DemoBrand;
  brands: BrandMetrics[];
  byIntent: Record<IntentGroup, BrandMetrics[]>;
};

function overallScore(metrics: BrandMetrics) {
  return (metrics.presence + metrics.citations + metrics.recommendations) / 3;
}

function competitorAverage(data: BrandVsCompetitorsData, metric: VisibilityMetric) {
  const competitors = data.brands.filter((row) => row.brand.id !== data.primary.id);
  const total = competitors.reduce((acc, row) => acc + row[metric], 0);
  return competitors.length ? total / competitors.length : 0;
}

export function getDemoBrandVsCompetitorsData(): BrandVsCompetitorsData {
  const primary = DEMO_PRIMARY_BRAND;

  const brands: BrandMetrics[] = [
    { brand: primary, presence: 0.87, citations: 0.72, recommendations: 0.78 },
    { brand: DEMO_COMPETITORS[0], presence: 0.75, citations: 0.65, recommendations: 0.68 },
    { brand: DEMO_COMPETITORS[1], presence: 0.7, citations: 0.57, recommendations: 0.58 },
    { brand: DEMO_COMPETITORS[2], presence: 0.65, citations: 0.49, recommendations: 0.55 }
  ];

  const byIntent: BrandVsCompetitorsData["byIntent"] = {
    Informational: [
      { brand: primary, presence: 0.84, citations: 0.63, recommendations: 0.74 },
      { brand: DEMO_COMPETITORS[0], presence: 0.73, citations: 0.62, recommendations: 0.66 },
      { brand: DEMO_COMPETITORS[1], presence: 0.71, citations: 0.54, recommendations: 0.6 },
      { brand: DEMO_COMPETITORS[2], presence: 0.62, citations: 0.47, recommendations: 0.53 }
    ],
    Comparative: [
      { brand: primary, presence: 0.88, citations: 0.7, recommendations: 0.8 },
      { brand: DEMO_COMPETITORS[0], presence: 0.76, citations: 0.64, recommendations: 0.71 },
      { brand: DEMO_COMPETITORS[1], presence: 0.69, citations: 0.58, recommendations: 0.62 },
      { brand: DEMO_COMPETITORS[2], presence: 0.64, citations: 0.51, recommendations: 0.56 }
    ],
    Transactional: [
      { brand: primary, presence: 0.86, citations: 0.73, recommendations: 0.76 },
      { brand: DEMO_COMPETITORS[0], presence: 0.74, citations: 0.68, recommendations: 0.65 },
      { brand: DEMO_COMPETITORS[1], presence: 0.68, citations: 0.56, recommendations: 0.57 },
      { brand: DEMO_COMPETITORS[2], presence: 0.61, citations: 0.48, recommendations: 0.51 }
    ],
    Trust: [
      { brand: primary, presence: 0.9, citations: 0.74, recommendations: 0.81 },
      { brand: DEMO_COMPETITORS[0], presence: 0.77, citations: 0.69, recommendations: 0.7 },
      { brand: DEMO_COMPETITORS[1], presence: 0.71, citations: 0.59, recommendations: 0.6 },
      { brand: DEMO_COMPETITORS[2], presence: 0.66, citations: 0.52, recommendations: 0.55 }
    ]
  };

  return { primary, brands, byIntent };
}

export function getDemoComparisonSummary(data: BrandVsCompetitorsData) {
  const primaryRow = data.brands.find((row) => row.brand.id === data.primary.id) ?? data.brands[0];

  const presenceAvg = competitorAverage(data, "presence");
  const citationsAvg = competitorAverage(data, "citations");
  const recommendationsAvg = competitorAverage(data, "recommendations");

  return {
    primary: primaryRow,
    competitorAverages: {
      presence: presenceAvg,
      citations: citationsAvg,
      recommendations: recommendationsAvg
    },
    leading: {
      presence: primaryRow.presence >= presenceAvg,
      citations: primaryRow.citations >= citationsAvg,
      recommendations: primaryRow.recommendations >= recommendationsAvg
    },
    overallByBrand: data.brands.map((row) => ({
      brand: row.brand,
      score: overallScore(row)
    }))
  };
}

