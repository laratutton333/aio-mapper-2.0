-- ============================================
-- AIO Mapper - Supabase Database Setup Script
-- ============================================
-- Run this script in your Supabase SQL Editor (Database > SQL Editor)
-- This creates all tables, indexes, and Row Level Security policies

-- ============================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- 2. AUTH TABLES (Required for Replit Auth)
-- ============================================

-- Sessions table for express-session
CREATE TABLE IF NOT EXISTS sessions (
  sid VARCHAR PRIMARY KEY,
  sess JSONB NOT NULL,
  expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_session_expire ON sessions(expire);

-- Users table with Stripe billing fields
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email VARCHAR UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  profile_image_url VARCHAR,
  stripe_customer_id VARCHAR,
  stripe_subscription_id VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- 3. CORE APPLICATION TABLES
-- ============================================

-- Brands - the primary brand being tracked
CREATE TABLE IF NOT EXISTS brands (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  primary_domain TEXT,
  brand_variants TEXT[],
  owner_user_id VARCHAR REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_brands_owner ON brands(owner_user_id);

-- Audits - visibility audit sessions
CREATE TABLE IF NOT EXISTS audits (
  id VARCHAR(36) PRIMARY KEY,
  brand_id VARCHAR(36) NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  audit_name TEXT NOT NULL,
  target_category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending'
);

CREATE INDEX IF NOT EXISTS idx_audits_brand ON audits(brand_id);

-- Competitors - manually entered competitors
CREATE TABLE IF NOT EXISTS competitors (
  id VARCHAR(36) PRIMARY KEY,
  audit_id VARCHAR(36) NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT
);

CREATE INDEX IF NOT EXISTS idx_competitors_audit ON competitors(audit_id);

-- Prompt templates - library of prompts by intent
CREATE TABLE IF NOT EXISTS prompt_templates (
  id VARCHAR(36) PRIMARY KEY,
  name TEXT NOT NULL,
  intent TEXT NOT NULL,
  template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0
);

-- Prompt runs - individual prompt executions
CREATE TABLE IF NOT EXISTS prompt_runs (
  id VARCHAR(36) PRIMARY KEY,
  audit_id VARCHAR(36) NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  prompt_template_id VARCHAR(36) NOT NULL REFERENCES prompt_templates(id),
  llm_model TEXT NOT NULL DEFAULT 'gpt-4',
  run_status TEXT NOT NULL DEFAULT 'pending',
  executed_at TIMESTAMP,
  raw_answer TEXT,
  prompt_text TEXT
);

CREATE INDEX IF NOT EXISTS idx_prompt_runs_audit ON prompt_runs(audit_id);
CREATE INDEX IF NOT EXISTS idx_prompt_runs_template ON prompt_runs(prompt_template_id);

-- Prompt mentions - detected brand mentions
CREATE TABLE IF NOT EXISTS prompt_mentions (
  id VARCHAR(36) PRIMARY KEY,
  prompt_run_id VARCHAR(36) NOT NULL REFERENCES prompt_runs(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  match_type TEXT NOT NULL,
  mention_position INTEGER,
  confidence REAL DEFAULT 0,
  is_cited BOOLEAN DEFAULT false,
  is_target_brand BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_prompt_mentions_run ON prompt_mentions(prompt_run_id);

-- Citations - source URLs from AI answers
CREATE TABLE IF NOT EXISTS citations (
  id VARCHAR(36) PRIMARY KEY,
  prompt_run_id VARCHAR(36) NOT NULL REFERENCES prompt_runs(id) ON DELETE CASCADE,
  source_url TEXT NOT NULL,
  source_type TEXT NOT NULL,
  authority_score REAL DEFAULT 0,
  source_domain TEXT
);

CREATE INDEX IF NOT EXISTS idx_citations_run ON citations(prompt_run_id);

-- Prompt metrics - calculated scores per run
CREATE TABLE IF NOT EXISTS prompt_metrics (
  id VARCHAR(36) PRIMARY KEY,
  prompt_run_id VARCHAR(36) NOT NULL REFERENCES prompt_runs(id) ON DELETE CASCADE,
  presence_rate REAL DEFAULT 0,
  recommendation_rate REAL DEFAULT 0,
  citation_rate REAL DEFAULT 0,
  authority_diversity REAL DEFAULT 0,
  composite_score REAL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_prompt_metrics_run ON prompt_metrics(prompt_run_id);

-- Recommendations - actionable insights
CREATE TABLE IF NOT EXISTS recommendations (
  id VARCHAR(36) PRIMARY KEY,
  audit_id VARCHAR(36) NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL,
  evidence_prompt_run_id VARCHAR(36) REFERENCES prompt_runs(id),
  impact TEXT NOT NULL,
  effort TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  rationale TEXT
);

CREATE INDEX IF NOT EXISTS idx_recommendations_audit ON recommendations(audit_id);

-- Timeline snapshots - historical KPI data
CREATE TABLE IF NOT EXISTS timeline_snapshots (
  id VARCHAR(36) PRIMARY KEY,
  audit_id VARCHAR(36) NOT NULL REFERENCES audits(id) ON DELETE CASCADE,
  captured_at TIMESTAMP DEFAULT NOW() NOT NULL,
  kpi_data JSONB
);

CREATE INDEX IF NOT EXISTS idx_timeline_snapshots_audit ON timeline_snapshots(audit_id);

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_mentions ENABLE ROW LEVEL SECURITY;
ALTER TABLE citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_snapshots ENABLE ROW LEVEL SECURITY;

-- Sessions: Allow all (managed by express-session)
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "sessions_allow_all" ON sessions FOR ALL USING (true);

-- Prompt templates: Public read (shared library)
ALTER TABLE prompt_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "prompt_templates_public_read" ON prompt_templates FOR SELECT USING (true);

-- Users: Users can only access their own data
CREATE POLICY "users_self_access" ON users FOR ALL 
  USING (id = current_setting('app.current_user_id', true));

-- Brands: Users can only access their own brands
CREATE POLICY "brands_owner_access" ON brands FOR ALL 
  USING (owner_user_id = current_setting('app.current_user_id', true));

-- Audits: Access through brand ownership
CREATE POLICY "audits_owner_access" ON audits FOR ALL 
  USING (
    brand_id IN (
      SELECT id FROM brands WHERE owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Competitors: Access through audit -> brand ownership
CREATE POLICY "competitors_owner_access" ON competitors FOR ALL 
  USING (
    audit_id IN (
      SELECT a.id FROM audits a
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Prompt runs: Access through audit -> brand ownership
CREATE POLICY "prompt_runs_owner_access" ON prompt_runs FOR ALL 
  USING (
    audit_id IN (
      SELECT a.id FROM audits a
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Prompt mentions: Access through prompt run
CREATE POLICY "prompt_mentions_owner_access" ON prompt_mentions FOR ALL 
  USING (
    prompt_run_id IN (
      SELECT pr.id FROM prompt_runs pr
      JOIN audits a ON pr.audit_id = a.id
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Citations: Access through prompt run
CREATE POLICY "citations_owner_access" ON citations FOR ALL 
  USING (
    prompt_run_id IN (
      SELECT pr.id FROM prompt_runs pr
      JOIN audits a ON pr.audit_id = a.id
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Prompt metrics: Access through prompt run
CREATE POLICY "prompt_metrics_owner_access" ON prompt_metrics FOR ALL 
  USING (
    prompt_run_id IN (
      SELECT pr.id FROM prompt_runs pr
      JOIN audits a ON pr.audit_id = a.id
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Recommendations: Access through audit
CREATE POLICY "recommendations_owner_access" ON recommendations FOR ALL 
  USING (
    audit_id IN (
      SELECT a.id FROM audits a
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- Timeline snapshots: Access through audit
CREATE POLICY "timeline_snapshots_owner_access" ON timeline_snapshots FOR ALL 
  USING (
    audit_id IN (
      SELECT a.id FROM audits a
      JOIN brands b ON a.brand_id = b.id
      WHERE b.owner_user_id = current_setting('app.current_user_id', true)
    )
  );

-- ============================================
-- 5. SERVICE ROLE BYPASS (for server-side operations)
-- ============================================
-- Note: The service_role in Supabase bypasses RLS by default.
-- Your backend uses the service role connection string, so
-- server-side operations (like Stripe webhooks) work without
-- needing to set app.current_user_id.

-- ============================================
-- 6. HELPER FUNCTION TO SET CURRENT USER
-- ============================================
-- Call this at the start of each authenticated request if using RLS with app user
CREATE OR REPLACE FUNCTION set_current_user_id(user_id TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.current_user_id', user_id, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- STRIPE TABLES (auto-managed by stripe-replit-sync)
-- ============================================
-- Note: The following tables are automatically created and managed
-- by the stripe-replit-sync package. You don't need to create them:
-- - stripe.products
-- - stripe.prices  
-- - stripe.customers
-- - stripe.subscriptions
-- These live in a separate 'stripe' schema.

-- ============================================
-- DONE! Your Supabase database is ready.
-- ============================================
