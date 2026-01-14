import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_cors';

const DEMO_USER = {
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

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const sessionCookie = req.cookies?.['aio-session'];
  
  if (sessionCookie === 'demo-session') {
    return res.status(200).json(DEMO_USER);
  }

  return res.status(401).json({ error: 'Not authenticated' });
}
