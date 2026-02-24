# Jarvis Mission Control — Dashboard Spec

## Purpose
Real-time operational dashboard for Sunny to track Jarvis (AI COO) activity.
Glanceable on mobile. Pulls live data from Supabase.

## Supabase Schema (existing tables)

### decisions
- id (uuid), title (text), context (text), outcome (text), status (text: decided/resolved/pending/rejected), created_at, updated_at

### tasks
- id (uuid), title (text), description (text), status (text: queued/in_progress/completed/failed/blocked), priority (text: P0/P1/P2/P3), project_id (text), lane_id (text), assigned_to (text), created_at, updated_at

### runs
- id (uuid), task_id (uuid), status (text: running/completed/failed/cancelled), started_at, completed_at, evidence (jsonb), cost_usd (numeric), model (text), created_at

### artifacts
- id (uuid), run_id (uuid), task_id (uuid), type (text: pr/screenshot/log/diff), url (text), metadata (jsonb), created_at

### failures
- id (uuid), run_id (uuid), task_id (uuid), failure_type (text), error_message (text), raw_error (text), resolved (boolean), created_at

### truth_objects
- id (uuid), category (text), key (text), value (text), source (text), valid_from, valid_until, created_at, updated_at

## Dashboard Layout (Single Page, Mobile-First)

### Header
- "Jarvis Mission Control" title with subtle glow effect
- Live clock (IST) + "Last synced: X sec ago" indicator
- System health dot (green/yellow/red based on recent failures)

### Section 1: Pipeline Status (top, most prominent)
- Horizontal pipeline showing: Queued → In Progress → Completed / Failed
- Color-coded cards: blue (queued), amber (in progress), green (completed), red (failed), grey (blocked)
- Each card shows task title, priority badge, time elapsed
- Tap to expand details

### Section 2: Recent Activity Timeline
- Vertical timeline of last 20 events (decisions + tasks + runs merged, sorted by time)
- Each entry: icon (by type) + title + status badge + relative time
- Color-coded left border by status

### Section 3: Key Metrics Bar
- Cards showing: Tasks Shipped (count), Active Runs, Open Failures, Decisions Made
- Each with trend indicator (today vs yesterday if data exists)

### Section 4: Decisions Log
- Recent decisions in card format
- Status badge (decided/resolved/pending)
- Expandable context/outcome

### Section 5: Failures & Blockers (if any)
- Only shows if failures exist
- Red-accented cards with failure type, error summary, resolved status

### Section 6: Truth Objects
- Grouped by category
- Key-value display, subtle grid

## Design System
- Background: #0a0a0a
- Surface: #141414
- Card: #1a1a1a with subtle border #2a2a2a
- Text primary: #e8e8e8
- Text secondary: #888888
- Accent green: #22c55e (success/shipped)
- Accent amber: #f59e0b (in progress/warning)
- Accent red: #ef4444 (failed/blocked)
- Accent blue: #3b82f6 (queued/info)
- Accent purple: #a855f7 (decisions)
- Font: Inter (Google Fonts) or system-ui fallback
- Border radius: 12px cards, 6px badges
- Subtle glow on status indicators

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- @supabase/supabase-js for data fetching
- Auto-refresh every 30 seconds
- No auth needed (read-only dashboard, env vars server-side)
- Single page (app/page.tsx + components)

## Environment Variables
- NEXT_PUBLIC_SUPABASE_URL (will be set in Vercel)
- SUPABASE_SERVICE_KEY (server-side only, used in API routes)

## Data Fetching
- Use Next.js API routes (/api/dashboard) that query Supabase server-side with service key
- Client fetches from API route (keeps service key hidden)
- Revalidate on 30s interval via client-side polling

## File Structure
```
app/
  layout.tsx          (root layout, dark theme, Inter font)
  page.tsx            (main dashboard, client component)
  api/
    dashboard/
      route.ts        (GET — fetches all tables, returns merged payload)
components/
  PipelineStatus.tsx  (horizontal pipeline cards)
  ActivityTimeline.tsx (vertical timeline)
  MetricsBar.tsx      (key metrics cards)
  DecisionsLog.tsx    (decisions cards)
  FailuresPanel.tsx   (failures, conditional render)
  TruthObjects.tsx    (grouped key-value)
  StatusBadge.tsx     (reusable badge component)
  Header.tsx          (title + clock + health dot)
```

## Constraints
- Must work on mobile (375px+) — this is primarily a phone dashboard
- No external UI libraries (no shadcn, no MUI) — just Tailwind
- No auth layer for v1
- Read-only — no write operations from dashboard
- Keep it under 15 files total
