export const DEMO_USER = {
  id: "demo-user-1",
  email: "demo@example.com",
  firstName: "Demo",
  lastName: "User",
  profileImageUrl: null,
  stripeCustomerId: null,
  stripeSubscriptionId: "sub_demo_pro",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
};

export function getDashboardData() {
  const summary = {
    compositeScore: 0.76,
    compositeScoreTrend: 0.05,
    presenceRate: 0.875,
    presenceRateTrend: 0.12,
    citationRate: 0.658,
    citationRateTrend: -0.03,
    recommendationRate: 0.772,
    recommendationRateTrend: 0.08,
    totalPrompts: 24,
    totalCitations: 47,
    avgPosition: 2.3,
  };

  const scoresByIntent = [
    { intent: "informational", score: 0.82, count: 8 },
    { intent: "comparative", score: 0.71, count: 6 },
    { intent: "transactional", score: 0.68, count: 5 },
    { intent: "trust", score: 0.79, count: 5 },
  ];

  const citationsByType = [
    { type: "brand_owned", count: 12, percentage: 0.26 },
    { type: "publisher", count: 18, percentage: 0.38 },
    { type: "government", count: 5, percentage: 0.11 },
    { type: "wikipedia", count: 4, percentage: 0.09 },
    { type: "ugc", count: 8, percentage: 0.17 },
  ];

  const trendData = [
    { date: "2024-01-01", compositeScore: 0.65, presenceRate: 0.70, citationRate: 0.55 },
    { date: "2024-01-08", compositeScore: 0.68, presenceRate: 0.73, citationRate: 0.58 },
    { date: "2024-01-15", compositeScore: 0.70, presenceRate: 0.78, citationRate: 0.60 },
    { date: "2024-01-22", compositeScore: 0.72, presenceRate: 0.82, citationRate: 0.63 },
    { date: "2024-01-29", compositeScore: 0.74, presenceRate: 0.85, citationRate: 0.65 },
    { date: "2024-02-05", compositeScore: 0.76, presenceRate: 0.875, citationRate: 0.658 },
  ];

  const now = new Date();
  const recentRuns = [
    {
      id: "run-1",
      promptName: "Best enterprise software for project management",
      intent: "informational",
      executedAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      matchType: "primary",
      isCited: true,
      compositeScore: 0.85,
    },
    {
      id: "run-2",
      promptName: "Compare project management tools",
      intent: "comparative",
      executedAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      matchType: "primary",
      isCited: true,
      compositeScore: 0.78,
    },
    {
      id: "run-3",
      promptName: "Enterprise software pricing",
      intent: "transactional",
      executedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      matchType: "secondary",
      isCited: false,
      compositeScore: 0.65,
    },
    {
      id: "run-4",
      promptName: "Most trusted enterprise vendors",
      intent: "trust",
      executedAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
      matchType: "primary",
      isCited: true,
      compositeScore: 0.82,
    },
    {
      id: "run-5",
      promptName: "Team collaboration software recommendations",
      intent: "informational",
      executedAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
      matchType: "primary",
      isCited: false,
      compositeScore: 0.75,
    },
  ];

  return {
    summary,
    scoresByIntent,
    citationsByType,
    trendData,
    recentRuns,
  };
}

