# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Yemenici (`artifacts/yemenici`) — React + Vite + Tailwind v4
Rubber company website. Key architecture:
- **Routing**: wouter, `Router` base = `import.meta.env.BASE_URL` in `src/app/App.tsx`
- **Layout**: `src/app/components/Layout.tsx` — wraps all pages with `Navbar` + `Footer`
- **Navbar**: `src/app/components/Navbar.tsx` — dual mega menu navbar. SOLUTIONS (hover/click): Col1=Industries grid (Automotive/Industrial/Agriculture), Col2=Production double-height box (image top, title+desc bottom). QUALITY (hover/click): Certification + Laboratory & Testing boxes. Both menus use `activeMegaMenu: "solutions"|"quality"|null` state. Content dynamic via `useNavContent()` hook → `/api/content` with DB sections `nav_box_automotive/industrial/agriculture/production/certification/laboratory`. Mobile accordion unchanged.
- **Footer**: `src/app/components/Footer.tsx` — site tree (Solutions, Quality, Company, Contact), company address, T&C/Privacy links, LinkedIn
- **Pages**: `src/app/pages/PlaceholderPage.tsx` — generic "coming soon" template used for all sub-pages
- **Sitemap routes**: `/solutions`, `/solutions/production`, `/solutions/industries`, `/solutions/industries/automotive`, `/solutions/industries/industrial`, `/solutions/industries/agriculture`, `/quality`, `/quality/certification`, `/quality/laboratory-testing`, `/company`, `/company/about-us`, `/company/our-values`, `/contact`
- **Fonts**: Poppins via Google Fonts. Always use `style={{ fontFamily: "Poppins, sans-serif", fontWeight: N }}` — never Tailwind font class format
- **Navbar height**: 107px total (pt-[28px] + pill h-[79px]). MegaMenu/MobileMenu use `pt-[127px]`
- **Content API**: `useContent()` hook fetches from `/api/content` (section/key/value rows)

### Admin Panel (`artifacts/admin`) — React + Vite
Content management panel for Yemenici website. Communicates via `/api` routes.

### API Server (`artifacts/api-server`) — Express 5
Handles `/api/content`, `/api/uploads`, `/api/media` endpoints. PostgreSQL + Drizzle ORM.

## Database

**Provider**: Supabase (PostgreSQL 17) — Transaction Pooler, eu-west-1, port 6543

**Connection variable precedence** (`lib/db/src/index.ts`, `lib/db/drizzle.config.ts`):
1. `SUPABASE_DATABASE_URL` — canonical variable; set this in every environment (Replit dev + Hostinger prod)
2. `DATABASE_URL` — fallback only; Replit runtime-managed, points to legacy Replit DB (do not rely on it)

**Schema push** (dev): `DATABASE_URL=... pnpm --filter @workspace/db run push`
- Or override inline: `SUPABASE_DATABASE_URL='...' pnpm --filter @workspace/db run push`

**Tables**: `public.admin_users`, `public.site_content`, `public.site_images`
