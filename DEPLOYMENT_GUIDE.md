# OneTrack — Complete Vercel & Production Deployment Guide

OneTrack is a terminal-grade, config-driven Progressive Web App (PWA) built with **Next.js 14 (App Router)**, **Clerk Authentication**, **Supabase Postgres (with RLS)**, and **Arcjet App-Layer Security**.

---

## 1. Prerequisites & Required Accounts

Before deploying, ensure you have active credentials for:
1. **GitHub / GitLab** (to host your repository)
2. **Vercel** ([vercel.com](https://vercel.com))
3. **Clerk Authentication** ([dashboard.clerk.com](https://dashboard.clerk.com))
4. **Supabase Database** ([supabase.com/dashboard](https://supabase.com/dashboard))
5. *(Optional / Recommended)* **Arcjet Security** ([app.arcjet.com](https://app.arcjet.com))

---

## 2. Supabase Database Setup (One-Click Migration)

1. Open your **Supabase Project Dashboard**.
2. Navigate to **SQL Editor** from the left navigation.
3. Click **New Query**.
4. Copy the complete contents of [`supabase/schema.sql`](supabase/schema.sql) and paste it into the editor.
5. Click **Run** (`⌘ + Enter` / `Ctrl + Enter`).

> **What this does:**
> - Provisions the `profiles`, `application_statuses`, `application_sources`, and `applications` tables.
> - Establishes Row-Level Security (RLS) policies scoped per user.
> - Seeds default stages (`applied`, `oa`, `interview`, `offer`, `rejected`) and channels (`linkedin`, `referral`, `company_website`, etc.).

---

## 3. Clerk Authentication Setup

1. In the **Clerk Dashboard**, select your application (or create a new one).
2. Go to **Paths** under **Configure** and verify:
   - **Sign-in path**: `/sign-in`
   - **Sign-up path**: `/sign-up`
   - **After sign-in path**: `/dashboard`
   - **After sign-up path**: `/dashboard`
3. *(Optional Webhook Sync)*: If you want user accounts auto-provisioned upon registration:
   - Go to **Webhooks** in Clerk.
   - Add endpoint: `https://<YOUR_VERCEL_DOMAIN>/api/webhooks/clerk`
   - Select events: `user.created`, `user.updated`, `user.deleted`.
   - Copy the **Signing Secret** into `CLERK_WEBHOOK_SIGNING_SECRET`.

---

## 4. Deploying to Vercel

### Step 1: Push Code to GitHub
```bash
git add .
git commit -m "feat: complete production-ready onetrack application"
git push origin main
```

### Step 2: Import Project on Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. Framework Preset: **Next.js** (auto-detected).
5. Root Directory: `./`

### Step 3: Configure Environment Variables
In the Vercel **Environment Variables** section, add the following keys:

| Key | Description | Example / Location |
|---|---|---|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Frontend Key | `pk_test_...` (Clerk API Keys) |
| `CLERK_SECRET_KEY` | Clerk Backend Secret | `sk_test_...` (Clerk API Keys) |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Route path | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Route path | `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post-auth redirect | `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post-auth redirect | `/dashboard` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | `https://<id>.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Anon Key | `sb_publishable_...` or `anon key` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role | `eyJ...` (Project Settings → API) |
| `ARCJET_KEY` | *(Optional)* Arcjet Bot/Rate Limit | `ajkey_...` (Arcjet Dashboard) |
| `CLERK_WEBHOOK_SIGNING_SECRET` | *(Optional)* Webhook signature | `whsec_...` |

### Step 4: Click Deploy
Click **Deploy**. Vercel will build the project with Next.js 14 and deploy it across its global Edge network in ~60 seconds.

---

## 5. Post-Deployment Verification Checklist

- [x] **Landing Page**: Navigate to `https://<YOUR_VERCEL_DOMAIN>/` (renders terminal UI instantly).
- [x] **Sign Up & Sign In**: Register a new account at `/sign-up`.
- [x] **Dashboard KPIs**: Verify that zero state displays clean zero metrics with no mock data.
- [x] **Logging Applications**: Click `[Log Application]` or press `N` on the keyboard to log job submissions.
- [x] **Batch Continuous Entry**: Toggle `[continuous batch logging]` to log multiple applications consecutively.
- [x] **Pipeline Updates**: Change stages inline from the directory table or dropdown pills.
- [x] **PWA Install**: Open in Chrome / Safari on mobile or desktop and click "Install OneTrack" to install offline standalone app.
- [x] **CSV Export**: Click `[Export CSV]` on `/applications` to download spreadsheet backups.
