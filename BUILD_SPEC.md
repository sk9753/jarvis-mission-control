# BUILD SPEC: Projects Kanban Tab

## Objective
Add a "Projects" tab to Mission Control — a Kanban board showing all tasks/projects moving through the pipeline. This is for the business owner (non-technical), not for internal ops.

## Current Codebase
- Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript
- Supabase backend, dark theme (#0a0a0a background, #e8e8e8 text)
- Deployed on Vercel
- Existing page at `/` shows technical dashboard (Overview)
- Supabase `tasks` table columns: id, title, description, status, priority, repo, assigned_to, created_at, updated_at

## What to Build

### 1. Tab Navigation
- Add a tab bar to switch between "Overview" (existing `/`) and "Projects" (`/projects`)
- Tab bar component at top, below the header
- Clean, minimal design matching existing dark theme
- Both tabs should include the existing Header component

### 2. Kanban Board (`/projects` route)
5 columns: **Backlog** → **Planning** → **Building** → **Testing** → **Live**

Status mapping:
- `backlog` → Backlog column
- `planning` → Planning column  
- `building` → Building column
- `testing` → Testing column
- `live` or `deployed` or `completed` → Live column

### 3. Task Cards
Each card shows:
- **Title** (bold, truncated if long)
- **One-line description** (first ~80 chars of description, muted color)
- **Priority badge**: high = red dot/badge, medium = amber, low = green, unset = gray
- **Time in current stage** (e.g., "2d" since updated_at)

Design: Dark cards (#1a1a1a) on slightly different column backgrounds (#111). Rounded corners. Clean spacing.

### 4. Drag and Drop
- Install `@dnd-kit/core` and `@dnd-kit/sortable`
- Drag cards between columns to change status
- On drop: PATCH `/api/tasks/[id]` to update status in Supabase
- Smooth animations, drag overlay showing the card being moved
- Must work on mobile/touch

### 5. Task Detail Panel
- Tap/click a card → slide-out panel from the right (or modal on mobile)
- Shows: title, full description, status, priority, assigned_to, repo, created_at, updated_at
- Close button (X) or click outside to dismiss
- Read-only for v1 (no inline editing yet)

### 6. API Addition
Add `PATCH /api/tasks/[id]/route.ts`:
- Accepts `{ status: string }` in body
- Updates the task in Supabase
- Returns updated task
- Uses SUPABASE_SERVICE_KEY from env

### 7. Standardize Priorities
In display logic, normalize priority values:
- `P1` or `high` → show as High (red)
- `P2` or `medium` → show as Medium (amber)  
- `P3` or `low` → show as Low (green)
- anything else → show as gray

## Design Guidelines
- Match existing dark theme exactly: bg-[#0a0a0a], text-[#e8e8e8], card bg-[#1a1a1a]
- Font: Inter (already loaded)
- Mobile-first: columns scroll horizontally on small screens
- Column headers: uppercase, small, muted text (#888) — same style as existing section headers
- Subtle column borders/backgrounds to differentiate lanes
- No bright colors except priority badges and column header accents

## Technical Constraints
- Do NOT modify existing Overview page functionality
- Use existing Supabase client pattern from `/api/dashboard/route.ts`
- Keep the existing `lib/types.ts` Task interface (add any missing fields)
- Environment variables: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_KEY (already configured)

## File Structure
```
app/
  page.tsx              → modify to add TabNav
  projects/
    page.tsx            → new Kanban page
  api/
    tasks/
      [id]/
        route.ts        → new PATCH endpoint
components/
  TabNav.tsx            → new tab navigation
  KanbanBoard.tsx       → main board container
  KanbanColumn.tsx      → single column (droppable)
  KanbanCard.tsx        → task card (draggable)
  TaskDetailPanel.tsx   → slide-out detail view
  PriorityBadge.tsx     → priority indicator
```

## Verification
After building:
1. Run `npm run build` — must pass with no errors
2. Confirm both tabs render (Overview + Projects)
3. Confirm drag-and-drop works between columns
4. Confirm task detail panel opens on card click
5. Confirm PATCH API updates Supabase

## DO NOT
- Do not add authentication
- Do not modify the existing dashboard components
- Do not add any data that doesn't come from Supabase
- Do not add edit functionality to the detail panel (v1 is read-only)
