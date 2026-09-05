# qr-menu — Development Plan

A beginner-friendly plan to build a QR-code restaurant ordering service: customers scan a table QR code, open a mobile webpage, order from the menu, and staff see the order.

You do **not** need a native iOS/Android app for the first version. A mobile-friendly website is enough.

---

## Mental model

```
Customer phone          Your website            Your server              Staff device
     |                      |                       |                        |
  Scan QR  -----------> Menu page  ----------> Save order  ----------> Orders screen
     |                      |                       |                        |
  Place order <-------- Confirmation <-------- Database                    Mark ready
```

Three main pieces:

1. **Frontend** — what people see (menu, cart, kitchen/staff board)
2. **Backend** — logic + storage (orders, menu items, which table)
3. **QR codes** — links that open the right restaurant + table page

---

## Step 0 — Decide the MVP first

An MVP is the smallest product that proves the idea works in a real restaurant.

### Include in MVP

- One restaurant only
- Menu with categories, names, prices, optional photos
- Table number from the QR link (e.g. table 7)
- Cart + place order (**no online payment yet** — pay at the table/counter)
- Staff page that lists live orders and can mark them accepted / ready / done
- Simple admin to add/edit menu items

### Exclude from MVP (add later)

- Online payments / tips
- Multiple restaurants / franchise
- User accounts / loyalty
- Inventory / recipes
- Fancy design system
- Native iOS/Android apps
- Complex modifiers (keep notes simple: “no onion”, “spicy”)

### Success test for MVP

A friend at a table scans, orders 2 items, and you see the order appear on a phone/laptop within a few seconds.

---

## Step 1 — Learn the bare minimum (before coding the product)

You do not need to become a full web developer first. Learn just enough in this order.

### 1) How the web works (concepts)

- Browser requests a URL → server responds with a page
- **HTML** = structure
- **CSS** = look
- **JavaScript** = behavior (add to cart, submit order)
- **API** = frontend asks backend for data (`GET /menu`, `POST /orders`)
- **Database** = permanent storage (menu items, orders)

### 2) Recommended beginner stack

| Layer             | Recommendation                                         | Why                                                  |
| ----------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| Frontend          | **Next.js** (React)                                    | Huge tutorials; one project can do UI + some backend |
| Backend           | Start **inside Next.js** (API routes / server actions) | One codebase, fewer moving parts                     |
| Database          | **PostgreSQL** via **Supabase** or **Neon**            | Hosted DB, free tier, less ops                       |
| Auth (staff only) | Supabase Auth or Clerk                                 | Don’t build login yourself                           |
| Hosting           | **Vercel** (for Next.js)                               | Deploy from GitHub with clicks                       |
| QR codes          | Free generator (or library later) linking to your URLs | QR is just a URL sticker                             |

**Alternative for a throwaway demo only:** no-code tools (Bubble, Glide) or Google Forms. Use that only to validate demand; rebuild in Next.js for a real product.

### 3) Tools to install when you start coding

- **VS Code** or **Cursor** (editor)
- **Node.js** (runs JavaScript tooling)
- **Git + GitHub** (save and version code)
- Browser DevTools habit (F12 → Network / Console when something breaks)

---

## Step 2 — Design screens + data (no code yet)

### Screens

1. **Customer menu** — `/r/demo/t/7` — categories, items, add to cart
2. **Cart / checkout** — review, note (“no ice”), place order
3. **Order status** (optional MVP+) — received / preparing / ready
4. **Kitchen / waiter board** — `/staff/orders` — open orders by table
5. **Admin menu editor** — `/admin/menu` — create/edit/delete items

### Core database tables

**restaurants**

- id, name, slug (`demo`)

**tables**

- id, restaurant_id, table_number (7), qr_token (optional secret)

**menu_categories**

- id, restaurant_id, name (“Drinks”), sort_order

**menu_items**

- id, category_id, name, description, price_cents, image_url, is_available

**orders**

- id, restaurant_id, table_id, status (`new` / `preparing` / `ready` / `served` / `cancelled`), created_at, customer_note

**order_items**

