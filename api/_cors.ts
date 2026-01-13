import type { VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://aio-mapper.vercel.app',
  'https://aio-mapper.replit.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : '',
].filter(Boolean);

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';

export function setCorsHeaders(res: VercelResponse, origin: string | undefined): void {
  if (!origin) {
    return;
  }
  
  if (isDevelopment && origin.includes('localhost')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return;
  }
  
  if (ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.replit.dev') || origin.endsWith('.replit.app') || origin.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}
