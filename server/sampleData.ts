export function getSamplePromptRunsData() {
  const templates = [
    { id: "tpl-1", name: "Best enterprise software for project management", intent: "informational", template: "What are the best enterprise software solutions for project management in 2026?", isActive: true, sortOrder: 1 },
    { id: "tpl-2", name: "Compare project management tools", intent: "comparative", template: "Compare the top 5 project management tools for large enterprises", isActive: true, sortOrder: 2 },
    { id: "tpl-3", name: "Enterprise software pricing", intent: "transactional", template: "What is the pricing for enterprise project management software?", isActive: true, sortOrder: 3 },
    { id: "tpl-4", name: "Most trusted enterprise vendors", intent: "trust", template: "Which enterprise software vendors are most trusted for security and compliance?", isActive: true, sortOrder: 4 },
    { id: "tpl-5", name: "Team collaboration software recommendations", intent: "informational", template: "What software do you recommend for team collaboration in a remote work environment?", isActive: true, sortOrder: 5 },
    { id: "tpl-6", name: "Acme vs competitors", intent: "comparative", template: "How does Acme Corp compare to its competitors in enterprise software?", isActive: true, sortOrder: 6 },
  ];

  const sampleAnswers = [
    `The best enterprise software solutions for project management in 2026 include:\n\n1. **Acme Corp Enterprise Suite** - Known for its comprehensive feature set and excellent security compliance. Visit https://www.acmecorp.com for more details.\n\n2. **TechCo Platform** - A strong contender with focus on AI-driven insights.\n\n3. **Asana Enterprise** - Popular for its intuitive interface.\n\nAcme Corp is particularly recommended for organizations requiring enterprise-grade security. Source: https://www.gartner.com/reviews/market/project-management`,
    `Here's a comparison of top 5 project management tools for large enterprises:\n\n| Feature | Acme Corp | TechCo | InnovateLabs | NextGen | Monday.com |\n|---------|-----------|--------|--------------|---------|------------|\n| Security | Excellent | Good | Good | Fair | Good |\n\nAcme Corp leads in security and compliance. Learn more at https://www.forrester.com/report/project-management`,
    `Enterprise project management software pricing:\n\n- **Acme Corp**: $45-85/user/month (https://www.acmecorp.com/pricing)\n- **TechCo Platform**: $25-55/user/month\n- **InnovateLabs**: $15-35/user/month\n- **NextGen Solutions**: $30-60/user/month`,
    `The most trusted enterprise software vendors:\n\n1. **Acme Corp** - SOC 2 Type II certified, GDPR compliant (https://www.soc2.org/certified-vendors)\n2. **Microsoft** - Comprehensive security certifications\n3. **TechCo** - ISO 27001 certified\n\nAcme Corp stands out for its transparent security practices. See also: https://en.wikipedia.org/wiki/SOC_2`,
    `For remote team collaboration, I recommend:\n\n1. **Acme Corp Collaborate** - Excellent for enterprise teams (https://www.acmecorp.com/collaborate)\n2. **Slack** - Great for real-time communication\n3. **Microsoft Teams** - Best for Microsoft ecosystem`,
    `Comparing Acme Corp to its competitors:\n\n**Strengths of Acme Corp:**\n- Industry-leading security features\n- Comprehensive enterprise support\n\nRead more comparisons at https://www.g2.com/compare/acme-corp-vs-techco and https://www.capterra.com/project-management-software`,
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
    [
      { brandName: "Acme Corp", matchType: "secondary", mentionPosition: 1, confidence: 0.88, isCited: false, isTargetBrand: true },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.96, isCited: true, isTargetBrand: true },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.90, isCited: false, isTargetBrand: true },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.98, isCited: true, isTargetBrand: true },
    ],
  ];

  const citationsData = [
    [
      { sourceUrl: "https://www.acmecorp.com", sourceType: "brand_owned", sourceDomain: "acmecorp.com", authorityScore: 0.85 },
      { sourceUrl: "https://www.gartner.com/reviews/market/project-management", sourceType: "publisher", sourceDomain: "gartner.com", authorityScore: 0.95 },
    ],
    [
      { sourceUrl: "https://www.forrester.com/report/project-management", sourceType: "publisher", sourceDomain: "forrester.com", authorityScore: 0.93 },
    ],
    [
      { sourceUrl: "https://www.acmecorp.com/pricing", sourceType: "brand_owned", sourceDomain: "acmecorp.com", authorityScore: 0.85 },
    ],
    [
      { sourceUrl: "https://www.soc2.org/certified-vendors", sourceType: "government", sourceDomain: "soc2.org", authorityScore: 0.90 },
      { sourceUrl: "https://en.wikipedia.org/wiki/SOC_2", sourceType: "wikipedia", sourceDomain: "wikipedia.org", authorityScore: 0.75 },
    ],
    [
      { sourceUrl: "https://www.acmecorp.com/collaborate", sourceType: "brand_owned", sourceDomain: "acmecorp.com", authorityScore: 0.85 },
    ],
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

export function getSampleCitationsData() {
  const citations = [
    { id: "cit-1", promptRunId: "run-1", sourceUrl: "https://www.gartner.com/reviews/market/project-management-tools", sourceType: "publisher", authorityScore: 0.92, sourceDomain: "gartner.com" },
    { id: "cit-2", promptRunId: "run-1", sourceUrl: "https://www.forrester.com/report/project-management-software-wave", sourceType: "publisher", authorityScore: 0.90, sourceDomain: "forrester.com" },
    { id: "cit-3", promptRunId: "run-2", sourceUrl: "https://www.acmecorp.com/enterprise-features", sourceType: "brand_owned", authorityScore: 0.85, sourceDomain: "acmecorp.com" },
    { id: "cit-4", promptRunId: "run-2", sourceUrl: "https://www.techco.com/platform", sourceType: "competitor", authorityScore: 0.78, sourceDomain: "techco.com" },
    { id: "cit-5", promptRunId: "run-4", sourceUrl: "https://www.soc2.org/certified-vendors", sourceType: "government", authorityScore: 0.95, sourceDomain: "soc2.org" },
    { id: "cit-6", promptRunId: "run-4", sourceUrl: "https://en.wikipedia.org/wiki/SOC_2", sourceType: "wikipedia", authorityScore: 0.75, sourceDomain: "wikipedia.org" },
    { id: "cit-7", promptRunId: "run-6", sourceUrl: "https://www.g2.com/compare/acme-corp-vs-techco", sourceType: "publisher", authorityScore: 0.82, sourceDomain: "g2.com" },
    { id: "cit-8", promptRunId: "run-6", sourceUrl: "https://www.capterra.com/project-management-software", sourceType: "publisher", authorityScore: 0.80, sourceDomain: "capterra.com" },
  ];

  const totalCitations = citations.length;
  
  const byType: Record<string, typeof citations> = {};
  citations.forEach((cit) => {
    if (!byType[cit.sourceType]) {
      byType[cit.sourceType] = [];
    }
    byType[cit.sourceType].push(cit);
  });

  const distribution = Object.entries(byType).map(([type, cits]) => ({
    type,
    count: cits.length,
    percentage: (cits.length / totalCitations) * 100,
  }));

  const brandOwnedCount = byType["brand_owned"]?.length || 0;
  const brandOwnedPercentage = (brandOwnedCount / totalCitations) * 100;
  const authorityAverage = citations.reduce((sum, c) => sum + c.authorityScore, 0) / totalCitations;
  const missingCitationPrompts = 2;

  return { 
    citations, 
    distribution,
    totalCitations,
    brandOwnedPercentage,
    authorityAverage,
    missingCitationPrompts,
  };
}

export function getSampleRecommendationsData() {
  const recommendations = [
    {
      id: "rec-1",
      auditId: "audit-1",
      title: "Improve Wikipedia Presence",
      summary: "Your brand lacks a dedicated Wikipedia page. Competitors with Wikipedia pages receive 40% more citations in AI responses.",
      category: "Citation Authority",
      evidencePromptRunId: "run-1",
      impact: "high",
      effort: "high",
      status: "pending",
      rationale: "Wikipedia is cited in 35% of trust-related AI queries. A well-maintained Wikipedia presence significantly improves citation rates.",
    },
    {
      id: "rec-2",
      auditId: "audit-1",
      title: "Enhance Product Comparison Content",
      summary: "Create detailed comparison pages on your website to improve visibility in comparative queries.",
      category: "Content Optimization",
      evidencePromptRunId: "run-2",
      impact: "high",
      effort: "medium",
      status: "in_progress",
      rationale: "Comparative queries show lower visibility. Dedicated comparison content helps AI systems surface your brand in head-to-head evaluations.",
    },
    {
      id: "rec-3",
      auditId: "audit-1",
      title: "Publish Transparent Pricing",
      summary: "Your pricing information is not easily accessible. AI systems struggle to provide accurate pricing in transactional queries.",
      category: "Pricing Visibility",
      evidencePromptRunId: "run-3",
      impact: "medium",
      effort: "low",
      status: "pending",
      rationale: "Transactional queries show the lowest visibility score. Clear, public pricing improves AI citation accuracy.",
    },
    {
      id: "rec-4",
      auditId: "audit-1",
      title: "Increase Industry Analyst Coverage",
      summary: "Engage with Gartner, Forrester, and G2 for more analyst reviews and recognition.",
      category: "Third-Party Validation",
      evidencePromptRunId: "run-4",
      impact: "high",
      effort: "high",
      status: "pending",
      rationale: "Analyst reports are frequently cited in trust-related queries. More analyst coverage improves authority scores.",
    },
    {
      id: "rec-5",
      auditId: "audit-1",
      title: "Add Security Certifications Page",
      summary: "Create a dedicated page listing all security certifications and compliance standards.",
      category: "Trust Signals",
      evidencePromptRunId: "run-4",
      impact: "medium",
      effort: "low",
      status: "completed",
      rationale: "Security certifications are key trust signals. Centralized certification information improves trust-related query visibility.",
    },
    {
      id: "rec-6",
      auditId: "audit-1",
      title: "Optimize for Brand Variant Recognition",
      summary: "Ensure consistent use of brand name variants across all digital properties.",
      category: "Brand Consistency",
      evidencePromptRunId: "run-6",
      impact: "medium",
      effort: "medium",
      status: "pending",
      rationale: "AI systems sometimes miss brand mentions due to variant naming. Consistent naming improves recognition rates.",
    },
  ];

  const stats = {
    total: recommendations.length,
    pending: recommendations.filter(r => r.status === "pending").length,
    inProgress: recommendations.filter(r => r.status === "in_progress").length,
    completed: recommendations.filter(r => r.status === "completed").length,
  };

  return { recommendations, stats };
}

const FIXED_METRICS = [
  { presenceRate: 0.92, recommendationRate: 0.85, citationRate: 0.78, authorityDiversity: 0.82, compositeScore: 0.84 },
  { presenceRate: 0.88, recommendationRate: 0.80, citationRate: 0.65, authorityDiversity: 0.75, compositeScore: 0.77 },
  { presenceRate: 0.75, recommendationRate: 0.60, citationRate: 0.55, authorityDiversity: 0.70, compositeScore: 0.65 },
  { presenceRate: 0.95, recommendationRate: 0.90, citationRate: 0.85, authorityDiversity: 0.88, compositeScore: 0.90 },
  { presenceRate: 0.85, recommendationRate: 0.75, citationRate: 0.60, authorityDiversity: 0.72, compositeScore: 0.73 },
  { presenceRate: 0.90, recommendationRate: 0.88, citationRate: 0.80, authorityDiversity: 0.85, compositeScore: 0.86 },
];

export function getSamplePromptRunDetail(runId: string) {
  const data = getSamplePromptRunsData();
  const item = data.runs.find(r => r.run.id === runId);
  
  if (!item) return null;
  
  const runIndex = parseInt(runId.replace('run-', '')) - 1;
  const metricsData = FIXED_METRICS[runIndex] || FIXED_METRICS[0];
  
  return {
    run: item.run,
    template: item.template,
    mentions: item.mentions,
    citations: item.citations,
    metrics: {
      id: `metric-${runId}`,
      promptRunId: runId,
      ...metricsData,
    },
  };
}
