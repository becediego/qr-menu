# qr-menu

QR-code restaurant ordering: customers scan a table QR code, open a mobile menu, place an order, and (next) kitchen/staff see it on a board.

See [PLAN.md](./PLAN.md) for the full MVP plan.

## Stack

- **Next.js** (App Router) — UI + API routes in one project
- **TypeScript** + **Tailwind CSS**
- **Vercel** — hosting / deploy from GitHub
- **Supabase** — hosted Postgres (menu reads + order writes)

## Getting started

1. Copy `.env.example` to `.env.local` and fill in your Supabase URL + anon key.
2. In the Supabase SQL Editor, run (once each, in order):
   - [`supabase/schema.sql`](./supabase/schema.sql)
   - [`supabase/seed.sql`](./supabase/seed.sql)
   - [`supabase/policies_menu_read.sql`](./supabase/policies_menu_read.sql)
   - [`supabase/policies_orders_insert.sql`](./supabase/policies_orders_insert.sql)
3. Install and run locally:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then try the demo menu at [http://localhost:3000/r/demo/t/7](http://localhost:3000/r/demo/t/7).

Add items → **Place order** → confirmation means rows were written to `orders` and `order_items` in Supabase.

## Scripts

| Command         | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Local development    |
| `npm run build` | Production build     |
| `npm run start` | Run production build |
| `npm run lint`  | ESLint               |

## Routes

| Route           | Status           | Purpose                                      |
| --------------- | ---------------- | -------------------------------------------- |
| `/`             | Done             | Project home / phase status                  |
| `/r/demo/t/7`   | Done             | Customer menu from DB, cart, place order     |
| `POST /api/orders` | Done          | Validates cart and saves `orders` + `order_items` (prices from DB) |
| `/staff/orders` | Planned          | Kitchen / waiter board for open orders       |
| `/admin/menu`   | Planned          | Simple menu item editor                      |

## Current status

| Phase | Status | What it delivered |
| ----- | ------ | ----------------- |
| **A** | ✅ | Next.js app on GitHub + Vercel |
| **B** | ✅ | Demo menu + in-browser cart |
| **C** | ✅ | Supabase tables/seed; menu loads from DB |
| **D.1** | ✅ | Place order persists to `orders` + `order_items` via `POST /api/orders` |
| **D.2** | Next | Staff page that lists open orders |
| **D.3** | Next | Status buttons: Accept → Ready → Served |

### How ordering works now

1. Customer opens `/r/{restaurant}/t/{table}` (e.g. `/r/demo/t/7`).
2. Menu categories/items load from Supabase.
3. Cart lives in the browser until they tap **Place order**.
4. The app calls `POST /api/orders` with restaurant, table, and item ids/quantities.
5. The API checks the restaurant/table, confirms items are available, and **stores unit prices from the database** (not from the client).
6. Customer sees a confirmation with a short order id.

Staff UI and QR stickers come in later Phase D / E steps in [PLAN.md](./PLAN.md).
