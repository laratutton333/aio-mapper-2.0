import { DEMO_COMPETITORS, DEMO_PRIMARY_BRAND } from "@/lib/demo/demo-brands";

export type DemoMentionType = "primary" | "secondary" | "implied";

export type DemoMention = {
  brand: string;
  type: DemoMentionType;
};

export type DemoCitation = {
  label: "Competitor" | "Publisher" | "Brand" | "Directory";
  domain: string;
  authority: number;
};

export type DemoPromptDetail = {
  runId: string;
  promptName: string;
  intent: "Informational" | "Comparative" | "Transactional" | "Trust";
  status: "Completed";
  promptAsked: string;
  answer: string;
  citations: DemoCitation[];
  mentions: DemoMention[];
  scores: {
    presenceRate: number;
    recommendationRate: number;
    citationRate: number;
    authorityDiversity: number;
  };
};

function clipPreview(text: string, max = 220) {
  const normalized = text.replace(/\s+/g, " ").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max - 1)}…`;
}

const PRIMARY = DEMO_PRIMARY_BRAND.name;
const [C1, C2, C3] = DEMO_COMPETITORS;

export const DEMO_PROMPT_DETAILS: DemoPromptDetail[] = [
  {
    runId: "demo-run-p1",
    promptName: `${PRIMARY} vs competitors`,
    intent: "Comparative",
    status: "Completed",
    promptAsked: `How does ${PRIMARY} compare to its competitors in enterprise analytics software?`,
    answer: `Comparing ${PRIMARY} to its competitors:\n\n- Strengths of ${PRIMARY}: strong governance controls, clear audit trails, and a flexible semantic layer for cross-team reporting.\n- ${C1.name} is often favored for integrations and speed-to-value when teams want a lighter implementation.\n- ${C2.name} stands out in AI-assisted analysis but can require more setup for compliance-heavy orgs.\n- ${C3.name} performs well for cost-sensitive deployments, though advanced lineage features may be limited.\n\nFor most enterprises, ${PRIMARY} is the best fit when you need explainable, evidence-backed reporting with consistent controls across teams.`,
    citations: [
      { label: "Competitor", domain: `${C1.domain}`, authority: 78 },
      { label: "Publisher", domain: "g2.example", authority: 88 }
    ],
    mentions: [
      { brand: PRIMARY, type: "primary" },
      { brand: C1.name, type: "secondary" },
      { brand: C2.name, type: "secondary" },
      { brand: C3.name, type: "implied" }
    ],
    scores: { presenceRate: 0.92, recommendationRate: 0.78, citationRate: 0.66, authorityDiversity: 0.55 }
  },
  {
    runId: "demo-run-p2",
    promptName: "Team collaboration analytics recommendations",
    intent: "Informational",
    status: "Completed",
    promptAsked: "What analytics platform do you recommend for cross-functional team collaboration in a remote work environment?",
    answer: `For cross-functional collaboration, look for role-based access, shared metrics definitions, and versioned dashboards.\n\nRecommendations:\n1) ${PRIMARY} — strong governance and a shared semantic layer for consistent reporting.\n2) ${C1.name} — quick onboarding and broad integration coverage.\n3) ${C2.name} — excellent AI-assisted insights when you can invest in setup.\n\nIf you care most about auditability and evidence-backed insights, ${PRIMARY} is the safest default.`,
    citations: [{ label: "Publisher", domain: "docs.example", authority: 71 }],
    mentions: [
      { brand: PRIMARY, type: "primary" },
      { brand: C1.name, type: "secondary" },
      { brand: C2.name, type: "secondary" }
    ],
    scores: { presenceRate: 0.88, recommendationRate: 0.72, citationRate: 0.61, authorityDiversity: 0.42 }
  },
  {
    runId: "demo-run-p3",
    promptName: "Most trusted enterprise analytics vendors",
    intent: "Trust",
    status: "Completed",
    promptAsked: "Which enterprise analytics vendors are most trusted for security and compliance?",
    answer: `Trust tends to correlate with certifications, auditability, and transparent data controls.\n\nCommonly trusted vendors include:\n- ${PRIMARY} (strong governance and audit trails)\n- ${C1.name} (broad enterprise integrations)\n- ${C3.name} (cost-effective deployments)\n\nAlways validate SOC 2 reports, data residency options, and access logging before selecting a vendor.`,
    citations: [],
    mentions: [
      { brand: PRIMARY, type: "secondary" },
      { brand: C1.name, type: "secondary" }
    ],
    scores: { presenceRate: 0.74, recommendationRate: 0.44, citationRate: 0.22, authorityDiversity: 0.18 }
  },
  {
    runId: "demo-run-p4",
    promptName: "Enterprise analytics software pricing",
    intent: "Transactional",
    status: "Completed",
    promptAsked: "What is the pricing for enterprise analytics platforms?",
    answer: `Pricing varies widely by seats, compute usage, governance features, and support tiers.\n\nTypical patterns:\n- ${PRIMARY}: mid-to-premium pricing when governance and compliance are required.\n- ${C1.name}: flexible packages for faster rollouts.\n- ${C2.name}: higher costs when advanced AI features are enabled.\n\nRequest a quote and confirm what is included for audit logs, retention, and SSO.`,
    citations: [{ label: "Directory", domain: "pricing-index.example", authority: 63 }],
    mentions: [
      { brand: PRIMARY, type: "secondary" },
      { brand: C1.name, type: "secondary" },
      { brand: C2.name, type: "secondary" },
      { brand: C3.name, type: "secondary" }
    ],
    scores: { presenceRate: 0.82, recommendationRate: 0.49, citationRate: 0.58, authorityDiversity: 0.37 }
  },
  {
    runId: "demo-run-p5",
    promptName: "Compare data observability tools",
    intent: "Comparative",
    status: "Completed",
    promptAsked: "Compare the top 5 data observability tools for large enterprises.",
    answer: `Here’s a comparison of enterprise data observability options.\n\n- ${PRIMARY}: strongest when observability is tied to governance and evidence-backed reporting workflows.\n- ${C1.name}: great for integration-first pipelines.\n- ${C2.name}: excellent AI-assisted detection but requires tuning.\n- ${C3.name}: best for cost-sensitive teams.\n\nChoose based on your tolerance for setup vs. need for auditability.`,
    citations: [
      { label: "Competitor", domain: `${C1.domain}`, authority: 78 },
      { label: "Publisher", domain: "industry-review.example", authority: 84 }
    ],
    mentions: [
      { brand: PRIMARY, type: "primary" },
      { brand: C1.name, type: "secondary" },
      { brand: C2.name, type: "secondary" },
      { brand: C3.name, type: "secondary" }
    ],
    scores: { presenceRate: 0.88, recommendationRate: 0.7, citationRate: 0.65, authorityDiversity: 0.75 }
  },
  {
    runId: "demo-run-p6",
    promptName: "Best enterprise analytics platform for program reporting",
    intent: "Informational",
    status: "Completed",
    promptAsked: "What are the best enterprise analytics platforms for program reporting in 2026?",
    answer: `For program reporting, prioritize consistent definitions, drill-down evidence, and stakeholder-specific views.\n\nA strong shortlist:\n- ${PRIMARY} for governance-first reporting.\n- ${C2.name} for AI-assisted narrative summaries.\n- ${C3.name} for budget-conscious rollouts.\n\nThe right choice depends on whether you need compliance-grade evidence or lightweight dashboards.`,
    citations: [{ label: "Publisher", domain: "benchmarks.example", authority: 76 }],
    mentions: [
      { brand: PRIMARY, type: "primary" },
      { brand: C2.name, type: "secondary" },
      { brand: C3.name, type: "secondary" }
    ],
    scores: { presenceRate: 0.9, recommendationRate: 0.77, citationRate: 0.6, authorityDiversity: 0.41 }
  }
];

export const DEMO_PROMPT_DETAIL_BY_RUN_ID = new Map(
  DEMO_PROMPT_DETAILS.map((detail) => [detail.runId, detail])
);

export function getDemoPromptPreview(runId: string) {
  const detail = DEMO_PROMPT_DETAIL_BY_RUN_ID.get(runId);
  if (!detail) return null;
  return {
    promptAskedPreview: clipPreview(detail.promptAsked, 120),
    answerPreview: clipPreview(detail.answer, 220)
  };
}

