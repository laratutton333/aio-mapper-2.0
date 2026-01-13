import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_cors';

function getComparisonData() {
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const data = getComparisonData();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Comparison error:', error);
    return res.status(500).json({ error: 'Failed to load comparison data' });
  }
}
