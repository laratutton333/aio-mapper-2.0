-- ============================================================
-- AIO Mapper canonical schema (Production-ready)
-- Safe additive migration (idempotent)
-- Ownership-scoped RLS
-- ============================================================

create extension if not exists "pgcrypto";

-- ============================================================
-- PROMPT TEMPLATES (GLOBAL, READ-ONLY)
-- ============================================================

create table if not exists public.ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  intent text not null,
  prompt_template text not null,
  is_active boolean not null default true,
  created_at timestamp with time zone default now()
);

create index if not exists ai_prompt_templates_is_active_idx
  on public.ai_prompt_templates (is_active);

alter table public.ai_prompt_templates enable row level security;

revoke all on table public.ai_prompt_templates from anon, authenticated;
grant select on table public.ai_prompt_templates to authenticated;

drop policy if exists "ai_prompt_templates_read_authenticated"
  on public.ai_prompt_templates;

create policy "ai_prompt_templates_read_authenticated"
  on public.ai_prompt_templates
  for select
  to authenticated
  using (true);

-- ============================================================
-- AUDITS (USER-OWNED)
-- ============================================================

create table if not exists public.ai_audits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  brand_name text not null,
  primary_domain text null,
  status text not null default 'completed',
  created_at timestamp with time zone default now(),
  constraint ai_audits_user_fkey
    foreign key (user_id)
    references auth.users (id)
    on delete cascade
);

alter table public.ai_audits
  drop constraint if exists ai_audits_status_allowed;

alter table public.ai_audits
  add constraint ai_audits_status_allowed
  check (status in ('running', 'completed', 'failed'));

create index if not exists ai_audits_user_id_created_at_idx
  on public.ai_audits (user_id, created_at desc);

alter table public.ai_audits enable row level security;

revoke all on table public.ai_audits from anon, authenticated;
grant select on table public.ai_audits to authenticated;

drop policy if exists "ai_audits_read_own"
  on public.ai_audits;

create policy "ai_audits_read_own"
  on public.ai_audits
  for select
  to authenticated
  using (user_id = auth.uid());

-- ============================================================
-- PROMPT RUNS (SCOPED VIA AUDITS)
-- ============================================================

create table if not exists public.ai_prompt_runs (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references public.ai_audits (id) on delete cascade,
  prompt_id uuid references public.ai_prompt_templates (id) on delete set null,
  brand_name text not null,
  model text not null,
  raw_response text not null,
  executed_at timestamp with time zone default now()
);

create index if not exists ai_prompt_runs_audit_id_idx
  on public.ai_prompt_runs (audit_id);

create index if not exists ai_prompt_runs_prompt_id_executed_at_idx
  on public.ai_prompt_runs (prompt_id, executed_at desc);

alter table public.ai_prompt_runs enable row level security;

revoke all on table public.ai_prompt_runs from anon, authenticated;
grant select on table public.ai_prompt_runs to authenticated;

drop policy if exists "ai_prompt_runs_read_own"
  on public.ai_prompt_runs;

create policy "ai_prompt_runs_read_own"
  on public.ai_prompt_runs
  for select
  to authenticated
  using (
    audit_id in (
      select id from public.ai_audits
      where user_id = auth.uid()
    )
  );

-- ============================================================
-- PROMPT ANALYSIS (SCOPED VIA PROMPT RUNS)
-- ============================================================

create table if not exists public.ai_prompt_analysis (
  id uuid primary key default gen_random_uuid(),
  prompt_run_id uuid references public.ai_prompt_runs (id) on delete cascade,
  analysis jsonb not null,
  created_at timestamp with time zone default now()
);

create index if not exists ai_prompt_analysis_prompt_run_id_idx
  on public.ai_prompt_analysis (prompt_run_id);

alter table public.ai_prompt_analysis enable row level security;

revoke all on table public.ai_prompt_analysis from anon, authenticated;
grant select on table public.ai_prompt_analysis to authenticated;

drop policy if exists "ai_prompt_analysis_read_own"
  on public.ai_prompt_analysis;

create policy "ai_prompt_analysis_read_own"
  on public.ai_prompt_analysis
  for select
  to authenticated
  using (
    prompt_run_id in (
      select pr.id
      from public.ai_prompt_runs pr
      join public.ai_audits a on a.id = pr.audit_id
      where a.user_id = auth.uid()
    )
  );

-- ============================================================
-- BRAND PRESENCE (SCOPED VIA PROMPT RUNS)
-- ============================================================

