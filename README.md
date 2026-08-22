# OneTrack

OneTrack is a terminal-style job application tracker built with Next.js 14, Clerk, Supabase, and Tailwind CSS. It helps you log applications quickly, track interview pipelines, and monitor job-search performance from a focused dashboard, with AI-powered salary comparison and personalized cold outreach/LinkedIn reachout support.

## Features

- Fast job application logging and inline updates
- Config-driven application statuses and source channels
- Dashboard metrics (volume, trends, conversion, and breakdowns)
- AI interview prep, salary comparison, and personalized outreach tooling
- Admin console for users, statuses, sources, and platform stats
- PWA support (installable app + offline behavior)
- CSV export and productivity-oriented workflow

## Tech Stack

- **Framework:** Next.js 14 (App Router), React 18, TypeScript
- **UI:** Tailwind CSS, Radix UI, Lucide Icons
- **Auth:** Clerk
- **Database:** Supabase Postgres (with Row Level Security)
- **Security:** Arcjet (optional but recommended)
- **Validation:** Zod + React Hook Form

## Project Structure

```text
app/                  # Next.js routes (UI + API routes)
components/           # Reusable UI and feature components
lib/                  # Services, validation, Supabase/Clerk/Arcjet helpers
public/               # Static assets, PWA manifest, service worker
supabase/             # Database schema and migrations
```

## Getting Started

### 1) Prerequisites

- Node.js 18+
- npm
- Clerk account
- Supabase project
- (Optional) Arcjet account

### 2) Install Dependencies

```bash
npm install
```

### 3) Configure Environment Variables

Create a `.env.local` file in the repository root and add:

| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Yes | Clerk frontend key |
| `CLERK_SECRET_KEY` | Yes | Clerk backend secret |
| `CLERK_WEBHOOK_SIGNING_SECRET` | Optional | Needed for Clerk webhook sync |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Yes | Usually `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Yes | Usually `/sign-up` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Yes | Usually `/dashboard` |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Yes | Usually `/dashboard` |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (server/admin routes) | Supabase service role key |
| `GEMINI_API_KEY` | Optional | Enables salary market insights |
| `ARCJET_KEY` | Optional | Enables Arcjet protection |
| `ADMIN_EMAILS` | Optional | Comma-separated admin emails |
| `ADMIN_CLERK_USER_IDS` | Optional | Comma-separated admin Clerk IDs |
| `NEXT_PUBLIC_APP_URL` | Recommended | Base app URL (e.g. `http://localhost:3000`) |

You can use `.env.example` as a starting point.

### 4) Set Up the Database

1. Open your Supabase project.
2. Go to **SQL Editor**.
3. Run the SQL in:
   - `supabase/schema.sql`

This creates required tables, default statuses/sources, policies, and seed data.

### 5) Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Available Scripts

- `npm run dev` — start development server
- `npm run build` — build for production
- `npm run start` — run production server
- `npm run lint` — run Next.js lint checks

## Deployment

For full production setup and Vercel deployment instructions, see:

- [`DEPLOYMENT_GUIDE.md`](DEPLOYMENT_GUIDE.md)

## PWA

OneTrack includes:

- `public/manifest.json`
- `public/sw.js`
- install prompt and offline components under `components/pwa/`

## License

This repository does not currently define a license file.
