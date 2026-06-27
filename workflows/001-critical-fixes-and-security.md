# WORKFLOW 001

Title: Critical Bug Fixes & Security Hardening
Branch: `workflow/critical-fixes-and-security`
Summary: Fix all Critical and High severity bugs — broken UI handlers, RLS gaps, schema mismatches, and data integrity issues that directly impact usability and security.

## STEP 1
Status: PR OPEN
Branch: `step/critical-fixes-reflection-and-reimbursements`
Files:
- `components/event/reflection-tab.tsx`
- `components/event/reimbursements-tab.tsx`
PR Title: `fix(event): wire reflection save button and fix reimbursement badge styling`
PR Body:
> **Reflection Tab:** Import `updateEventReflection` from `@/app/actions/events` and wire it to the save button's `onClick` handler. Add loading/success state management.
>
> **Reimbursements Tab:** Update badge color conditionals to match the actual `reimbursement_status` enum values: `"Pending Review"` → amber, `"Approved by Treasurer"` → green, `"Venmo Sent"` → blue.
>
> **Test:** Navigate to an event → Reflection tab → type text → click Save → verify text persists on reload. Navigate to Reimbursements tab → verify badges show correct colors for each status.

## STEP 2
Status: PR OPEN
Branch: `step/critical-fixes-rls-hardening`
Files:
- `supabase/migrations/<new_timestamp>_fix_rls_policies.sql`
PR Title: `fix(db): enable RLS on unprotected tables and fix reimbursement policy syntax`
PR Body:
> Create a new migration that:
> 1. Enables RLS on `dishes`, `staff_members`, `timeline_steps`, `shopping_items`, `grocery_runs`, `equipment_loans`, `lessons`, and `action_items`.
> 2. Creates policies: authenticated SELECT, officer+ INSERT/UPDATE/DELETE for each.
> 3. Drops and recreates the `reimbursements` member policy, splitting the invalid `for insert/update` into separate INSERT and UPDATE policies.
>
> **Test:** Run `supabase db reset` and verify all policies apply without error. Test that authenticated users can read data and officers can write.

## STEP 3
Status: PENDING
Branch: `step/critical-fixes-event-schema-alignment`
Files:
- `supabase/migrations/<new_timestamp>_add_event_metadata_columns.sql`
- `components/event/event-header.tsx`
PR Title: `fix(db/event): add missing event metadata columns and align header component`
PR Body:
> Create a new migration adding `venue_status text`, `funding_status text`, `google_sheets_link text`, and `debrief_doc_link text` columns to the `events` table (all nullable).
>
> Verify `event-header.tsx` edit state and `updateEvent` server action correctly reference these new columns.
>
> **Test:** Edit an event's venue status and Google Sheets link → save → reload → verify values persist.
