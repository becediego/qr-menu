-- Phase C — core tables for qr-menu MVP
-- Run this once in Supabase: SQL Editor → New query → Paste → Run

-- Extensions (usually already on in Supabase)
create extension if not exists "pgcrypto";

-- restaurants
create table public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamptz not null default now()
);

-- tables (physical restaurant tables, e.g. table 7)
create table public.tables (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  table_number integer not null,
  qr_token text,
  created_at timestamptz not null default now(),
  unique (restaurant_id, table_number)
);

-- menu_categories
create table public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- menu_items
create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories (id) on delete cascade,
  name text not null,
  description text not null default '',
  price_cents integer not null check (price_cents >= 0),
  image_url text,
  is_available boolean not null default true,
  created_at timestamptz not null default now()
);

-- orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  table_id uuid not null references public.tables (id) on delete restrict,
  status text not null default 'new'
    check (status in ('new', 'preparing', 'ready', 'served', 'cancelled')),
  customer_note text,
  created_at timestamptz not null default now()
);

-- order_items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  menu_item_id uuid not null references public.menu_items (id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price_cents integer not null check (unit_price_cents >= 0),
  note text,
  created_at timestamptz not null default now()
);

-- Helpful indexes for common lookups
create index tables_restaurant_id_idx on public.tables (restaurant_id);
create index menu_categories_restaurant_id_idx on public.menu_categories (restaurant_id);
create index menu_items_category_id_idx on public.menu_items (category_id);
create index orders_restaurant_id_idx on public.orders (restaurant_id);
create index orders_status_idx on public.orders (status);
create index order_items_order_id_idx on public.order_items (order_id);
