-- =============================================================
-- OneTrack — Comprehensive Database Schema & Migrations
-- Config-Driven Architecture with Supabase Postgres & RLS
-- =============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------
-- 1. PROFILES TABLE
-- Synced with Clerk authentication via webhook or JWT sync
-- -------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key default gen_random_uuid(),
    clerk_user_id text unique not null,
    email text,
    display_name text,
    role text not null default 'user' check (role in ('admin', 'user')),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_clerk_id on public.profiles (clerk_user_id);
create index if not exists idx_profiles_role on public.profiles (role);

-- -------------------------------------------------------------
-- 2. APPLICATION STATUSES (Admin-Configurable Pipeline)
-- -------------------------------------------------------------
create table if not exists public.application_statuses (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    label text not null,
    color text not null default '#64748b',
    sort_order int not null default 0,
    is_terminal boolean not null default false,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_application_statuses_sort on public.application_statuses (sort_order asc);
create index if not exists idx_application_statuses_active on public.application_statuses (is_active);

-- -------------------------------------------------------------
-- 3. APPLICATION SOURCES (Admin-Configurable Channels)
-- -------------------------------------------------------------
create table if not exists public.application_sources (
    id uuid primary key default gen_random_uuid(),
    key text unique not null,
    label text not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_application_sources_active on public.application_sources (is_active);

-- -------------------------------------------------------------
-- 4. APPLICATIONS TABLE
-- Main table for logged user applications
-- -------------------------------------------------------------
create table if not exists public.applications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    company_name text not null,
    role_title text not null,
    status_id uuid not null references public.application_statuses(id) on delete restrict,
    source_id uuid references public.application_sources(id) on delete set null,
    date_applied date not null default current_date,
    job_url text,
    location text,
    salary_range text,
    notes text,
    next_follow_up_date date,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists idx_applications_user_id on public.applications (user_id);
create index if not exists idx_applications_date_applied on public.applications (date_applied desc);
create index if not exists idx_applications_status_id on public.applications (status_id);
create index if not exists idx_applications_source_id on public.applications (source_id);
create index if not exists idx_applications_company on public.applications (company_name);

-- -------------------------------------------------------------
-- 5. APP SETTINGS (Key-Value Config Table)
-- -------------------------------------------------------------
create table if not exists public.app_settings (
    key text primary key,
    value jsonb not null default '{}'::jsonb,
    updated_by uuid references public.profiles(id) on delete set null,
    updated_at timestamptz not null default now()
);

-- -------------------------------------------------------------
-- 6. ADMIN AGGREGATE STATS VIEW
-- Provides platform-wide analytics while keeping user notes private
-- -------------------------------------------------------------
create or replace view public.admin_aggregate_stats as
select
    count(distinct a.id) as total_applications,
    count(distinct a.user_id) as active_applicants,
    count(distinct p.id) as total_registered_users,
    count(distinct case when st.is_terminal = false then a.id end) as active_pipeline_count,
    count(distinct case when st.key = 'offer' then a.id end) as total_offers_count,
    count(distinct case when st.key in ('interview_scheduled', 'interview_completed', 'offer') then a.id end) as interview_stage_count
from public.profiles p
left join public.applications a on a.user_id = p.id
left join public.application_statuses st on a.status_id = st.id;

-- -------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.application_statuses enable row level security;
alter table public.application_sources enable row level security;
alter table public.applications enable row level security;
alter table public.app_settings enable row level security;

-- Helper function to check if current user is admin
create or replace function public.is_admin()
returns boolean language sql security definer as $$
    select exists (
        select 1 from public.profiles
        where clerk_user_id = (coalesce(auth.jwt() ->> 'sub', (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')))
        and role = 'admin'
        and is_active = true
    );
$$;

-- Helper function to get current profile ID
create or replace function public.current_profile_id()
returns uuid language sql security definer as $$
    select id from public.profiles
    where clerk_user_id = (coalesce(auth.jwt() ->> 'sub', (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')))
    and is_active = true
    limit 1;
$$;

-- Profiles Policies
create policy "Users can read own profile"
    on public.profiles for select
    using (clerk_user_id = (coalesce(auth.jwt() ->> 'sub', (current_setting('request.jwt.claims', true)::jsonb ->> 'sub'))) or public.is_admin());

create policy "Users can update own basic profile"
    on public.profiles for update
    using (clerk_user_id = (coalesce(auth.jwt() ->> 'sub', (current_setting('request.jwt.claims', true)::jsonb ->> 'sub'))))
    with check (clerk_user_id = (coalesce(auth.jwt() ->> 'sub', (current_setting('request.jwt.claims', true)::jsonb ->> 'sub'))));

create policy "Admins can insert and update profiles"
    on public.profiles for all
    using (public.is_admin());

-- Application Statuses Policies
create policy "Anyone authenticated can view active statuses"
    on public.application_statuses for select
    using (is_active = true or public.is_admin());

create policy "Only Admins can insert/update/delete statuses"
    on public.application_statuses for all
    using (public.is_admin());

-- Application Sources Policies
create policy "Anyone authenticated can view active sources"
    on public.application_sources for select
    using (is_active = true or public.is_admin());

create policy "Only Admins can insert/update/delete sources"
    on public.application_sources for all
    using (public.is_admin());

-- Applications Policies (Strict privacy per user)
create policy "Users can view own applications"
    on public.applications for select
    using (user_id = public.current_profile_id());

create policy "Users can insert own applications"
    on public.applications for insert
    with check (user_id = public.current_profile_id());

create policy "Users can update own applications"
    on public.applications for update
    using (user_id = public.current_profile_id())
    with check (user_id = public.current_profile_id());

create policy "Users can delete own applications"
    on public.applications for delete
    using (user_id = public.current_profile_id());

-- App Settings Policies
create policy "Anyone can read app settings"
    on public.app_settings for select
    using (true);

create policy "Admins can manage app settings"
    on public.app_settings for all
    using (public.is_admin());

-- -------------------------------------------------------------
-- 8. SEED DEFAULT DATA
-- -------------------------------------------------------------
-- Seed Statuses
insert into public.application_statuses (key, label, color, sort_order, is_terminal, is_active)
values
    ('applied', 'Applied', '#3b82f6', 10, false, true),
    ('oa', 'Online Assessment', '#f59e0b', 20, false, true),
    ('interview_scheduled', 'Interview Scheduled', '#8b5cf6', 30, false, true),
    ('interview_completed', 'Interview Completed', '#06b6d4', 40, false, true),
    ('offer', 'Offer', '#10b981', 50, true, true),
    ('rejected', 'Rejected', '#ef4444', 60, true, true),
    ('withdrawn', 'Withdrawn', '#64748b', 70, true, true),
    ('ghosted', 'Ghosted', '#94a3b8', 80, true, true)
on conflict (key) do update set
    label = excluded.label,
    color = excluded.color,
    sort_order = excluded.sort_order,
    is_terminal = excluded.is_terminal,
    is_active = excluded.is_active;

-- Seed Sources
insert into public.application_sources (key, label, is_active)
values
    ('linkedin', 'LinkedIn', true),
    ('referral', 'Referral', true),
    ('company_website', 'Company Website', true),
    ('naukri', 'Naukri', true),
    ('internshala', 'Internshala', true),
    ('campus', 'Campus Placement', true),
    ('wellfound', 'Wellfound / AngelList', true),
    ('other', 'Other', true)
on conflict (key) do update set
    label = excluded.label,
    is_active = excluded.is_active;

-- Seed Default Settings
insert into public.app_settings (key, value)
values
    ('weekly_goal', '{"target": 5}'::jsonb),
    ('reminders_enabled', '{"enabled": true, "default_days": 14}'::jsonb)
on conflict (key) do nothing;
