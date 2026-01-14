-- Canonical schema for AIO Mapper (Phase 1)
-- Note: Enable pgcrypto for gen_random_uuid() if not already enabled.
--   create extension if not exists "pgcrypto";

create table if not exists public.ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  intent text not null,
  prompt_template text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone null default now()
);

create table if not exists public.ai_prompt_runs (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid null,
  prompt_id uuid null references public.ai_prompt_templates (id) on delete set null,
  brand_name text not null,
  model text not null,
  raw_response text not null,
  executed_at timestamp with time zone null default now()
);

create table if not exists public.ai_brand_presence (
  id uuid primary key default gen_random_uuid(),
  prompt_run_id uuid null references public.ai_prompt_runs (id) on delete set null,
  brand_detected boolean not null,
  mention_type text null,
  citation_present boolean not null,
  confidence numeric null,
  created_at timestamp with time zone null default now()
);

-- Optional (Phase 1.5): citations detected in model output
create table if not exists public.ai_citations (
  id uuid primary key default gen_random_uuid(),
  prompt_run_id uuid null references public.ai_prompt_runs (id) on delete set null,
  source_url text not null,
  source_type text null,
  created_at timestamp with time zone null default now()
);