create table if not exists public.ai_brand_presence (
  id uuid primary key default gen_random_uuid(),
  prompt_run_id uuid references public.ai_prompt_runs (id) on delete cascade,
  brand_detected boolean not null,
  mention_type text null,
  citation_present boolean not null,
  confidence numeric null,
  reasoning text null,
  created_at timestamp with time zone default now()
);

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

create index if not exists ai_brand_presence_prompt_run_id_created_at_idx
  on public.ai_brand_presence (prompt_run_id, created_at desc);

alter table public.ai_brand_presence enable row level security;

revoke all on table public.ai_brand_presence from anon, authenticated;
grant select on table public.ai_brand_presence to authenticated;

drop policy if exists "ai_brand_presence_read_own"
  on public.ai_brand_presence;

create policy "ai_brand_presence_read_own"
  on public.ai_brand_presence
  for select
  to authenticated
  using (
    prompt_run_id in (
      select pr.id
      from public.ai_prompt_runs pr
      join public.ai_audits a on a.id = pr.audit_id
      where a.user_id = auth.uid()
    )
  );

-- ============================================================
-- CITATIONS (SCOPED VIA PROMPT RUNS)
-- ============================================================

create table if not exists public.ai_citations (
  id uuid primary key default gen_random_uuid(),
  prompt_run_id uuid references public.ai_prompt_runs (id) on delete cascade,
  source_url text not null,
  source_type text null,
  authority_score numeric null,
  created_at timestamp with time zone default now()
);

alter table public.ai_citations
  drop constraint if exists ai_citations_source_type_allowed;

alter table public.ai_citations
  add constraint ai_citations_source_type_allowed
  check (
    source_type is null
    or source_type in ('brand_owned', 'wikipedia', 'government', 'publisher', 'competitor', 'unknown')
  );

alter table public.ai_citations
  drop constraint if exists ai_citations_authority_score_range;

alter table public.ai_citations
  add constraint ai_citations_authority_score_range
  check (
    authority_score is null
    or (authority_score >= 0 and authority_score <= 1)
  );

create index if not exists ai_citations_prompt_run_id_idx
  on public.ai_citations (prompt_run_id);

alter table public.ai_citations enable row level security;

revoke all on table public.ai_citations from anon, authenticated;
grant select on table public.ai_citations to authenticated;

drop policy if exists "ai_citations_read_own"
  on public.ai_citations;

create policy "ai_citations_read_own"
  on public.ai_citations
  for select
  to authenticated
  using (
    prompt_run_id in (
      select pr.id
      from public.ai_prompt_runs pr
      join public.ai_audits a on a.id = pr.audit_id
      where a.user_id = auth.uid()
    )
  );

-- ============================================================
-- RECOMMENDATIONS (SCOPED VIA AUDITS)
-- ============================================================

create table if not exists public.ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid references public.ai_audits (id) on delete cascade,
  category text not null,
  title text not null,
  description text not null,
  why_it_matters text not null,
  impact text not null,
  effort text not null,
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);

alter table public.ai_recommendations
  drop constraint if exists ai_recommendations_category_allowed;

alter table public.ai_recommendations
  add constraint ai_recommendations_category_allowed
  check (category in ('content', 'authority', 'structure'));

alter table public.ai_recommendations
  drop constraint if exists ai_recommendations_impact_allowed;

alter table public.ai_recommendations
  add constraint ai_recommendations_impact_allowed
  check (impact in ('high', 'medium', 'low'));

alter table public.ai_recommendations
  drop constraint if exists ai_recommendations_effort_allowed;

alter table public.ai_recommendations
  add constraint ai_recommendations_effort_allowed
  check (effort in ('high', 'medium', 'low'));

alter table public.ai_recommendations
  drop constraint if exists ai_recommendations_status_allowed;

alter table public.ai_recommendations
  add constraint ai_recommendations_status_allowed
  check (status in ('pending', 'in_progress', 'completed'));

create index if not exists ai_recommendations_audit_id_idx
  on public.ai_recommendations (audit_id);

alter table public.ai_recommendations enable row level security;

revoke all on table public.ai_recommendations from anon, authenticated;
grant select on table public.ai_recommendations to authenticated;

drop policy if exists "ai_recommendations_read_own"
  on public.ai_recommendations;

create policy "ai_recommendations_read_own"
  on public.ai_recommendations
  for select
  to authenticated
  using (
    audit_id in (
      select id from public.ai_audits
      where user_id = auth.uid()
    )
  );
