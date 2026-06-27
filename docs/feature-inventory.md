# Feature Inventory

## COMPLETE
- Auth & Session Management (login, signup, callback, proxy)
- Onboarding Flow (`/onboarding`)
- User Settings (`/settings`)
- Sidebar Navigation
- Event Workspace — Menu Tab
- Event Workspace — Staffing Tab
- Event Workspace — Timeline Tab
- Event Workspace — Shopping Tab
- Event Workspace — Equipment Tab
- Event Workspace — Tab Deep-Linking

## PARTIAL
- Dashboard — Event Cards (Falls back to mock data)
- Events List Page ("New Event" button missing handler)
- Event Workspace — Header (References non-existent DB columns, "Generate Plan" button dead)
- Event Workspace — Overview Tab (Summary is static mock data)
- Event Workspace — Reimbursements Tab (Badge styling incorrect)
- Analytics Dashboard (Falls back to mock data)
- Recipes Vault (CRUD works, no integration with Menu)
- Drivers Vault (CRUD works, no integration with Shopping)
- Inventory Vault (Isolated from Equipment tab)

## BROKEN
- Dashboard — Metric Cards (Always mock data)
- Dashboard — Action Items (Always mock data)
- Event Workspace — Reflection Tab ("Save reflection" button has no handler)

## STUBBED
- Create New Event (Server action exists, UI missing)
- AI Features (Decorative UI only)

## PLANNED
- Real-time Sync (Supabase supports this, but data only fetched on mount)

## DEAD
- Delete Recipes (No server action or UI)
