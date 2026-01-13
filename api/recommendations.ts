import type { VercelRequest, VercelResponse } from '@vercel/node';

function getRecommendationsData() {
  return [
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
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getRecommendationsData();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Recommendations error:', error);
    return res.status(500).json({ error: 'Failed to load recommendations data' });
  }
}
