const BRAND = {
  id: "brand-1",
  name: "Acme Corp",
  primaryDomain: "acmecorp.com",
  brandVariants: ["Acme", "Acme Corp", "Acme Corporation"],
};

const AUDIT = {
  id: "audit-1",
  brandId: BRAND.id,
  auditName: "Q1 2026 Visibility Audit",
  targetCategory: "Enterprise Software",
  createdAt: new Date(),
  status: "completed",
};

const COMPETITORS = [
  { id: "comp-1", auditId: AUDIT.id, name: "TechCo", domain: "techco.com" },
  { id: "comp-2", auditId: AUDIT.id, name: "InnovateLabs", domain: "innovatelabs.io" },
  { id: "comp-3", auditId: AUDIT.id, name: "NextGen Solutions", domain: "nextgen.com" },
];

export const PROMPT_TEMPLATES = [
  {
    id: "tpl-1",
    name: "Best enterprise software for project management",
    intent: "informational",
    template:
      "What are the best enterprise software solutions for project management in 2026?",
    isActive: true,
    sortOrder: 1,
  },
  {
    id: "tpl-2",
    name: "Compare project management tools",
    intent: "comparative",
    template: "Compare the top 5 project management tools for large enterprises",
    isActive: true,
    sortOrder: 2,
  },
  {
    id: "tpl-3",
    name: "Enterprise software pricing",
    intent: "transactional",
    template: "What is the pricing for enterprise project management software?",
    isActive: true,
    sortOrder: 3,
  },
  {
    id: "tpl-4",
    name: "Most trusted enterprise vendors",
    intent: "trust",
    template:
      "Which enterprise software vendors are most trusted for security and compliance?",
    isActive: true,
    sortOrder: 4,
  },
  {
    id: "tpl-5",
    name: "Team collaboration software recommendations",
    intent: "informational",
    template:
      "What software do you recommend for team collaboration in a remote work environment?",
    isActive: true,
    sortOrder: 5,
  },
  {
    id: "tpl-6",
    name: "Acme vs competitors",
    intent: "comparative",
    template: "How does Acme Corp compare to its competitors in enterprise software?",
    isActive: true,
    sortOrder: 6,
  },
] as const;

const SAMPLE_ANSWERS = [
  `The best enterprise software solutions for project management in 2026 include:\n\n1. **Acme Corp Enterprise Suite** - Known for its comprehensive feature set and excellent security compliance. Visit https://www.acmecorp.com for more details.\n\n2. **TechCo Platform** - A strong contender with focus on AI-driven insights.\n\n3. **Asana Enterprise** - Popular for its intuitive interface.\n\nAcme Corp is particularly recommended for organizations requiring enterprise-grade security. Source: https://www.gartner.com/reviews/market/project-management`,
  `Here's a comparison of top 5 project management tools for large enterprises:\n\n| Feature | Acme Corp | TechCo | InnovateLabs | NextGen | Monday.com |\n|---------|-----------|--------|--------------|---------|------------|\n| Security | Excellent | Good | Good | Fair | Good |\n\nAcme Corp leads in security and compliance. Learn more at https://www.forrester.com/report/project-management`,
  `Enterprise project management software pricing:\n\n- **Acme Corp**: $45-85/user/month (https://www.acmecorp.com/pricing)\n- **TechCo Platform**: $25-55/user/month\n- **InnovateLabs**: $15-35/user/month\n- **NextGen Solutions**: $30-60/user/month`,
  `The most trusted enterprise software vendors:\n\n1. **Acme Corp** - SOC 2 Type II certified, GDPR compliant (https://www.soc2.org/certified-vendors)\n2. **Microsoft** - Comprehensive security certifications\n3. **TechCo** - ISO 27001 certified\n\nAcme Corp stands out for its transparent security practices. See also: https://en.wikipedia.org/wiki/SOC_2`,
  `For remote team collaboration, I recommend:\n\n1. **Acme Corp Collaborate** - Excellent for enterprise teams (https://www.acmecorp.com/collaborate)\n2. **Slack** - Great for real-time communication\n3. **Microsoft Teams** - Best for Microsoft ecosystem`,
  `Comparing Acme Corp to its competitors:\n\n**Strengths of Acme Corp:**\n- Industry-leading security features\n- Comprehensive enterprise support\n\nRead more comparisons at https://www.g2.com/compare/acme-corp-vs-techco and https://www.capterra.com/project-management-software`,
];

