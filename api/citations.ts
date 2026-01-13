import type { VercelRequest, VercelResponse } from '@vercel/node';

function getCitationsData() {
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

  // Group by source type
  const byType: Record<string, any[]> = {};
  citations.forEach((cit) => {
    if (!byType[cit.sourceType]) {
      byType[cit.sourceType] = [];
    }
    byType[cit.sourceType].push(cit);
  });

  // Calculate stats
  const typeStats = Object.entries(byType).map(([type, cits]) => ({
    type,
    count: cits.length,
    avgAuthority: cits.reduce((sum, c) => sum + c.authorityScore, 0) / cits.length,
  }));

  return { citations, byType: typeStats };
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getCitationsData();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Citations error:', error);
    return res.status(500).json({ error: 'Failed to load citations data' });
  }
}
