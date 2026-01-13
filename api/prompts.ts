import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_cors';

function getPromptsData() {
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
    auditId: "audit-1",
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

  let mentionId = 1;
  return runs.map((run, runIdx) => {
    const mentions = mentionsData[runIdx].map((m) => ({
      id: `mention-${mentionId++}`,
      promptRunId: run.id,
      ...m,
    }));
    return {
      run,
      template: templates[runIdx],
      mentions,
      citations: [],
      metrics: {
        id: `metric-${runIdx + 1}`,
        promptRunId: run.id,
        presenceRate: 0.85 + Math.random() * 0.1,
        recommendationRate: 0.75 + Math.random() * 0.15,
        citationRate: 0.6 + Math.random() * 0.2,
        authorityDiversity: 0.7 + Math.random() * 0.2,
        compositeScore: 0.75 + Math.random() * 0.1,
      },
    };
  });
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getPromptsData();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Prompts error:', error);
    return res.status(500).json({ error: 'Failed to load prompts data' });
  }
}