const MENTIONS_DATA = [
  [
    {
      brandName: "Acme Corp",
      matchType: "primary",
      mentionPosition: 1,
      confidence: 0.95,
      isCited: true,
      isTargetBrand: true,
    },
    {
      brandName: "TechCo",
      matchType: "secondary",
      mentionPosition: 2,
      confidence: 0.88,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "NextGen Solutions",
      matchType: "secondary",
      mentionPosition: 3,
      confidence: 0.82,
      isCited: false,
      isTargetBrand: false,
    },
  ],
  [
    {
      brandName: "Acme Corp",
      matchType: "primary",
      mentionPosition: 1,
      confidence: 0.92,
      isCited: true,
      isTargetBrand: true,
    },
    {
      brandName: "TechCo",
      matchType: "secondary",
      mentionPosition: 2,
      confidence: 0.90,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "InnovateLabs",
      matchType: "secondary",
      mentionPosition: 3,
      confidence: 0.85,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "NextGen",
      matchType: "secondary",
      mentionPosition: 4,
      confidence: 0.80,
      isCited: false,
      isTargetBrand: false,
    },
  ],
  [
    {
      brandName: "Acme Corp",
      matchType: "secondary",
      mentionPosition: 1,
      confidence: 0.88,
      isCited: false,
      isTargetBrand: true,
    },
    {
      brandName: "TechCo",
      matchType: "secondary",
      mentionPosition: 2,
      confidence: 0.85,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "InnovateLabs",
      matchType: "secondary",
      mentionPosition: 3,
      confidence: 0.82,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "NextGen",
      matchType: "secondary",
      mentionPosition: 4,
      confidence: 0.78,
      isCited: false,
      isTargetBrand: false,
    },
  ],
  [
    {
      brandName: "Acme Corp",
      matchType: "primary",
      mentionPosition: 1,
      confidence: 0.96,
      isCited: true,
      isTargetBrand: true,
    },
    {
      brandName: "TechCo",
      matchType: "secondary",
      mentionPosition: 2,
      confidence: 0.75,
      isCited: false,
      isTargetBrand: false,
    },
  ],
  [
    {
      brandName: "Acme Corp",
      matchType: "primary",
      mentionPosition: 1,
      confidence: 0.90,
      isCited: false,
      isTargetBrand: true,
    },
  ],
  [
    {
      brandName: "Acme Corp",
      matchType: "primary",
      mentionPosition: 1,
      confidence: 0.98,
      isCited: true,
      isTargetBrand: true,
    },
    {
      brandName: "TechCo",
      matchType: "secondary",
      mentionPosition: 2,
      confidence: 0.88,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "InnovateLabs",
      matchType: "secondary",
      mentionPosition: 3,
      confidence: 0.85,
      isCited: false,
      isTargetBrand: false,
    },
    {
      brandName: "NextGen",
      matchType: "implied",
      mentionPosition: 4,
      confidence: 0.70,
      isCited: false,
      isTargetBrand: false,
    },
  ],
];

