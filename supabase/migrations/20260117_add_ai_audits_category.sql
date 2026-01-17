-- Add category metadata to audits for consistent dashboard display.
alter table public.ai_audits
  add column if not exists category text null;

