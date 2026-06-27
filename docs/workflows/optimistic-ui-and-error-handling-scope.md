# WORKFLOW: Optimistic UI & Error Handling

## In-Scope Features
1. **Optimistic Update Rollbacks:** Fix UI state to correctly rollback on server action failure across all event tabs (reflection, shopping, timeline, etc.).
2. **Supabase Client Error Handling:** Address the missing Supabase environment variables issue that causes silent fallbacks and confusing network errors.
3. **Console Log Cleanup:** Remove or properly format over 50 `console.error` and `console.warn` statements leaking raw error objects into production output.
4. **TypeScript Safety:** Remove `typescript.ignoreBuildErrors: true` from `next.config.mjs` and fix the underlying TypeScript errors (e.g. Framer Motion types) to ensure build safety.

## Business Logic Rules
- Server actions must reliably throw errors that the client components can catch to trigger UI rollbacks.
- Supabase client initialization should fail fast and explicitly if environment variables are missing, instead of falling back to invalid states.
- TypeScript compilation must pass strictly without ignoring build errors.
- Do not suppress valid errors; instead, present them user-friendly in the UI using toast notifications or error boundaries.

## Out-of-Scope Table
| Category | Excluded Item | Reason |
| :--- | :--- | :--- |
| **Features** | New UI components for displaying errors | Use existing toast notifications or simple alert banners. |
| **Backend** | Modifying database schema or RLS | Schema changes belong in feature-specific workflows. |
| **Refactoring** | Converting components to use React Query or SWR | Stick to the existing Server Actions + `useState`/`useTransition` pattern. |

## Steps
1. **Remove `ignoreBuildErrors` & Fix Types:** Remove the flag from Next.js config and fix all TypeScript errors across components.
2. **Supabase Client Fix:** Update `lib/supabase-server.ts` to properly validate environment variables on initialization.
3. **Optimistic Rollbacks:** Update all event tab components (`shopping-tab.tsx`, `timeline-tab.tsx`, etc.) to wrap server action calls in `try/catch` and rollback local state on failure.
4. **Console Log Cleanup:** Audit and clean up all stray `console.log`, `console.warn`, and `console.error` calls.
