# Supabase Auth setup notes (internal)

This project uses Supabase Auth with cookie-based sessions via `@supabase/ssr`.

## Required env vars

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-only; used for admin operations)

## Required Supabase settings

In Supabase Dashboard:

1) Authentication → Providers
- Enable **Email** provider (email + password).
- Confirm whether you want **email confirmations** enabled (recommended for production).

2) Authentication → URL Configuration
- **Site URL**
  - Local dev: `http://localhost:3000`
  - Production: `https://<your-domain>`
- **Redirect URLs** (allow-list)
  - `http://localhost:3000/auth/callback`
  - `http://localhost:3000/auth/callback?next=/dashboard`
  - `https://<your-domain>/auth/callback`
  - `https://<your-domain>/auth/callback?next=/dashboard`

This app uses `emailRedirectTo` during signup:
- `/<origin>/auth/callback?next=/dashboard`

So the callback URL must be allow-listed.

## App behavior

- Signup page: `app/(marketing)/account/page.tsx`
- Login page: `app/(marketing)/login/page.tsx`
- Auth callback: `app/auth/callback/route.ts`
- Session refresh + dashboard guard: `middleware.ts`

In demo mode (`?demo=true`), `/dashboard` routes remain accessible without auth.