- id, order_id, menu_item_id, quantity, unit_price_cents, note

That is enough for MVP.

### QR URL design

Each sticker encodes something like:

```text
https://yourapp.com/r/demo/t/7
```

Meaning: restaurant `demo`, table `7`.

Later you can use opaque tokens (`/o/a8f3k2`) so people cannot easily order as another table by editing the URL.

---

## Step 3 — How the frontend should work

### Customer experience constraints

- Phones only, often bad Wi‑Fi → keep pages light and fast
- Big tap targets, few steps to order
- Show prices clearly; confirm after submit
- Handle “item sold out” (`is_available = false`)
- Don’t require an account for MVP

### Frontend responsibilities

- Show menu from API
- Keep a **cart** (in browser memory; optionally `localStorage`)
- Submit order with table id + items
- Staff UI: poll or subscribe for new orders every few seconds
- Basic responsive layout (mobile-first CSS)

### Practical UI approach for a beginner

1. Sketch screens on paper (boxes only)
2. Build ugly but usable pages first
3. Use a component library later if needed — not required for MVP
4. Photos: start with one image per item, or even none

You do **not** need Figma to start. Paper + working pages beat perfect mockups.

---

## Step 4 — What the backend should handle

Think of the backend as the only place you trust.

### Must handle

- Serve menu for a restaurant
- Create orders (validate items exist; **prices from DB**, not from the client)
- List/update order status for staff
- Protect staff/admin routes (password/login)
- Identify table from URL/token
- Business rules: can’t order unavailable items; quantities ≥ 1; optional restaurant open/closed flag

### Do not trust the browser for

- Prices (client can fake `$0.01`)
- “I’m table 1” without a token if abuse matters
- Staff actions without auth

### Nice-to-have later

- Payments (Stripe)
- WebSockets for instant kitchen updates (MVP can refresh every 3–5 seconds)
- SMS/WhatsApp notify waiter
- Multi-language menus
- Tax / service charge rules by country

### Example API shape for MVP (Next.js)

- `GET /api/restaurants/:slug/menu`
- `POST /api/orders` → `{ tableToken, items: [{ id, qty, note }], note }`
- `GET /api/staff/orders?status=open` (auth required)
- `PATCH /api/staff/orders/:id` → `{ status: "preparing" }`
- `POST` / `PUT` / `DELETE` `/api/admin/menu-items` (auth required)

---

## Step 5 — Build path for the MVP (ordered checklist)

### Phase A — Empty working website ✅

- [x] Create GitHub account + repo
- [x] Create Next.js app locally
- [x] Deploy to Vercel so you have a public URL
- [x] Open that URL on your phone (proves deploy works)

### Phase B — Fake menu page ✅

- [x] Hardcode ~8 menu items in the page (4 pizzas + 4 drinks)
- [x] Add cart in the browser (no database yet)
- [x] “Place order” button shows the cart JSON (on-page confirmation; browser alerts are often blocked in previews)

### Phase C — Real database

1. Create Supabase (or Neon) project
2. Create the tables above
3. Insert demo restaurant + tables 1–10 + menu rows
4. Replace hardcoded menu with a DB fetch

### Phase D — Real orders

1. `POST` order writes to `orders` + `order_items`
2. Build staff page that reads open orders
3. Add buttons: Accept → Ready → Served

### Phase E — QR codes

1. Generate QR for `https://your-vercel-url/r/demo/t/3`
2. Print paper codes for tables
3. Test full loop at home (simulate kitchen + customer)

### Phase F — Hardening for a pilot restaurant

1. Staff login
2. Mark items unavailable
3. Basic error messages (“order failed, retry”)
4. Simple order sound/notification on staff screen
5. Backup plan if Wi‑Fi dies (staff takes order manually)

Only after one restaurant uses it happily should you add payments or multi-restaurant features.

---

## Step 6 — Deployment & operations (beginner view)

