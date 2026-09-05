# qr-menu

QR-code restaurant ordering: customers scan a table QR code, open a mobile menu, and place orders for kitchen/staff.

See [PLAN.md](./PLAN.md) for the full MVP plan.

## Stack

- **Next.js** (App Router) — UI + API routes in one project
- **TypeScript** + **Tailwind CSS**
- Later: hosted Postgres (Supabase or Neon), Vercel deploy

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Purpose              |
| --------------- | -------------------- |
| `npm run dev`   | Local development    |
| `npm run build` | Production build     |
| `npm run start` | Run production build |
| `npm run lint`  | ESLint               |

## Planned routes (from PLAN.md)

| Route            | Purpose                         |
| ---------------- | ------------------------------- |
| `/r/demo/t/7`    | Customer menu for table 7       |
| `/staff/orders`  | Kitchen / waiter order board    |
| `/admin/menu`    | Simple menu item editor         |

## Current phase

**Phase A** — empty working Next.js site. Next: deploy to Vercel, then Phase B (hardcoded menu + cart).
