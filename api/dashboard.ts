import type { VercelRequest, VercelResponse } from '@vercel/node';

// In-memory storage for demo data
function getDashboardData() {
  const brand = {
    id: "brand-1",
    name: "Acme Corp",
    primaryDomain: "acmecorp.com",
    brandVariants: ["Acme", "Acme Corp", "Acme Corporation"],
  };

  const audit = {
    id: "audit-1",
    brandId: brand.id,
    auditName: "Q1 2026 Visibility Audit",
    targetCategory: "Enterprise Software",
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  const competitors = [
    { id: "comp-1", auditId: audit.id, name: "TechCo", domain: "techco.com" },
    { id: "comp-2", auditId: audit.id, name: "InnovateLabs", domain: "innovatelabs.io" },
    { id: "comp-3", auditId: audit.id, name: "NextGen Solutions", domain: "nextgen.com" },
  ];

  const templates = [
    { id: "tpl-1", name: "Best enterprise software for project management", intent: "informational", template: "What are the best enterprise software solutions for project management in 2026?", isActive: true, sortOrder: 1 },
    { id: "tpl-2", name: "Compare project management tools", intent: "comparative", template: "Compare the top 5 project management tools for large enterprises", isActive: true, sortOrder: 2 },
    { id: "tpl-3", name: "Enterprise software pricing", intent: "transactional", template: "What is the pricing for enterprise project management software?", isActive: true, sortOrder: 3 },
    { id: "tpl-4", name: "Most trusted enterprise vendors", intent: "trust", template: "Which enterprise software vendors are most trusted for security and compliance?", isActive: true, sortOrder: 4 },
    { id: "tpl-5", name: "Team collaboration software recommendations", intent: "informational", template: "What software do you recommend for team collaboration in a remote work environment?", isActive: true, sortOrder: 5 },
    { id: "tpl-6", name: "Acme vs competitors", intent: "comparative", template: "How does Acme Corp compare to its competitors in enterprise software?", isActive: true, sortOrder: 6 },
  ];

  const sampleAnswers = [
    `The best enterprise software solutions for project management in 2026 include:\n\n1. **Acme Corp Enterprise Suite** - Known for its comprehensive feature set and excellent security compliance.\n\n2. **TechCo Platform** - A strong contender with focus on AI-driven insights.\n\n3. **Asana Enterprise** - Popular for its intuitive interface.\n\nAcme Corp is particularly recommended for organizations requiring enterprise-grade security.`,
    `Here's a comparison of top 5 project management tools for large enterprises:\n\n| Feature | Acme Corp | TechCo | InnovateLabs | NextGen | Monday.com |\n|---------|-----------|--------|--------------|---------|------------|\n| Security | Excellent | Good | Good | Fair | Good |\n\nAcme Corp leads in security and compliance.`,
    `Enterprise project management software pricing:\n\n- **Acme Corp**: $45-85/user/month\n- **TechCo Platform**: $25-55/user/month\n- **InnovateLabs**: $15-35/user/month\n- **NextGen Solutions**: $30-60/user/month`,
    `The most trusted enterprise software vendors:\n\n1. **Acme Corp** - SOC 2 Type II certified, GDPR compliant\n2. **Microsoft** - Comprehensive security certifications\n3. **TechCo** - ISO 27001 certified\n\nAcme Corp stands out for its transparent security practices.`,
    `For remote team collaboration, I recommend:\n\n1. **Acme Corp Collaborate** - Excellent for enterprise teams\n2. **Slack** - Great for real-time communication\n3. **Microsoft Teams** - Best for Microsoft ecosystem`,
    `Comparing Acme Corp to its competitors:\n\n**Strengths of Acme Corp:**\n- Industry-leading security features\n- Comprehensive enterprise support\n\n**Areas where competitors excel:**\n- TechCo has better AI features\n- InnovateLabs offers lower pricing`,
  ];

  const now = new Date();
  const runs = templates.map((tpl, i) => ({
    id: `run-${i + 1}`,
    auditId: audit.id,
    promptTemplateId: tpl.id,
    llmModel: "gpt-4",
    runStatus: "completed",
    executedAt: new Date(now.getTime() - (6 - i) * 60 * 60 * 1000).toISOString(),
    rawAnswer: sampleAnswers[i],
    promptText: tpl.template,
  }));

  const mentionsData = [
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.95, isCited: true, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.88, isCited: false, isTargetBrand: false },
      { brandName: "NextGen Solutions", matchType: "secondary", mentionPosition: 3, confidence: 0.82, isCited: false, isTargetBrand: false },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.92, isCited: true, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.90, isCited: false, isTargetBrand: false },
      { brandName: "InnovateLabs", matchType: "secondary", mentionPosition: 3, confidence: 0.85, isCited: false, isTargetBrand: false },
      { brandName: "NextGen", matchType: "secondary", mentionPosition: 4, confidence: 0.80, isCited: false, isTargetBrand: false },
    ],
    [
      { brandName: "Acme Corp", matchType: "secondary", mentionPosition: 1, confidence: 0.88, isCited: false, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.85, isCited: false, isTargetBrand: false },
      { brandName: "InnovateLabs", matchType: "secondary", mentionPosition: 3, confidence: 0.82, isCited: false, isTargetBrand: false },
      { brandName: "NextGen", matchType: "secondary", mentionPosition: 4, confidence: 0.78, isCited: false, isTargetBrand: false },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.96, isCited: true, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.75, isCited: false, isTargetBrand: false },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.90, isCited: false, isTargetBrand: true },
    ],
    [
      { brandName: "Acme Corp", matchType: "primary", mentionPosition: 1, confidence: 0.98, isCited: true, isTargetBrand: true },
      { brandName: "TechCo", matchType: "secondary", mentionPosition: 2, confidence: 0.88, isCited: false, isTargetBrand: false },
      { brandName: "InnovateLabs", matchType: "secondary", mentionPosition: 3, confidence: 0.85, isCited: false, isTargetBrand: false },
      { brandName: "NextGen", matchType: "implied", mentionPosition: 4, confidence: 0.70, isCited: false, isTargetBrand: false },
    ],
  ];

  let mentionId = 1;
  const allMentions: any[] = [];
  runs.forEach((run, runIdx) => {
    mentionsData[runIdx].forEach((m) => {
      allMentions.push({ id: `mention-${mentionId++}`, promptRunId: run.id, ...m });
    });
  });

  // Calculate metrics
  const totalPrompts = runs.length;
  const completedPrompts = runs.filter((r) => r.runStatus === "completed").length;
  const primaryMentions = allMentions.filter((m) => m.isTargetBrand && m.matchType === "primary").length;
  const presenceRate = completedPrompts > 0 ? (allMentions.filter((m) => m.isTargetBrand).length / completedPrompts) : 0;
  const citationRate = completedPrompts > 0 ? (allMentions.filter((m) => m.isTargetBrand && m.isCited).length / completedPrompts) * 0.79 : 0;
  const recommendationRate = completedPrompts > 0 ? (primaryMentions / completedPrompts) * 0.925 : 0;
  const visibilityScore = (presenceRate * 0.3 + citationRate * 0.35 + recommendationRate * 0.35);

  // Generate trend data
  const trend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    trend.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      score: Math.round((70 + Math.random() * 15) * 10) / 10,
    });
  }

  const recentRuns = runs.slice().reverse().map((run, idx) => {
    const runIdx = runs.length - 1 - idx;
    return {
      run,
      template: templates[runIdx],
      mentions: allMentions.filter((m) => m.promptRunId === run.id),
    };
  });

  return {
    summary: {
      audit,
      brand,
      competitors,
      metrics: {
        visibilityScore,
        presenceRate,
        citationRate,
        recommendationRate,
        totalPrompts,
        completedPrompts,
      },
      recentTrend: trend,
    },
    recentRuns,
  };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getDashboardData();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ error: 'Failed to load dashboard data' });
  }
}
