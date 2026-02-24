# Jarvis Mission Control

Real-time operational dashboard for monitoring Jarvis (AI COO) activity. Dark theme, mobile-first, glanceable.

## Features
- **Pipeline Status** — Task lanes: Queued → In Progress → Completed / Failed
- **Metrics Bar** — Tasks shipped, active runs, open failures, decisions
- **Activity Timeline** — Recent events across decisions, tasks, and runs
- **Decisions Log** — Expandable decision cards with context/outcome
- **Failures Panel** — Unresolved failures highlighted in red
- **Truth Objects** — Grouped key-value knowledge base
- Auto-refreshes every 30 seconds

## Tech Stack
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase for data (server-side queries via API route)

## Setup

1. Clone and install:
   ```bash
   npm install
   ```

2. Copy env vars:
   ```bash
   cp .env.example .env.local
   ```

3. Fill in your Supabase URL and service key in `.env.local`

4. Run dev server:
   ```bash
   npm run dev
   ```

## Deploy to Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
4. Deploy

## Architecture
- `/api/dashboard` — Server-side API route fetches all Supabase tables
- Client polls the API every 30s
- Service key stays server-side (never exposed to browser)
