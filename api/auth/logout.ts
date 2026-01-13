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

  res.setHeader('Set-Cookie', `aio-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);

  return res.status(200).json({ success: true });
}