const CITATIONS_DATA = [
  [
    {
      sourceUrl: "https://www.acmecorp.com",
      sourceType: "brand_owned",
      sourceDomain: "acmecorp.com",
      authorityScore: 0.85,
    },
    {
      sourceUrl: "https://www.gartner.com/reviews/market/project-management",
      sourceType: "publisher",
      sourceDomain: "gartner.com",
      authorityScore: 0.95,
    },
  ],
  [
    {
      sourceUrl: "https://www.forrester.com/report/project-management",
      sourceType: "publisher",
      sourceDomain: "forrester.com",
      authorityScore: 0.93,
    },
  ],
  [
    {
      sourceUrl: "https://www.acmecorp.com/pricing",
      sourceType: "brand_owned",
      sourceDomain: "acmecorp.com",
      authorityScore: 0.85,
    },
  ],
  [
    {
      sourceUrl: "https://www.soc2.org/certified-vendors",
      sourceType: "government",
      sourceDomain: "soc2.org",
      authorityScore: 0.90,
    },
    {
      sourceUrl: "https://en.wikipedia.org/wiki/SOC_2",
      sourceType: "wikipedia",
      sourceDomain: "wikipedia.org",
      authorityScore: 0.75,
    },
  ],
  [
    {
      sourceUrl: "https://www.acmecorp.com/collaborate",
      sourceType: "brand_owned",
      sourceDomain: "acmecorp.com",
      authorityScore: 0.85,
    },
  ],
  [
    {
      sourceUrl: "https://www.g2.com/compare/acme-corp-vs-techco",
      sourceType: "publisher",
      sourceDomain: "g2.com",
      authorityScore: 0.85,
    },
    {
      sourceUrl: "https://www.capterra.com/project-management-software",
      sourceType: "publisher",
      sourceDomain: "capterra.com",
      authorityScore: 0.82,
    },
  ],
];

const FIXED_METRICS = [
  {
    presenceRate: 0.92,
    recommendationRate: 0.85,
    citationRate: 0.78,
    authorityDiversity: 0.82,
    compositeScore: 0.84,
  },
  {
    presenceRate: 0.88,
    recommendationRate: 0.80,
    citationRate: 0.65,
    authorityDiversity: 0.75,
    compositeScore: 0.77,
  },
  {
    presenceRate: 0.75,
    recommendationRate: 0.60,
    citationRate: 0.55,
    authorityDiversity: 0.70,
    compositeScore: 0.65,
  },
  {
    presenceRate: 0.95,
    recommendationRate: 0.90,
    citationRate: 0.85,
    authorityDiversity: 0.88,
    compositeScore: 0.90,
  },
  {
    presenceRate: 0.85,
    recommendationRate: 0.75,
    citationRate: 0.60,
    authorityDiversity: 0.72,
    compositeScore: 0.73,
  },
  {
    presenceRate: 0.90,
    recommendationRate: 0.88,
    citationRate: 0.80,
    authorityDiversity: 0.85,
    compositeScore: 0.86,
  },
];

const PROMPT_FILTERS = {
  intents: ["informational", "comparative", "transactional", "trust"],
  statuses: ["pending", "running", "completed", "failed"],
} as const;

const TREND_BASE_SCORES = [72.5, 74.2, 71.8, 76.3, 78.1, 75.9, 79.2];

const RECOMMENDATIONS = [
  {
    id: "rec-1",
    auditId: AUDIT.id,
    title: "Improve Wikipedia Presence",
    summary:
      "Your brand lacks a dedicated Wikipedia page. Competitors with Wikipedia pages receive 40% more citations in AI responses.",
    category: "Citation Authority",
    evidencePromptRunId: "run-1",
    impact: "high",
    effort: "high",
    status: "pending",
    rationale:
      "Wikipedia is cited in 35% of trust-related AI queries. A well-maintained Wikipedia presence significantly improves citation rates.",
  },
  {
    id: "rec-2",
    auditId: AUDIT.id,
    title: "Enhance Product Comparison Content",
    summary:
      "Create detailed comparison pages on your website to improve visibility in comparative queries.",
    category: "Content Optimization",
    evidencePromptRunId: "run-2",
    impact: "high",
    effort: "medium",
    status: "in_progress",
    rationale:
      "Comparative queries show lower visibility. Dedicated comparison content helps AI systems surface your brand in head-to-head evaluations.",
  },
  {
    id: "rec-3",
    auditId: AUDIT.id,
    title: "Publish Transparent Pricing",
    summary:
      "Your pricing information is not easily accessible. AI systems struggle to provide accurate pricing in transactional queries.",
    category: "Pricing Visibility",
    evidencePromptRunId: "run-3",
    impact: "medium",
    effort: "low",
    status: "pending",
    rationale:
      "Transactional queries show the lowest visibility score. Clear, public pricing improves AI citation accuracy.",
  },
  {
    id: "rec-4",
    auditId: AUDIT.id,
    title: "Increase Industry Analyst Coverage",
    summary:
      "Engage with Gartner, Forrester, and G2 for more analyst reviews and recognition.",
    category: "Third-Party Validation",
    evidencePromptRunId: "run-4",
    impact: "high",
    effort: "high",
    status: "pending",
    rationale:
      "Analyst reports are frequently cited in trust-related queries. More analyst coverage improves authority scores.",
  },
  {
    id: "rec-5",
    auditId: AUDIT.id,
    title: "Add Security Certifications Page",
    summary:
      "Create a dedicated page listing all security certifications and compliance standards.",
    category: "Trust Signals",
    evidencePromptRunId: "run-4",
    impact: "medium",
    effort: "low",
    status: "completed",
    rationale:
      "Security certifications are key trust signals. Centralized certification information improves trust-related query visibility.",
  },
  {
    id: "rec-6",
    auditId: AUDIT.id,
    title: "Optimize for Brand Variant Recognition",
    summary:
      "Ensure consistent use of brand name variants across all digital properties.",
    category: "Brand Consistency",
    evidencePromptRunId: "run-6",
    impact: "medium",
    effort: "medium",
    status: "pending",
    rationale:
      "AI systems sometimes miss brand mentions due to variant naming. Consistent naming improves recognition rates.",
  },
];

