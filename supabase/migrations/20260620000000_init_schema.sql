-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- =========================================================================
-- 1. POSTGRES ENUMS & CUSTOM TYPES
-- =========================================================================

create type user_role as enum ('Volunteer', 'Officer', 'Treasurer');
create type member_role as enum ('Member', 'Admin');
create type event_status as enum ('Planning', 'Ready', 'Needs Attention', 'Completed');
create type team_type as enum ('Prep Team', 'Cooking Team', 'Serving Team', 'Support Team');
create type vehicle_type as enum ('Sedan', 'SUV', 'Minivan', 'Pickup', 'None');
create type grocery_run_status as enum ('Planned', 'In progress', 'Completed');
create type receipt_status as enum ('Uploaded', 'Missing');
create type reimbursement_status as enum ('Pending Review', 'Approved by Treasurer', 'Venmo Sent');
create type action_item_type as enum ('Staffing', 'Shopping', 'Menu', 'Budget');

-- =========================================================================
-- 2. CORE SYSTEM TABLES
-- =========================================================================

-- Profiles Table: Linked 1:1 with Supabase Auth (auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    name text not null,
    role user_role not null default 'Volunteer',
    venmo_handle text,
    vehicle_type vehicle_type not null default 'None',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Workspaces Table
create table public.workspaces (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text not null unique,
    ai_preferences jsonb not null default '{
        "model": "gemini-2.5-flash",
        "auto_resolve_actions": false,
        "default_portion_buffer_percent": 10
    }'::jsonb,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Workspace Members: Junction table mapping profiles to workspaces
create table public.workspace_members (
    workspace_id uuid references public.workspaces(id) on delete cascade,
    profile_id uuid references public.profiles(id) on delete cascade,
    role member_role not null default 'Member',
    joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
    primary key (workspace_id, profile_id)
);

-- Events Table
create table public.events (
    id uuid default gen_random_uuid() primary key,
    workspace_id uuid not null references public.workspaces(id) on delete cascade,
    name text not null,
    date date not null,
    location text not null,
    attendees integer not null check (attendees >= 0),
    budget numeric(10, 2) not null check (budget >= 0.00),
    status event_status not null default 'Planning',
    summary text,
    is_archived boolean not null default false,
    reflection_what_worked text,
    reflection_what_failed text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Dishes Table (Menu Items)
create table public.dishes (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    name text not null,
    category text not null,
    servings integer not null check (servings > 0),
    estimated_cost numeric(10, 2) not null check (estimated_cost >= 0.00),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Staff Members Table (Volunteer Shifts)
create table public.staff_members (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    profile_id uuid references public.profiles(id) on delete set null,
    name text not null,
    role text not null,
    team team_type not null,
    confirmed boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Timeline Steps Table
create table public.timeline_steps (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    marker text not null,
    title text not null,
    description text not null,
    done boolean not null default false,
    sequence_order integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Shopping Items Table
create table public.shopping_items (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    category text not null,
    name text not null,
    quantity text not null,
    checked boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Grocery Runs Table
create table public.grocery_runs (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    driver_id uuid references public.profiles(id) on delete set null,
    driver_name_fallback text,
    vehicle vehicle_type not null default 'Sedan',
    destination text not null,
    departure text not null,
    status grocery_run_status not null default 'Planned',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Equipment Loans Table
create table public.equipment_loans (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    item text not null,
    owner_id uuid references public.profiles(id) on delete set null,
    owner_name_fallback text,
    date_brought text not null,
    date_returned text not null,
    returned boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Reimbursements Log Table
create table public.reimbursements (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    buyer_id uuid references public.profiles(id) on delete set null,
    buyer_name_fallback text,
    purpose text not null,
    amount numeric(10, 2) not null check (amount >= 0.00),
    receipt_status receipt_status not null default 'Uploaded',
    status reimbursement_status not null default 'Pending Review',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Lessons Learned Table
create table public.lessons (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    title text not null,
    body text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Action Items Table
create table public.action_items (
    id uuid default gen_random_uuid() primary key,
    event_id uuid not null references public.events(id) on delete cascade,
    type action_item_type not null,
    title text not null,
    description text not null,
    resolved boolean not null default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- 3. DYNAMIC OPERATIONAL DATABASE VIEWS
-- =========================================================================

-- View for calculating Dynamic Event Readiness percentages on-the-fly
create or replace view public.view_event_readiness as
with metrics as (
    select
        e.id as event_id,
        
        -- Menu Readiness
        coalesce(
            (select least(100.0, (count(distinct category)::float / 3.0) * 100.0)
             from public.dishes where event_id = e.id),
            0.0
        ) as menu_readiness,

        -- Staffing Readiness
        coalesce(
            (select (count(case when confirmed then 1 end)::float / nullif(count(*), 0)) * 100.0
             from public.staff_members where event_id = e.id),
            0.0
        ) as staffing_readiness,

        -- Shopping Readiness
        coalesce(
            (select (count(case when checked then 1 end)::float / nullif(count(*), 0)) * 100.0
             from public.shopping_items where event_id = e.id),
            0.0
        ) as shopping_readiness,

        -- Timeline Readiness
        coalesce(
            (select (count(case when done then 1 end)::float / nullif(count(*), 0)) * 100.0
             from public.timeline_steps where event_id = e.id),
            0.0
        ) as timeline_readiness

    from public.events e
)
select 
    event_id,
    round(menu_readiness::numeric, 0) as menu_val,
    round(staffing_readiness::numeric, 0) as staffing_val,
    round(shopping_readiness::numeric, 0) as shopping_val,
    round(timeline_readiness::numeric, 0) as timeline_val
from metrics;

-- View for Dynamic Spent Calculation (sums approved/sent payouts)
create or replace view public.view_events_with_spending as
select 
    e.*,
    coalesce(
        (select sum(r.amount) 
         from public.reimbursements r 
         where r.event_id = e.id 
           and r.status in ('Approved by Treasurer', 'Venmo Sent')),
        0.00
    ) as dynamic_spent
from public.events e;

-- View for Analytics: Budget Accuracy & Outcomes
create or replace view public.view_analytics_budget_accuracy as
select
    id as event_id,
    name as event_name,
    date,
    budget,
    dynamic_spent as spent,
    (budget - dynamic_spent) as variance,
    case 
        when budget = 0 then 0.0
        else round(((dynamic_spent / budget) * 100)::numeric, 2)
    end as budget_burn_percentage
from public.view_events_with_spending;

-- =========================================================================
-- 4. PERFORMANCE OPTIMIZATION INDEXES
-- =========================================================================

create index idx_events_workspace_id on public.events(workspace_id);
create index idx_dishes_event_id on public.dishes(event_id);
create index idx_staff_event_id on public.staff_members(event_id);
create index idx_shopping_event_id on public.shopping_items(event_id);
create index idx_timeline_event_id on public.timeline_steps(event_id);
create index idx_reimbursements_event_id on public.reimbursements(event_id);
create index idx_action_items_event_id on public.action_items(event_id);
create index idx_grocery_runs_event_id on public.grocery_runs(event_id);
create index idx_equipment_loans_event_id on public.equipment_loans(event_id);

-- =========================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.events enable row level security;
alter table public.reimbursements enable row level security;

-- Profiles Policies
create policy "Allow public read access to profiles" 
    on public.profiles for select using (true);

create policy "Allow users to update their own profile" 
    on public.profiles for update using (auth.uid() = id);

-- Workspace Access
create policy "Users can view workspaces they belong to"
    on public.workspaces for select using (
        exists (
            select 1 from public.workspace_members
            where workspace_members.workspace_id = id 
              and workspace_members.profile_id = auth.uid()
        )
    );

-- Events Access
create policy "Users can select events in their workspaces"
    on public.events for select using (
        exists (
            select 1 from public.workspace_members
            where workspace_members.workspace_id = events.workspace_id 
              and workspace_members.profile_id = auth.uid()
        )
    );

create policy "Officers can insert/update events in their workspaces"
    on public.events for all using (
        exists (
            select 1 from public.workspace_members wm
            join public.profiles p on wm.profile_id = p.id
            where wm.workspace_id = events.workspace_id 
              and wm.profile_id = auth.uid()
              and p.role in ('Officer', 'Treasurer')
        )
    );

-- Reimbursements Access
create policy "Members can view reimbursements for their events"
    on public.reimbursements for select using (
        exists (
            select 1 from public.events e
            join public.workspace_members wm on e.workspace_id = wm.workspace_id
            where e.id = reimbursements.event_id 
              and wm.profile_id = auth.uid()
        )
    );

create policy "Members can submit/edit their own reimbursement requests"
    on public.reimbursements for insert/update using (
        buyer_id = auth.uid()
    );

create policy "Treasurers can manage all reimbursements"
    on public.reimbursements for all using (
        exists (
            select 1 from public.profiles
            where profiles.id = auth.uid() 
              and profiles.role = 'Treasurer'
        )
    );

-- =========================================================================
-- 6. AUTOMATIC AUTH USER PROFILE SYNC TRIGGER
-- =========================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', 'New User'),
    'Volunteer'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
