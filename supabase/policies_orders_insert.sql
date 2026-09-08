-- Phase D — allow public create of orders (RLS is already enabled)
-- Run once in Supabase: SQL Editor → New query → Paste → Run
--
-- Customers place orders via the Next.js API using the anon key.
-- No SELECT policies: the API generates UUIDs so it does not need to read back rows.
-- Staff read/update comes in later Phase D steps (with auth).

create policy "Public can insert orders"
  on public.orders
  for insert
  to anon, authenticated
  with check (true);

create policy "Public can insert order_items"
  on public.order_items
  for insert
  to anon, authenticated
  with check (true);