export function getPromptRunsData() {
  const templates = [
    { id: "tpl-1", name: "Best enterprise software for project management", intent: "informational", template: "What are the best enterprise software solutions for project management in 2026?", isActive: true, sortOrder: 1 },
    { id: "tpl-2", name: "Compare project management tools", intent: "comparative", template: "Compare the top 5 project management tools for large enterprises", isActive: true, sortOrder: 2 },
    { id: "tpl-3", name: "Enterprise software pricing", intent: "transactional", template: "What is the pricing for enterprise project management software?", isActive: true, sortOrder: 3 },
    { id: "tpl-4", name: "Most trusted enterprise vendors", intent: "trust", template: "Which enterprise software vendors are most trusted for security and compliance?", isActive: true, sortOrder: 4 },
    { id: "tpl-5", name: "Team collaboration software recommendations", intent: "informational", template: "What software do you recommend for team collaboration in a remote work environment?", isActive: true, sortOrder: 5 },
    { id: "tpl-6", name: "Acme vs competitors", intent: "comparative", template: "How does Acme Corp compare to its competitors in enterprise software?", isActive: true, sortOrder: 6 },
  ];

  const sampleAnswers = [
    `The best enterprise software solutions for project management in 2026 include:\n\n1. **Acme Corp Enterprise Suite** - Known for its comprehensive feature set and excellent security compliance. Visit https://www.acmecorp.com for more details.\n\n2. **TechCo Platform** - A strong contender with focus on AI-driven insights.\n\n3. **Asana Enterprise** - Popular for its intuitive interface.\n\nAcme Corp is particularly recommended for organizations requiring enterprise-grade security.`,
    `Here's a comparison of top 5 project management tools:\n\n| Feature | Acme Corp | TechCo | InnovateLabs | NextGen | Monday.com |\n|---------|-----------|--------|--------------|---------|------------|\n| Security | Excellent | Good | Good | Fair | Good |\n\nAcme Corp leads in security and compliance.`,
    `Enterprise project management software pricing:\n\n- **Acme Corp**: $45-85/user/month\n- **TechCo Platform**: $25-55/user/month\n- **InnovateLabs**: $15-35/user/month`,
    `The most trusted enterprise software vendors:\n\n1. **Acme Corp** - SOC 2 Type II certified, GDPR compliant\n2. **Microsoft** - Comprehensive security certifications\n3. **TechCo** - ISO 27001 certified`,
    `For remote team collaboration, I recommend:\n\n1. **Acme Corp Collaborate** - Excellent for enterprise teams\n2. **Slack** - Great for real-time communication\n3. **Microsoft Teams** - Best for Microsoft ecosystem`,
    `Comparing Acme Corp to its competitors:\n\n**Strengths of Acme Corp:**\n- Industry-leading security features\n- Comprehensive enterprise support`,
  ];

  const now = new Date();
  const runs = templates.map((tpl, i) => ({
    id: `run-${i + 1}`,
    auditId: "audit-1",
    promptTemplateId: tpl.id,
    llmModel: "gpt-4o-mini",
    runStatus: "completed",
    executedAt: new Date(now.getTime() - (6 - i) * 60 * 60 * 1000).toISOString(),
    rawAnswer: sampleAnswers[i],
    promptText: tpl.template,
  }));

  const mentionsData = [
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.95, isCited: true, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.88, isCited: false, isTargetBrand: false },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.92, isCited: true, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.90, isCited: false, isTargetBrand: false },
    ],
    [{ brandName: "Acme Corp", matchType: "secondary", mentionPosition: 1, confidence: 0.88, isCited: false, isTargetBrand: true }],
    [{ brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.96, isCited: true, isTargetBrand: true }],
    [{ brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.90, isCited: false, isTargetBrand: true }],
    [{ brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.98, isCited: true, isTargetBrand: true }],
  ];

  const citationsData = [
    [
      { sourceUrl: "https://www.acmecorp.com", sourceType: "brand_owned", sourceDomain: "acmecorp.com", authorityScore: 0.85 },
      { sourceUrl: "https://www.gartner.com/reviews/market/project-management", sourceType: "publisher", sourceDomain: "gartner.com", authorityScore: 0.95 },
    ],
    [{ sourceUrl: "https://www.forrester.com/report/project-management", sourceType: "publisher", sourceDomain: "forrester.com", authorityScore: 0.93 }],
    [{ sourceUrl: "https://www.acmecorp.com/pricing", sourceType: "brand_owned", sourceDomain: "acmecorp.com", authorityScore: 0.85 }],
    [
      { sourceUrl: "https://www.soc2.org/certified-vendors", sourceType: "government", sourceDomain: "soc2.org", authorityScore: 0.90 },
      { sourceUrl: "https://en.wikipedia.org/wiki/SOC_2", sourceType: "wikipedia", sourceDomain: "wikipedia.org", authorityScore: 0.75 },
    ],
    [{ sourceUrl: "https://www.acmecorp.com/collaborate", sourceType: "brand_owned", sourceDomain: "acmecorp.com", authorityScore: 0.85 }],
    [
      { sourceUrl: "https://www.g2.com/compare/acme-corp-vs-techco", sourceType: "publisher", sourceDomain: "g2.com", authorityScore: 0.85 },
      { sourceUrl: "https://www.capterra.com/project-management-software", sourceType: "publisher", sourceDomain: "capterra.com", authorityScore: 0.82 },
    ],
  ];

  let mentionId = 1;
  let citationId = 1;

  const runsWithDetails = runs.map((run, runIdx) => {
    const mentions = mentionsData[runIdx].map((m) => ({
      id: `mention-${mentionId++}`,
      promptRunId: run.id,
      ...m,
    }));

    const citations = citationsData[runIdx].map((c) => ({
      id: `cit-${citationId++}`,
      promptRunId: run.id,
      ...c,
    }));

    return {
      run,
      template: templates[runIdx],
      mentions,
      citations,
    };
  });

  return {
    runs: runsWithDetails,
    filters: {
      intents: ["informational", "comparative", "transactional", "trust"],
      statuses: ["pending", "running", "completed", "failed"],
    },
  };
}

