# AIO Mapper (Next.js)

Production-ready Next.js (App Router) starter for a SaaS dashboard with API routes.

## Environment Variables

This app intentionally crashes with a clear error if any required env var is missing.

For local development, create `.env.local` (do not commit) using `.env.example` as a template:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL`

In production, set the same variables in the Vercel dashboard (no `.env` reliance in prod).

## Scripts

- `npm run dev` — start dev server
- `npm run build` — build for production
- `npm run start` — start production server
- `npm run lint` — run ESLint
