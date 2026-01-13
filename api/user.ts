import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Return demo user for Vercel deployment
  const demoUser = {
    id: "demo-user-1",
    email: "demo@example.com",
    firstName: "John",
    lastName: "Doe",
    profileImageUrl: null,
    stripeCustomerId: null,
    stripeSubscriptionId: "sub_demo_enterprise",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return res.status(200).json(demoUser);
}
