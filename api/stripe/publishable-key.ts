import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return demo publishable key (this would be a real key in production)
  return res.status(200).json({ 
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_demo" 
  });
}
