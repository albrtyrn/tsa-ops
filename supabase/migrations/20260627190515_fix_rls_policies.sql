-- =========================================================================
-- 1. FIX REIMBURSEMENTS RLS POLICY SYNTAX
-- =========================================================================

-- Drop the invalid policy which used "for insert/update"
drop policy if exists "Members can submit/edit their own reimbursement requests" on public.reimbursements;

-- Recreate as separate insert and update policies
create policy "Members can submit their own reimbursement requests"
    on public.reimbursements for insert using (
        buyer_id = auth.uid()
    );

create policy "Members can edit their own reimbursement requests"
    on public.reimbursements for update using (
        buyer_id = auth.uid()
    );

-- =========================================================================
-- 2. ENABLE RLS ON UNPROTECTED TABLES
-- =========================================================================

alter table public.dishes enable row level security;
alter table public.staff_members enable row level security;
alter table public.timeline_steps enable row level security;
alter table public.shopping_items enable row level security;
alter table public.grocery_runs enable row level security;
alter table public.equipment_loans enable row level security;
alter table public.lessons enable row level security;
alter table public.action_items enable row level security;

-- =========================================================================
-- 3. APPLY STANDARD RLS POLICIES FOR NEWLY PROTECTED TABLES
-- =========================================================================
-- Standard Pattern:
-- 1. Authenticated users can select
-- 2. Officers can manage (all)

-- Dishes
create policy "Authenticated users can view dishes" on public.dishes for select using (auth.role() = 'authenticated');
create policy "Officers can manage dishes" on public.dishes for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Staff Members
create policy "Authenticated users can view staff_members" on public.staff_members for select using (auth.role() = 'authenticated');
create policy "Officers can manage staff_members" on public.staff_members for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Timeline Steps
create policy "Authenticated users can view timeline_steps" on public.timeline_steps for select using (auth.role() = 'authenticated');
create policy "Officers can manage timeline_steps" on public.timeline_steps for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Shopping Items
create policy "Authenticated users can view shopping_items" on public.shopping_items for select using (auth.role() = 'authenticated');
create policy "Officers can manage shopping_items" on public.shopping_items for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Grocery Runs
create policy "Authenticated users can view grocery_runs" on public.grocery_runs for select using (auth.role() = 'authenticated');
create policy "Officers can manage grocery_runs" on public.grocery_runs for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Equipment Loans
create policy "Authenticated users can view equipment_loans" on public.equipment_loans for select using (auth.role() = 'authenticated');
create policy "Officers can manage equipment_loans" on public.equipment_loans for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Lessons
create policy "Authenticated users can view lessons" on public.lessons for select using (auth.role() = 'authenticated');
create policy "Officers can manage lessons" on public.lessons for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);

-- Action Items
create policy "Authenticated users can view action_items" on public.action_items for select using (auth.role() = 'authenticated');
create policy "Officers can manage action_items" on public.action_items for all using (
    exists (select 1 from public.profiles where profiles.id = auth.uid() and profiles.role in ('executive', 'officer', 'culinary', 'advisor'))
);
