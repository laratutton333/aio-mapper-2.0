import { DEMO_COMPETITORS, DEMO_PRIMARY_BRAND } from "@/lib/demo/demo-brands";

export type DemoRecommendationCategory = "Content" | "Authority" | "Structure";
export type DemoRecommendationStatus = "Pending" | "In Progress" | "Completed";
export type DemoImpact = "High" | "Medium" | "Low";
export type DemoEffort = "Low" | "Medium" | "High";

export type DemoRecommendation = {
  id: string;
  title: string;
  category: DemoRecommendationCategory;
  impact: DemoImpact;
  effort: DemoEffort;
  status: DemoRecommendationStatus;
  summary: string;
  why: string;
  evidence: {
    basedOn: string[];
    observedPatterns: string[];
  };
};

export type DemoRecommendationsData = {
  brandName: string;
  total: number;
  counts: Record<DemoRecommendationStatus, number>;
  items: DemoRecommendation[];
};

export function getDemoRecommendationsData(): DemoRecommendationsData {
  const brandName = DEMO_PRIMARY_BRAND.name;
  const [c1, c2] = DEMO_COMPETITORS;

  const items: DemoRecommendation[] = [
    {
      id: "rec-pricing-clarity",
      title: "Improve pricing page clarity",
      category: "Content",
      impact: "High",
      effort: "Low",
      status: "Pending",
      summary:
        `Based on observed answer patterns for transactional questions, pages with clear tier breakdowns are frequently referenced in similar comparisons. Add a concise tier grid, feature callouts, and a short “who it’s for” section for ${brandName}.`,
      why:
        "Pricing transparency is commonly referenced in AI-generated responses when users ask for “best option” or “cost vs value” comparisons.",
      evidence: {
        basedOn: [
          "Transactional prompts related to pricing and alternatives",
          "Comparative prompts mentioning feature trade-offs"
        ],
        observedPatterns: [
          `Third-party pricing summaries (e.g., ${c1.name}) were cited more often than brand pages`,
          "Answers included tier comparisons when source pages had structured feature lists"
        ]
      }
    },
    {
      id: "rec-structured-data",
      title: "Add structured data markup",
      category: "Structure",
      impact: "Medium",
      effort: "Low",
      status: "In Progress",
      summary:
        `Add Organization and Product schema for ${brandName} and key feature pages. This makes key facts easier to interpret and frequently referenced in similar questions.`,
      why:
        "Structured markup is common in sources that appear consistently across AI-generated answers for brand and product queries.",
      evidence: {
        basedOn: ["Brand + product definition prompts", "“What is X?” informational prompts"],
        observedPatterns: [
          "Pages with consistent entity signals are referenced more often",
          "Structured metadata reduces ambiguity in brand/product naming"
        ]
      }
    },
    {
      id: "rec-third-party-validation",
      title: "Expand third-party validation coverage",
      category: "Authority",
      impact: "High",
      effort: "Medium",
      status: "Pending",
      summary:
        `Improve presence on review and directory pages that are frequently referenced in similar questions (e.g., independent software directories). Add consistent messaging for ${brandName} and ensure profiles link back to core pages.`,
      why:
        "Independent reviews are commonly referenced in AI-generated responses for trust and shortlisting queries.",
      evidence: {
        basedOn: ["Trust prompts related to compliance and credibility", "“Most trusted vendors” prompts"],
        observedPatterns: [
          `Competing brands (e.g., ${c2.name}) were referenced via third-party pages`,
          "Answers tended to include citations from well-known directories"
        ]
      }
    },
    {
      id: "rec-competitive-pages",
      title: "Create competitor comparison pages",
      category: "Content",
      impact: "High",
      effort: "Medium",
      status: "Pending",
      summary:
        `Create comparison pages that address common questions (feature differences, pricing approach, and ideal use cases). These are frequently referenced in similar “X vs Y” prompts and can help ${brandName} control narrative.`,
      why:
        "Comparative queries often cite the most comprehensive comparison sources with clear evidence and trade-offs.",
      evidence: {
        basedOn: ["Comparative prompts (X vs Y)", "Alternative/competitor prompts"],
        observedPatterns: [
          "Answers favored sources with side-by-side tables",
          "Comparison pages that define “who wins for what” were referenced more often"
        ]
      }
    },
    {
      id: "rec-security-docs",
      title: "Keep security documentation current",
      category: "Content",
      impact: "Low",
      effort: "Low",
      status: "Completed",
      summary:
        `Maintain a single security page with updated certifications, policies, and FAQs. Based on observed answer patterns, this kind of page is commonly referenced for trust-related questions.`,
      why:
        "Trust queries frequently reference clear security and compliance documentation when it’s centralized and easy to scan.",
      evidence: {
        basedOn: ["Trust prompts referencing security, compliance, and governance"],
        observedPatterns: [
          "Answers used short excerpts from security FAQs",
          "Sources with updated dates and clear sectioning were referenced more often"
        ]
      }
    }
  ];

  const counts: DemoRecommendationsData["counts"] = {
    Pending: items.filter((i) => i.status === "Pending").length,
    "In Progress": items.filter((i) => i.status === "In Progress").length,
    Completed: items.filter((i) => i.status === "Completed").length
  };

  return { brandName, total: items.length, counts, items };
}

