import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setCorsHeaders } from './_cors';

function getProducts() {
  return [
    {
      id: "prod_starter",
      name: "Starter",
      description: "Perfect for individuals getting started with AI visibility tracking",
      active: true,
      metadata: { tier: "starter" },
      prices: [
        { id: "price_starter_free", unit_amount: 0, currency: "usd", recurring: { interval: "month" }, active: true, metadata: {} }
      ]
    },
    {
      id: "prod_pro",
      name: "Pro",
      description: "For growing teams that need advanced analytics and more prompts",
      active: true,
      metadata: { tier: "pro" },
      prices: [
        { id: "price_pro_monthly", unit_amount: 4900, currency: "usd", recurring: { interval: "month" }, active: true, metadata: {} },
        { id: "price_pro_yearly", unit_amount: 47000, currency: "usd", recurring: { interval: "year" }, active: true, metadata: {} }
      ]
    },
    {
      id: "prod_enterprise",
      name: "Enterprise",
      description: "For large organizations requiring unlimited access and premium support",
      active: true,
      metadata: { tier: "enterprise" },
      prices: [
        { id: "price_enterprise_monthly", unit_amount: 19900, currency: "usd", recurring: { interval: "month" }, active: true, metadata: {} },
        { id: "price_enterprise_yearly", unit_amount: 199000, currency: "usd", recurring: { interval: "year" }, active: true, metadata: {} }
      ]
    }
  ];
}

function getSubscription() {
  return {
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
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res, req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = req.query.action as string;

  switch (action) {
    case 'products':
      return res.status(200).json({ data: getProducts() });
    case 'subscription':
      return res.status(200).json({ subscription: getSubscription() });
    case 'publishable-key':
      return res.status(200).json({ 
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || "pk_test_demo" 
      });
    default:
      return res.status(200).json({ data: getProducts() });
  }
}
