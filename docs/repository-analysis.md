# Repository Analysis

## Directory Structure
- `.ai/`: AI context files (`AGENTS.md`, `gemini-context.md`)
- `app/`: Next.js 16 App Router (Server components, auth, dashboard pages, server actions)
- `components/`: UI and feature components (Event tabs, dashboard metrics, shared UI primitives)
- `hooks/`: Custom React hooks (`use-mobile.ts`)
- `lib/`: Shared utilities, mock data, and database clients (`queries.ts`, `data.ts`, `supabase.ts`, `supabase-server.ts`)
- `supabase/`: Database schema, migrations, and seed data
- `public/`: Static assets (e.g. `tsaatuva.png`)
- Root: `proxy.ts` (middleware), `package.json`, Next.js configs

## Next.js Boundaries
- **Server Components:** Layouts, page entry points, analytics page, settings page, event header wrapper
- **Client Components:** Auth forms, onboarding, event tab content, dashboard metric cards, analytics dashboard
- **Server Actions:** All data mutations (CRUD for events, dishes, staffing, etc.) via 11 files in `app/actions/`
- **Middleware:** `proxy.ts` handles Supabase session checking and routing for unauthenticated/un-onboarded users

## Database & Backend Context
- **Supabase**: 14 tables including `profiles`, `events`, `dishes`, `staff_members`, `shopping_items`, `grocery_runs`, `reimbursements`, `equipment_loans`, `recipes`.
- **Views**: 3 views for readiness and budget analytics.
- **RLS**: Enabled for `profiles`, `events`, `reimbursements`, `recipes`. ⚠️ 7 tables missing RLS. ⚠️ Syntax error in `reimbursements` policy.
- **State Flow**: Server components fetch data via `lib/queries.ts` → pass to Client components. Client components manage local state for optimistic UI updates and trigger Server Actions.
- **Issues**: Fallbacks to hardcoded mock data in `lib/data.ts` (especially dashboard metrics and action items). Optimistic UI lacks rollback handling on server action failures.