export function getComparisonData() {
  const brands = [
    { brand: "Acme Corp", presenceRate: 0.875, citationRate: 0.658, recommendationRate: 0.772, compositeScore: 0.76 },
    { brand: "TechCo", presenceRate: 0.625, citationRate: 0.375, recommendationRate: 0.458, compositeScore: 0.48 },
    { brand: "InnovateLabs", presenceRate: 0.5, citationRate: 0.208, recommendationRate: 0.333, compositeScore: 0.34 },
    { brand: "NextGen Solutions", presenceRate: 0.458, citationRate: 0.167, recommendationRate: 0.292, compositeScore: 0.30 },
  ];

  const byIntent = [
    {
      intent: "informational",
      data: [
        { brand: "Acme Corp", presenceRate: 0.9, citationRate: 0.7, recommendationRate: 0.85, compositeScore: 0.82 },
        { brand: "TechCo", presenceRate: 0.6, citationRate: 0.3, recommendationRate: 0.4, compositeScore: 0.43 },
        { brand: "InnovateLabs", presenceRate: 0.4, citationRate: 0.2, recommendationRate: 0.3, compositeScore: 0.30 },
      ],
    },
    {
      intent: "comparative",
      data: [
        { brand: "Acme Corp", presenceRate: 0.95, citationRate: 0.8, recommendationRate: 0.9, compositeScore: 0.88 },
        { brand: "TechCo", presenceRate: 0.85, citationRate: 0.5, recommendationRate: 0.6, compositeScore: 0.65 },
        { brand: "InnovateLabs", presenceRate: 0.75, citationRate: 0.35, recommendationRate: 0.45, compositeScore: 0.52 },
      ],
    },
    {
      intent: "transactional",
      data: [
        { brand: "Acme Corp", presenceRate: 0.8, citationRate: 0.5, recommendationRate: 0.6, compositeScore: 0.63 },
        { brand: "TechCo", presenceRate: 0.7, citationRate: 0.4, recommendationRate: 0.5, compositeScore: 0.53 },
        { brand: "InnovateLabs", presenceRate: 0.65, citationRate: 0.3, recommendationRate: 0.4, compositeScore: 0.45 },
      ],
    },
    {
      intent: "trust",
      data: [
        { brand: "Acme Corp", presenceRate: 0.85, citationRate: 0.75, recommendationRate: 0.8, compositeScore: 0.80 },
        { brand: "TechCo", presenceRate: 0.5, citationRate: 0.35, recommendationRate: 0.4, compositeScore: 0.42 },
      ],
    },
  ];

  return { brands, byIntent };
}