const STRIPE_PRODUCTS = [
  {
    id: "prod_starter",
    name: "Starter",
    description: "Perfect for individuals getting started with AI visibility tracking",
    active: true,
    metadata: { tier: "starter" },
    prices: [
      {
        id: "price_starter_free",
        unit_amount: 0,
        currency: "usd",
        recurring: { interval: "month" },
        active: true,
        metadata: {},
      },
    ],
  },
  {
    id: "prod_pro",
    name: "Pro",
    description: "For growing teams that need advanced analytics and more prompts",
    active: true,
    metadata: { tier: "pro" },
    prices: [
      {
        id: "price_pro_monthly",
        unit_amount: 4900,
        currency: "usd",
        recurring: { interval: "month" },
        active: true,
        metadata: {},
      },
      {
        id: "price_pro_yearly",
        unit_amount: 47000,
        currency: "usd",
        recurring: { interval: "year" },
        active: true,
        metadata: {},
      },
    ],
  },
  {
    id: "prod_enterprise",
    name: "Enterprise",
    description: "For large organizations requiring unlimited access and premium support",
    active: true,
    metadata: { tier: "enterprise" },
    prices: [
      {
        id: "price_enterprise_monthly",
        unit_amount: 19900,
        currency: "usd",
        recurring: { interval: "month" },
        active: true,
        metadata: {},
      },
      {
        id: "price_enterprise_yearly",
        unit_amount: 199000,
        currency: "usd",
        recurring: { interval: "year" },
        active: true,
        metadata: {},
      },
    ],
  },
];

export function buildPromptRuns() {
  const now = new Date();
  return PROMPT_TEMPLATES.map((template, index) => ({
    id: `run-${index + 1}`,
    auditId: AUDIT.id,
    promptTemplateId: template.id,
    llmModel: "gpt-4o-mini",
    runStatus: "completed",
    executedAt: new Date(
      now.getTime() - (PROMPT_TEMPLATES.length - index - 1) * 60 * 60 * 1000,
    ).toISOString(),
    rawAnswer: SAMPLE_ANSWERS[index],
    promptText: template.template,
  }));
}

export function getPromptRunsData() {
  let mentionId = 1;
  let citationId = 1;
  const runs = buildPromptRuns();

  const runsWithDetails = runs.map((run, runIdx) => {
    const mentions =
      MENTIONS_DATA[runIdx]?.map((mention) => ({
        id: `mention-${mentionId++}`,
        promptRunId: run.id,
        ...mention,
      })) ?? [];

    const citations =
      CITATIONS_DATA[runIdx]?.map((citation) => ({
        id: `cit-${citationId++}`,
        promptRunId: run.id,
        ...citation,
      })) ?? [];

    return {
      run,
      template: PROMPT_TEMPLATES[runIdx],
      mentions,
      citations,
    };
  });

  return {
    runs: runsWithDetails,
    filters: PROMPT_FILTERS,
  };
}

