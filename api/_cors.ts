import type { VercelResponse } from '@vercel/node';

const ALLOWED_ORIGINS = [
  'https://aio-mapper.vercel.app',
  'https://aio-mapper.replit.app',
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : '',
].filter(Boolean);

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'development';

export function setCorsHeaders(res: VercelResponse, origin: string | string[] | undefined): void {
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Normalize origin - Vercel can send it as an array
  const originValue = Array.isArray(origin) ? origin[0] : origin;
  
  if (!originValue) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return;
  }
  
  if (isDevelopment && originValue.includes('localhost')) {
    res.setHeader('Access-Control-Allow-Origin', originValue);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return;
  }
  
  if (ALLOWED_ORIGINS.includes(originValue) || originValue.endsWith('.replit.dev') || originValue.endsWith('.replit.app') || originValue.endsWith('.vercel.app')) {
    res.setHeader('Access-Control-Allow-Origin', originValue);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
}
