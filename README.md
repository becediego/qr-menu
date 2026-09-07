# qr-menu

QR-code restaurant ordering: customers scan a table QR code, open a mobile menu, and place orders for kitchen/staff.

See [PLAN.md](./PLAN.md) for the full MVP plan.

## Stack

- **Next.js** (App Router) — UI + API routes in one project
- **TypeScript** + **Tailwind CSS**
- **Vercel** — hosting / deploy from GitHub
- **Supabase** — hosted Postgres (menu from DB; orders next)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then try the demo menu at [http://localhost:3000/r/demo/t/7](http://localhost:3000/r/demo/t/7).

## Scripts

| Command         | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Local development    |
| `npm run build` | Production build     |
| `npm run start` | Run production build |
| `npm run lint`  | ESLint               |

## Routes

| Route           | Status                          | Purpose                      |
| --------------- | ------------------------------- | ---------------------------- |
| `/`             | Done                            | Project home / phase status  |
| `/r/demo/t/7`   | Done (Phase C)                  | Customer menu from DB + cart |
| `/staff/orders` | Planned                         | Kitchen / waiter order board |
| `/admin/menu`   | Planned                         | Simple menu item editor      |

## Current phase

**Phase A** ✅ — Next.js app on GitHub + Vercel  
**Phase B** ✅ — Hardcoded menu, in-browser cart, place order shows cart JSON  
**Phase C** ✅ — Supabase tables + seed data; menu page fetches from DB  

**Next: Phase D** — save orders to the DB and build the staff order board.
