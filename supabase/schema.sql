-- Canonical schema for AIO Mapper (Phase 1)
-- Includes Row Level Security (RLS) policies aligned with Supabase Auth.

create extension if not exists "pgcrypto";

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

-- --------
-- Constraints (keep outputs inspectable and bounded)
-- --------

alter table public.ai_brand_presence
  drop constraint if exists ai_brand_presence_confidence_range;
alter table public.ai_brand_presence
  add constraint ai_brand_presence_confidence_range
  check (confidence is null or (confidence >= 0 and confidence <= 1));

alter table public.ai_brand_presence
  drop constraint if exists ai_brand_presence_mention_type_allowed;
alter table public.ai_brand_presence
  add constraint ai_brand_presence_mention_type_allowed
  check (
    mention_type is null
    or mention_type in ('primary', 'secondary', 'implied', 'none')
  );

alter table public.ai_citations
  drop constraint if exists ai_citations_source_type_allowed;
alter table public.ai_citations
  add constraint ai_citations_source_type_allowed
  check (
    source_type is null
    or source_type in ('brand_owned', 'wikipedia', 'government', 'publisher', 'unknown')
  );

-- --------
-- Indexes (serverless-friendly query performance)
-- --------

create index if not exists ai_prompt_templates_is_active_idx
  on public.ai_prompt_templates (is_active);

create index if not exists ai_prompt_runs_audit_id_idx
  on public.ai_prompt_runs (audit_id);

create index if not exists ai_prompt_runs_prompt_id_executed_at_idx
  on public.ai_prompt_runs (prompt_id, executed_at desc);

create index if not exists ai_prompt_runs_brand_name_executed_at_idx
  on public.ai_prompt_runs (brand_name, executed_at desc);

create index if not exists ai_brand_presence_prompt_run_id_created_at_idx
  on public.ai_brand_presence (prompt_run_id, created_at desc);

create index if not exists ai_citations_prompt_run_id_idx
  on public.ai_citations (prompt_run_id);

create index if not exists ai_citations_source_url_idx
  on public.ai_citations (source_url);

-- --------
-- Grants + RLS policies (Supabase Auth)
-- --------
-- Design:
-- - Enable RLS on all tables.
-- - Allow read access only to authenticated users (via Supabase Auth).
-- - Do not allow client-side writes; server uses service role key (bypasses RLS).

alter table public.ai_prompt_templates enable row level security;
alter table public.ai_prompt_runs enable row level security;
alter table public.ai_brand_presence enable row level security;
alter table public.ai_citations enable row level security;

revoke all on table public.ai_prompt_templates from anon, authenticated;
revoke all on table public.ai_prompt_runs from anon, authenticated;
revoke all on table public.ai_brand_presence from anon, authenticated;
revoke all on table public.ai_citations from anon, authenticated;

grant select on table public.ai_prompt_templates to authenticated;
grant select on table public.ai_prompt_runs to authenticated;
grant select on table public.ai_brand_presence to authenticated;
grant select on table public.ai_citations to authenticated;

drop policy if exists "ai_prompt_templates_read_authenticated" on public.ai_prompt_templates;
create policy "ai_prompt_templates_read_authenticated"
  on public.ai_prompt_templates
  for select
  to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "ai_prompt_runs_read_authenticated" on public.ai_prompt_runs;
create policy "ai_prompt_runs_read_authenticated"
  on public.ai_prompt_runs
  for select
  to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "ai_brand_presence_read_authenticated" on public.ai_brand_presence;
create policy "ai_brand_presence_read_authenticated"
  on public.ai_brand_presence
  for select
  to authenticated
  using (auth.role() = 'authenticated');

drop policy if exists "ai_citations_read_authenticated" on public.ai_citations;
create policy "ai_citations_read_authenticated"
  on public.ai_citations
  for select
  to authenticated
  using (auth.role() = 'authenticated');