export function getCitationsData() {
  const byType = [
    { type: "brand_owned", count: 12, percentage: 0.255 },
    { type: "publisher", count: 18, percentage: 0.383 },
    { type: "government", count: 5, percentage: 0.106 },
    { type: "wikipedia", count: 4, percentage: 0.085 },
    { type: "ugc", count: 8, percentage: 0.170 },
  ];

  const byDomain = [
    { domain: "acmecorp.com", count: 8, type: "brand_owned", authorityScore: 0.85 },
    { domain: "gartner.com", count: 6, type: "publisher", authorityScore: 0.95 },
    { domain: "forrester.com", count: 5, type: "publisher", authorityScore: 0.93 },
    { domain: "g2.com", count: 4, type: "publisher", authorityScore: 0.85 },
    { domain: "capterra.com", count: 3, type: "publisher", authorityScore: 0.82 },
    { domain: "wikipedia.org", count: 4, type: "wikipedia", authorityScore: 0.75 },
    { domain: "soc2.org", count: 3, type: "government", authorityScore: 0.90 },
    { domain: "reddit.com", count: 5, type: "ugc", authorityScore: 0.55 },
  ];

  const topCitations = [
    { url: "https://www.gartner.com/reviews/market/project-management", domain: "gartner.com", count: 4, type: "publisher", authorityScore: 0.95 },
    { url: "https://www.acmecorp.com", domain: "acmecorp.com", count: 4, type: "brand_owned", authorityScore: 0.85 },
    { url: "https://www.forrester.com/report/project-management", domain: "forrester.com", count: 3, type: "publisher", authorityScore: 0.93 },
    { url: "https://www.g2.com/compare/acme-corp-vs-techco", domain: "g2.com", count: 3, type: "publisher", authorityScore: 0.85 },
    { url: "https://en.wikipedia.org/wiki/SOC_2", domain: "wikipedia.org", count: 2, type: "wikipedia", authorityScore: 0.75 },
  ];

  return { byType, byDomain, topCitations };
}

export function getRecommendationsData() {
  const recommendations = [
    {
      id: "rec-1",
      category: "content",
      priority: "high",
      title: "Improve brand authority signals",
      description: "Your brand is mentioned but rarely cited. Consider creating more authoritative content that AI systems can reference.",
      impact: "Could increase citation rate by 15-25%",
      effort: "medium",
      status: "pending",
    },
    {
      id: "rec-2",
      category: "seo",
      priority: "high",
      title: "Optimize for comparative queries",
      description: "Comparative prompts show lower visibility. Create dedicated comparison pages addressing common competitor matchups.",
      impact: "Could improve comparative intent score by 20%",
      effort: "high",
      status: "in_progress",
    },
    {
      id: "rec-3",
      category: "technical",
      priority: "medium",
      title: "Add structured data markup",
      description: "Implement FAQ and HowTo schema markup to improve AI system understanding of your content.",
      impact: "Could increase presence rate by 10-15%",
      effort: "low",
      status: "pending",
    },
    {
      id: "rec-4",
      category: "content",
      priority: "medium",
      title: "Create trust-building content",
      description: "Trust-related queries show opportunity. Publish case studies, certifications, and customer testimonials.",
      impact: "Could improve trust intent score by 18%",
      effort: "medium",
      status: "pending",
    },
    {
      id: "rec-5",
      category: "outreach",
      priority: "low",
      title: "Pursue third-party reviews",
      description: "Increase presence on review platforms like G2 and Capterra to improve citation diversity.",
      impact: "Could increase third-party citations by 30%",
      effort: "high",
      status: "completed",
    },
  ];

  const stats = {
    total: 5,
    byPriority: { high: 2, medium: 2, low: 1 },
    byStatus: { pending: 3, in_progress: 1, completed: 1 },
    byCategory: { content: 2, seo: 1, technical: 1, outreach: 1 },
  };

  return { recommendations, stats };
}
