-- Phase C — demo seed data
-- Run once in Supabase: SQL Editor → New query → Paste → Run
-- Safe to re-run only if you delete the demo restaurant first (or use a fresh project)

-- 1) Demo restaurant
insert into public.restaurants (name, slug)
values ('Demo Cafe', 'demo')
on conflict (slug) do nothing;

-- 2) Tables 1–10 for that restaurant
insert into public.tables (restaurant_id, table_number)
select r.id, g.n
from public.restaurants r
cross join generate_series(1, 10) as g(n)
where r.slug = 'demo'
on conflict (restaurant_id, table_number) do nothing;

-- 3) Menu categories (Pizza, Drinks)
insert into public.menu_categories (restaurant_id, name, sort_order)
select r.id, c.name, c.sort_order
from public.restaurants r
cross join (
  values
    ('Pizza', 1),
    ('Drinks', 2)
) as c(name, sort_order)
where r.slug = 'demo'
  and not exists (
    select 1
    from public.menu_categories mc
    where mc.restaurant_id = r.id and mc.name = c.name
  );

-- 4) Menu items (same as Phase B hardcoded menu)
insert into public.menu_items (category_id, name, description, price_cents, is_available)
select mc.id, i.name, i.description, i.price_cents, true
from public.restaurants r
join public.menu_categories mc on mc.restaurant_id = r.id
join (
  values
    ('Pizza', 'Margherita', 'Tomato, mozzarella, fresh basil', 1200),
    ('Pizza', 'Pepperoni', 'Tomato, mozzarella, pepperoni', 1400),
    ('Pizza', 'Quattro Formaggi', 'Mozzarella, gorgonzola, fontina, parmesan', 1500),
    ('Pizza', 'BBQ Chicken', 'BBQ sauce, chicken, red onion, cilantro', 1550),
    ('Drinks', 'Cola', 'Chilled 12 oz can', 250),
    ('Drinks', 'Sparkling Water', 'Sparkling mineral water', 300),
    ('Drinks', 'Lemonade', 'Fresh-squeezed lemonade', 350),
    ('Drinks', 'Iced Tea', 'House-brewed black tea, unsweetened', 300)
) as i(category_name, name, description, price_cents)
  on mc.name = i.category_name
where r.slug = 'demo'
  and not exists (
    select 1
    from public.menu_items mi
    where mi.category_id = mc.id and mi.name = i.name
  );
