-- Add recipe_id to dishes
alter table public.dishes 
add column recipe_id uuid references public.recipes(id) on delete set null;
