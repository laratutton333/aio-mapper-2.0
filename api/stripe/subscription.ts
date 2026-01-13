import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return demo subscription for Vercel deployment
  const subscription = {
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
      interval: "month"
    }
  };

  return res.status(200).json({ subscription });
}
