# Bug & Functional Audit

## CRITICAL
- **ISSUE #1**: `dashboard/metric-cards.tsx` imports mock data, failing to show real database KPIs.
- **ISSUE #2**: `dashboard/action-required.tsx` imports mock action items, never querying the Supabase `action_items` table.
- **ISSUE #3**: "Save reflection" button in `reflection-tab.tsx` has no `onClick` handler, and users cannot save reflections.

## HIGH
- **ISSUE #4**: RLS policy for `reimbursements` uses invalid PostgreSQL syntax (`for insert/update`), preventing the policy from applying.
- **ISSUE #5**: 7 tables (`dishes`, `staff_members`, `timeline_steps`, `shopping_items`, `grocery_runs`, `equipment_loans`, `lessons`) have NO RLS enabled, exposing them to unauthorized access.
- **ISSUE #6**: `event-header.tsx` edits fields (`venue_status`, `funding_status`, `google_sheets_link`, `debrief_doc_link`) that don't exist in the `events` table, causing silent data drops.
- **ISSUE #7**: `reimbursements-tab.tsx` badge styling checks for invalid enum values (`"Approved"`, `"Draft"`), breaking styling.
- **ISSUE #8**: Optimistic UI updates across all event tabs never roll back on server action failure, causing the UI to show phantom data on error.

## MEDIUM
- **ISSUE #9**: "New Event" button on the events page has no click handler and no creation modal.
- **ISSUE #10**: "Generate Plan (AI)" button in event header is purely decorative.
- **ISSUE #11**: `app/events/page.tsx` uses client-side fetch, inconsistent with the dashboard's SSR fetch approach.
- **ISSUE #12**: Missing Supabase environment variables silently fall back to placeholder values, causing confusing network errors.
- **ISSUE #13**: Redundant migration `20260621000001_add_tasting_notes_to_recipes.sql` attempts to add an existing column.

## LOW
- **ISSUE #14**: Over 50 `console.error` and `console.warn` statements, some leaking raw error objects, littering the production output.
- **ISSUE #15**: `typescript.ignoreBuildErrors: true` in `next.config.mjs` masks type errors.
- **ISSUE #16**: Menu readiness hardcodes a divisor of `3` instead of the dynamic number of categories.