export function getPromptRunDetail(runId: string) {
  const data = getPromptRunsData();
  const item = data.runs.find((record) => record.run.id === runId);
  if (!item) return null;

  const runIndex = Number(runId.replace("run-", "")) - 1;
  const metrics = FIXED_METRICS[runIndex] ?? FIXED_METRICS[0];

  return {
    run: item.run,
    template: item.template,
    mentions: item.mentions,
    citations: item.citations,
    metrics: {
      id: `metric-${runId}`,
      promptRunId: runId,
      ...metrics,
    },
  };
}

export function getPromptsData() {
  const data = getPromptRunsData();
  return {
    runs: data.runs.map((record, runIdx) => ({
      run: record.run,
      template: record.template,
      mentions: record.mentions,
      citations: [],
      metrics: {
        id: `metric-${runIdx + 1}`,
        promptRunId: record.run.id,
        ...(FIXED_METRICS[runIdx] ?? FIXED_METRICS[0]),
      },
    })),
    filters: PROMPT_FILTERS,
  };
}

export function getDashboardData() {
  const data = getPromptRunsData();
  const completedRuns = data.runs.filter((record) => record.run.runStatus === "completed");
  const allMentions = data.runs.flatMap((record) => record.mentions);
  const completedPrompts = completedRuns.length;
  const mentionsForBrand = allMentions.filter((mention) => mention.isTargetBrand);
  const metrics = {
    visibilityScore:
      completedPrompts > 0
        ? (mentionsForBrand.length / completedPrompts) * 0.35 +
          (mentionsForBrand.filter((m) => m.isCited).length / completedPrompts) * 0.35 +
          (mentionsForBrand.filter((m) => m.matchType === "primary").length / completedPrompts) *
            0.3
        : 0,
    presenceRate:
      completedPrompts > 0 ? mentionsForBrand.length / completedPrompts : 0,
    citationRate:
      completedPrompts > 0
        ? mentionsForBrand.filter((mention) => mention.isCited).length / completedPrompts
        : 0,
    recommendationRate:
      completedPrompts > 0
        ? mentionsForBrand.filter((mention) => mention.matchType === "primary").length /
          completedPrompts
        : 0,
    totalPrompts: data.runs.length,
    completedPrompts,
  };

  const recentTrend = TREND_BASE_SCORES.map((score, offset) => {
    const date = new Date();
    date.setDate(date.getDate() - (TREND_BASE_SCORES.length - offset - 1));
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score,
    };
  });

  return {
    summary: {
      audit: AUDIT,
      brand: BRAND,
      competitors: COMPETITORS,
      metrics,
      recentTrend,
    },
    recentRuns: data.runs
      .slice()
      .reverse()
      .map((record) => ({
        run: record.run,
        template: record.template,
        mentions: record.mentions,
      })),
  };
}

