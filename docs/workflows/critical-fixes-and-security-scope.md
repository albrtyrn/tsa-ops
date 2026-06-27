# WORKFLOW: Critical Fixes & Security Hardening

## In-Scope Features
1. **Reflection & Reimbursements UI Fixes:** Wire the `updateEventReflection` server action to the save button in `reflection-tab.tsx` and correct the reimbursement badge conditional styling.
2. **Database Security (RLS) Hardening:** Apply Row Level Security to all previously unprotected tables (`dishes`, `staff_members`, `timeline_steps`, `shopping_items`, `grocery_runs`, `equipment_loans`, `lessons`, `action_items`). Fix the invalid policy on the `reimbursements` table.
3. **Event Schema Alignment:** Add missing columns to the `events` table that the frontend attempts to read/write (`venue_status`, `funding_status`, `google_sheets_link`, `debrief_doc_link`). Update `event-header.tsx` and the `updateEvent` server action to correctly reference these columns.
4. **Data Fetching Wire-up (Metric Cards & Action Required):** Replace hardcoded mock data imports in `metric-cards.tsx` and `action-required.tsx` with actual database queries via `lib/queries.ts`.

## Business Logic Rules
- RLS Policies must enforce: `SELECT` for authenticated users; `INSERT`/`UPDATE`/`DELETE` for officers only (except reimbursements, where members can submit/edit their own requests).
- Database migrations must not drop tables or delete existing data.
- Fixes should be surgically applied to the components experiencing the bugs; do not attempt large refactors of the component hierarchy.

## Out-of-Scope Table
| Category | Excluded Item | Reason |
| :--- | :--- | :--- |
| **Features** | New component creation (e.g., adding a new Tab). | Scope is limited to fixing existing broken components. |
| **Backend** | Modifying auth triggers or user roles. | RLS relies on existing roles; changing roles could break access. |
| **Refactoring** | Migrating from Server Actions to API routes or vice-versa. | Stick to the existing data flow pattern established in the codebase. |

## Steps
1. **[COMPLETED]** Wire reflection save button and fix reimbursement badge styling.
2. **[COMPLETED]** Create database migration to enable RLS on unprotected tables and fix the reimbursement policy.
3. **[PENDING]** Create database migration for missing Event metadata columns and update `event-header.tsx`.
4. **[PENDING]** Wire up Dashboard components (`metric-cards.tsx`, `action-required.tsx`) to real database queries.
