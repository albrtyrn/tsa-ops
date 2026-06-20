# TSA Culinary Operations Copilot

A lightweight planning, logistics, and coordination hub designed for student organizations (specifically the Taiwanese Student Association at UVA) to manage food events, grocery runs, equipment loans, and reimbursements.

---

## 🚀 Key Features

* **Logistics Dashboard:** High-level metrics showing upcoming culinary events, budget summaries, active volunteer numbers, and urgent action/checklist suggestions.
* **Workspace Deep-Linking:** Actions trigger targeted redirects to specific event tabs (`?tab=staffing`, `?tab=shopping`, etc.) to streamline management.
* **Interactive Event Workspace:** Tabbed workspaces to track all tracks of event coordination:
  * **Overview:** Summaries and progress metrics.
  * **Menu:** Recipe lists, portion calculators, and estimated food costs.
  * **Staffing:** Volunteer checklists by team (Prep, Cooking, Serving, Support).
  * **Shopping & Grocery Lists:** Categorized grocery items (Produce, Protein, etc.) and driver logistics routes.
  * **Timeline Steps:** Live preparation checkpoints.
  * **Equipment Tracker:** Shared gear loans log with checkout/return confirmations.
  * **Reimbursements Log:** Expense upload status logs with Treasurer Venmo verification.
* **Retrospective Reflection:** Post-event lessons catalog for continuous organization improvement.

---

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (App Router), React 19, and Framer Motion.
* **Styling:** Tailwind CSS v4.0 (using standard CSS custom properties for theme variables).
* **Components:** Unstyled Base UI (`@base-ui/react`) and custom Radix primitives.
* **Backend & Database:** Supabase (Postgres Database, Server Actions, cookie-based session tracking with `@supabase/ssr`).

---

## ⚙️ Getting Started & Setup

### 1. Database Schema Initialization
Apply the migration SQL file to your Supabase project (via Supabase CLI or SQL Editor in the Dashboard):
```bash
# Path to migration script
supabase/migrations/20260620000000_init_schema.sql
```

### 2. Environment Variables Configuration
Create a `.env.local` file in the root of the project with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install Dependencies
```bash
pnpm install
```

### 4. Running the Development Server
```bash
pnpm dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser to view the application.

### 5. Production Build
To build and check for errors:
```bash
pnpm build
```

