-- Create Recipes table
create table public.recipes (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    status text not null default 'Untested' check (status in ('Untested', 'Testing', 'D-Day Ready')),
    doc_link text not null,
    tasting_notes text[] not null default '{}',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.recipes enable row level security;

-- Policies for Recipes
create policy "Allow authenticated users to read recipes"
    on public.recipes for select using (auth.role() = 'authenticated');

create policy "Allow authenticated users to insert recipes"
    on public.recipes for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated users to update recipes"
    on public.recipes for update using (auth.role() = 'authenticated');