| Concern         | MVP approach                                           |
| --------------- | ------------------------------------------------------ |
| Hosting website | Vercel                                                 |
| Database        | Supabase or Neon hosted Postgres                       |
| Images          | Supabase Storage or Cloudinary; or skip images first   |
| Domain          | Buy domain later; use `*.vercel.app` first             |
| Secrets         | API keys in host env vars, never commit them to GitHub |
| Monitoring      | Read Vercel/Supabase logs when something fails         |
| Backups         | Use managed DB backups                                 |

**Deploy loop you’ll use forever:** change code → commit to GitHub → host auto-redeploys → test on phone.

---

## Step 7 — Things to consider early (even if you don’t build them yet)

### Restaurant reality

- Peak dinner rush: UI must be obvious under stress
- Wrong table orders are painful → clear table label on every screen
- Kitchen may want printed tickets later; a screen is fine for MVP
- Who accepts orders—waiter or kitchen? Design status flow for that person
- Partial availability (“out of salmon”) must be one tap

### Legal / business

- Who is the merchant of record if you take payments later
- Allergen disclaimers (show restaurant-provided info)
- Data retention of orders
- Pricing agreement with the restaurant (monthly SaaS vs % of sales)

### Security / abuse

- Public menu is fine; public “create order” needs rate limits later
- Staff routes must be private
- Don’t expose other tables’ orders

### Technical debt to avoid as a beginner

- Don’t build microservices
- Don’t build your own auth/payments
- Don’t start with Kubernetes
- Don’t optimize for millions of users before one café loves it

---

## Step 8 — What to learn week by week

### Week 1 — Foundations

HTML/CSS basics, what HTTP/JSON are, GitHub hello-world, deploy a static page.

### Week 2 — Interactive UI

JavaScript basics, forms, arrays (cart), `fetch()` calling a public API.

### Week 3 — App framework

Next.js tutorial: pages/routes, components, loading data.

### Week 4 — Database

SQL `SELECT` / `INSERT` basics, Supabase tables, connect Next.js ↔ DB.

### Week 5 — MVP vertical slice

Menu → cart → create order → staff list → status update → QR test.

### Week 6 — Pilot polish

Auth for staff, unavailable items, mobile UI fixes, one restaurant trial.

### Helpful learning resources

- freeCodeCamp / MDN (HTML/CSS/JS)
- Official Next.js Learn tutorial
- Supabase quickstarts
- A small SQL intro (`SELECT` / `INSERT` / `UPDATE` / `JOIN`)

---

## Step 9 — Suggested architecture for MVP

```text
[Printed QR]
    -> https://app/r/{restaurant}/t/{table}
        -> Customer Next.js pages
            -> Next.js API routes
                -> Postgres (menu, orders)
        <- Staff Next.js pages (password protected)
```

Optional later:

```text
Customer -> Stripe Checkout -> webhook -> mark order paid
Staff app -> realtime subscription (Supabase Realtime)
```

---

## Step 10 — Definition of “prototype done”

Your prototype is done when:

1. You can generate table QR codes
2. A phone can open the menu with no app install
3. An order is stored in a database with the correct table
4. A staff screen shows that order (auto-refresh every few seconds is fine)
5. Staff can mark it done
6. Someone who is not you can complete an order without instructions beyond “scan and tap”

---

## Concrete “start tomorrow” checklist

1. Write/keep this plan as your source of truth
2. Create a GitHub account and a Vercel account
3. Follow a “Deploy Next.js to Vercel” tutorial end-to-end
4. Hardcode a menu + cart on one page
5. Only then add Supabase/Neon and real orders

Do **not** begin with logo design, company paperwork, or payment integration.

---

## Optional no-code first experiment

If your goal is “show a restaurant owner next week,” you can prototype with:

- Glide / similar QR-menu tools
- Google Form menu (ugly but real)
- Notion/Airtable + QR to a shared page

Use that only to validate demand. Rebuild in Next.js once someone agrees to pilot.

---

## Bottom line

Start with a **mobile website**, not an app.

For MVP: **Next.js + hosted Postgres + staff login + QR URLs that encode restaurant/table + orders without online payment**.

Learn in this order: HTML/CSS/JS → Next.js → basic SQL → auth/deploy.

Build in thin slices: fake menu → real menu → real orders → staff board → QR pilot.

---