export function getComparisonData() {
  const brandsComparison = [
    {
      brand: "Acme Corp",
      presenceRate: 0.875,
      citationRate: 0.658,
      recommendationRate: 0.772,
      compositeScore: 0.76,
    },
    {
      brand: "TechCo",
      presenceRate: 0.625,
      citationRate: 0.375,
      recommendationRate: 0.458,
      compositeScore: 0.48,
    },
    {
      brand: "InnovateLabs",
      presenceRate: 0.5,
      citationRate: 0.208,
      recommendationRate: 0.333,
      compositeScore: 0.34,
    },
    {
      brand: "NextGen Solutions",
      presenceRate: 0.458,
      citationRate: 0.167,
      recommendationRate: 0.292,
      compositeScore: 0.3,
    },
  ];

  const byIntent = [
    {
      intent: "informational",
      data: [
        {
          brand: "Acme Corp",
          presenceRate: 0.9,
          citationRate: 0.7,
          recommendationRate: 0.85,
          compositeScore: 0.82,
        },
        {
          brand: "TechCo",
          presenceRate: 0.6,
          citationRate: 0.3,
          recommendationRate: 0.4,
          compositeScore: 0.43,
        },
        {
          brand: "InnovateLabs",
          presenceRate: 0.4,
          citationRate: 0.2,
          recommendationRate: 0.3,
          compositeScore: 0.3,
        },
      ],
    },
    {
      intent: "comparative",
      data: [
        {
          brand: "Acme Corp",
          presenceRate: 0.95,
          citationRate: 0.8,
          recommendationRate: 0.9,
          compositeScore: 0.88,
        },
        {
          brand: "TechCo",
          presenceRate: 0.85,
          citationRate: 0.5,
          recommendationRate: 0.6,
          compositeScore: 0.65,
        },
        {
          brand: "InnovateLabs",
          presenceRate: 0.75,
          citationRate: 0.35,
          recommendationRate: 0.45,
          compositeScore: 0.52,
        },
      ],
    },
    {
      intent: "transactional",
      data: [
        {
          brand: "Acme Corp",
          presenceRate: 0.8,
          citationRate: 0.5,
          recommendationRate: 0.6,
          compositeScore: 0.63,
        },
        {
          brand: "TechCo",
          presenceRate: 0.7,
          citationRate: 0.4,
          recommendationRate: 0.5,
          compositeScore: 0.53,
        },
        {
          brand: "InnovateLabs",
          presenceRate: 0.65,
          citationRate: 0.3,
          recommendationRate: 0.4,
          compositeScore: 0.45,
        },
      ],
    },
    {
      intent: "trust",
      data: [
        {
          brand: "Acme Corp",
          presenceRate: 0.85,
          citationRate: 0.75,
          recommendationRate: 0.8,
          compositeScore: 0.8,
        },
        {
          brand: "TechCo",
          presenceRate: 0.5,
          citationRate: 0.35,
          recommendationRate: 0.4,
          compositeScore: 0.42,
        },
      ],
    },
  ];

  return {
    brands: brandsComparison,
    byIntent,
  };
}

export function getCitationsData() {
  const citations = CITATIONS_DATA.flatMap((dataset) =>
    dataset.map((citation) => ({ ...citation })),
  );

  const totalCitations = citations.length;
  const sourceTypeCounts: Record<string, number> = {};
  citations.forEach((citation) => {
    sourceTypeCounts[citation.sourceType] =
      (sourceTypeCounts[citation.sourceType] || 0) + 1;
  });

  const distribution = Object.entries(sourceTypeCounts).map(([type, count]) => ({
    type,
    count,
    percentage: (count / totalCitations) * 100,
  }));

  const brandOwnedCount = sourceTypeCounts["brand_owned"] || 0;
  const authorityAverage =
    citations.reduce((sum, citation) => sum + citation.authorityScore, 0) / totalCitations;

  return {
    citations,
    distribution,
    totalCitations,
    brandOwnedPercentage: (brandOwnedCount / totalCitations) * 100,
    authorityAverage,
    missingCitationPrompts: 2,
  };
}

export function getRecommendationsData() {
  return RECOMMENDATIONS.map((recommendation) => ({ ...recommendation }));
}

export function computeRecommendationStats(
  recommendations: ReturnType<typeof getRecommendationsData>,
) {
  const stats = {
    total: recommendations.length,
    pending: recommendations.filter((rec) => rec.status === "pending").length,
    inProgress: recommendations.filter((rec) => rec.status === "in_progress").length,
    completed: recommendations.filter((rec) => rec.status === "completed").length,
  };
  return stats;
}

export function getStripeProducts() {
  return STRIPE_PRODUCTS;
}

export function getStripeSubscription() {
  return {
    id: "sub_demo_enterprise",
    status: "active",
    current_period_start: Math.floor(Date.now() / 1000) - 86400 * 15,
    current_period_end: Math.floor(Date.now() / 1000) + 86400 * 15,
    plan: {
      id: "price_enterprise_monthly",
      product: "prod_enterprise",
      nickname: "Enterprise Monthly",
      amount: 19900,
      currency: "usd",
      interval: "month",
    },
  };
}

export function getStripePublishableKey() {
  return process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_demo";
}
