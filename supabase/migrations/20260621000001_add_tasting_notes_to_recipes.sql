-- Add tasting_notes column to recipes table
alter table public.recipes 
add column if not exists tasting_notes text[] not null default '{}';
