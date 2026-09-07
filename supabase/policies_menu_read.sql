-- Phase C — allow public read of menu data (RLS is already enabled)
-- Run once in Supabase: SQL Editor → New query → Paste → Run
--
-- This lets the Next.js app (anon key) load the restaurant menu.
-- Orders stay locked until Phase D (no insert/update policies yet).

create policy "Public can read restaurants"
  on public.restaurants
  for select
  to anon, authenticated
  using (true);

create policy "Public can read tables"
  on public.tables
  for select
  to anon, authenticated
  using (true);

create policy "Public can read menu_categories"
  on public.menu_categories
  for select
  to anon, authenticated
  using (true);

create policy "Public can read menu_items"
  on public.menu_items
  for select
  to anon, authenticated
  using (true);
