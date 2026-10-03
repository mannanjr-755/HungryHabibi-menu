# HungryHabibi — Digital Menu

Premium gold-accent digital menu + kitchen dashboard for **HungryHabibi**.

## Project structure

```
HungryHabibi-menu/
├── frontend/     # Next.js app (UI + `/api/*` route handlers)
├── backend/      # Prisma schema, seed, and server libraries
├── package.json  # Root scripts — `npm run dev` starts the app
└── .env          # Shared environment config (not committed)
```

Production URL: https://hungryhabibi-menu.vercel.app  
The API is served from the same Next.js deployment at `/api/*`.

## Quick start

```bash
npm install
cp .env.example .env   # set DATABASE_URL + AUTH_SECRET
npm run db:push
npm run db:seed
npm run dev
```

Requires a PostgreSQL database (Neon recommended). Set `DATABASE_URL` in `.env`.

This starts the full app at http://localhost:3000 (customer menu, admin UI, and API).

## Demo

| Role | URL / credentials |
|------|-------------------|
| Customer menu (Table 12) | http://localhost:3000/r/hungryhabibi/t/12 |
| Staff login | http://localhost:3000/admin/login |
| Admin | `admin@hungryhabibi.com` / `password123` |

## Brand

- Restaurant: **HungryHabibi** (slug `hungryhabibi`)
- Theme: charcoal background, metallic gold accents, Cormorant + DM Sans
- Currency: Rs.

## Environment variables

See `.env.example`. Never commit real secrets. On Vercel (Root Directory: `frontend`), set:

- `DATABASE_URL`
- `AUTH_SECRET`
- `AUTH_URL` / `NEXT_PUBLIC_APP_URL` (production site URL)
- `AUTH_TRUST_HOST=true`
- `NEXT_PUBLIC_CRM_URL` (optional)
- `BLOB_READ_WRITE_TOKEN` (optional, for image uploads)
