import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from '../_cors';

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, firstName, lastName } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email,
    firstName: firstName || null,
    lastName: lastName || null,
    profileImageUrl: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  res.setHeader('Set-Cookie', `aio-session=demo-session; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`);

  return res.status(201).json({ user: newUser });
}
