-- ==============================================================================
-- ONETRACK: SUPABASE POSTGRES SCHEMA MIGRATION SCRIPT
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Application Pipeline Statuses Table (Config-Driven)
CREATE TABLE IF NOT EXISTS public.application_statuses (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#64748b',
  sort_order INTEGER NOT NULL DEFAULT 10,
  is_terminal BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Recruitment Sources Table (Config-Driven)
CREATE TABLE IF NOT EXISTS public.application_sources (
  id TEXT PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Applications Table
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  status_id TEXT NOT NULL REFERENCES public.application_statuses(id) ON DELETE RESTRICT,
  source_id TEXT REFERENCES public.application_sources(id) ON DELETE SET NULL,
  date_applied DATE NOT NULL DEFAULT CURRENT_DATE,
  job_url TEXT,
  location TEXT,
  salary_range TEXT,
  notes TEXT,
  next_follow_up_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning fast querying and filtering
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status_id ON public.applications(status_id);
CREATE INDEX IF NOT EXISTS idx_applications_source_id ON public.applications(source_id);
CREATE INDEX IF NOT EXISTS idx_applications_date_applied ON public.applications(date_applied DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_id ON public.profiles(clerk_user_id);

-- 6. Insert Default Config Statuses
INSERT INTO public.application_statuses (id, key, label, color, sort_order, is_terminal, is_active)
VALUES
  ('status-1', 'applied', 'Applied', '#3b82f6', 10, false, true),
  ('status-2', 'oa', 'Online Assessment', '#f59e0b', 20, false, true),
  ('status-3', 'interview_scheduled', 'Interview Scheduled', '#8b5cf6', 30, false, true),
  ('status-4', 'interview_completed', 'Interview Completed', '#06b6d4', 40, false, true),
  ('status-5', 'offer', 'Offer', '#10b981', 50, true, true),
  ('status-6', 'rejected', 'Rejected', '#ef4444', 60, true, true),
  ('status-7', 'withdrawn', 'Withdrawn', '#64748b', 70, true, true),
  ('status-8', 'ghosted', 'Ghosted', '#94a3b8', 80, true, true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  color = EXCLUDED.color,
  sort_order = EXCLUDED.sort_order,
  is_terminal = EXCLUDED.is_terminal,
  is_active = EXCLUDED.is_active;

-- 7. Insert Default Config Sources
INSERT INTO public.application_sources (id, key, label, is_active)
VALUES
  ('source-1', 'linkedin', 'LinkedIn', true),
  ('source-2', 'referral', 'Referral', true),
  ('source-3', 'company_website', 'Company Website', true),
  ('source-4', 'naukri', 'Naukri', true),
  ('source-5', 'internshala', 'Internshala', true),
  ('source-6', 'campus', 'Campus Placement', true),
  ('source-7', 'wellfound', 'Wellfound / AngelList', true),
  ('source-8', 'other', 'Other', true)
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  is_active = EXCLUDED.is_active;

-- 8. Admin Aggregate Stats View
CREATE OR REPLACE VIEW public.admin_aggregate_stats AS
SELECT
  COUNT(a.id) AS total_applications,
  COUNT(DISTINCT a.user_id) AS active_applicants,
  (SELECT COUNT(*) FROM public.profiles) AS total_registered_users,
  COUNT(CASE WHEN s.is_terminal = false THEN 1 END) AS active_pipeline_count,
  COUNT(CASE WHEN s.key = 'offer' THEN 1 END) AS total_offers_count,
  COUNT(CASE WHEN s.key IN ('interview_scheduled', 'interview_completed') THEN 1 END) AS interview_stage_count
FROM public.applications a
LEFT JOIN public.application_statuses s ON a.status_id = s.id;

-- 9. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access on profiles" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Service role full access on statuses" ON public.application_statuses FOR ALL USING (true);
CREATE POLICY "Service role full access on sources" ON public.application_sources FOR ALL USING (true);
CREATE POLICY "Service role full access on applications" ON public.applications FOR ALL USING (true);

-- Allow public read access to active statuses and sources
CREATE POLICY "Public read active statuses" ON public.application_statuses FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active sources" ON public.application_sources FOR SELECT USING (is_active = true);
