# WORKFLOW: Core Event Management

## In-Scope Features
1. **Event Creation UI:** Implement the "New Event" creation flow on the events list page, including the UI modal and wiring it to the `createEvent` server action.
2. **SSR Consistency:** Refactor `app/events/page.tsx` to use Server-Side Rendering (SSR) for fetching the events list, matching the pattern used in the dashboard.
3. **Menu Readiness Logic:** Update the dynamic readiness calculation in `lib/queries.ts` so the denominator uses the dynamic number of menu categories instead of a hardcoded `3`.
4. **Migration Cleanup:** Remove the redundant SQL migration `20260621000001_add_tasting_notes_to_recipes.sql` which attempts to add an existing column and causes migration failures on fresh instances.

## Business Logic Rules
- The "New Event" form should require basic metadata (name, date, location, attendees, budget) and default status to 'Planning'.
- Event listing should be fully pre-rendered on the server side to eliminate client-side loading spinners.
- Menu readiness should calculate as `(Unique Menu Categories Added / Expected Menu Categories for the Event Size) * 100`. (If expected categories is undefined, default to the number of existing unique categories, maxing at 100%).
- Database schema structure should not be modified, only the redundant migration file should be deleted.

## Out-of-Scope Table
| Category | Excluded Item | Reason |
| :--- | :--- | :--- |
| **Features** | Recipe Library UI | Creating/editing recipes is part of a separate Advanced Integrations workflow. |
| **Backend** | Modifying RLS Policies | RLS has been hardened in Workflow 001. |
| **Refactoring** | Major UI redesigns | Keep the UI aligned with existing Shadcn UI components. |

## Steps
1. **Migration Cleanup:** Delete `20260621000001_add_tasting_notes_to_recipes.sql`.
2. **SSR Refactor:** Convert `app/events/page.tsx` to an async Server Component that fetches data via `fetchAllEvents()`.
3. **Menu Readiness Fix:** Update the `menuVal` calculation in `lib/queries.ts` to dynamically determine the divisor based on actual expected categories.
4. **Event Creation Modal:** Create `components/new-event-modal.tsx` and integrate it into the events page.
