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
- **Navbar**: `src/app/components/Navbar.tsx` — full navbar with SOLUTIONS mega menu (3-col: overview / Production+Industries / Automotive+Industrial+Agriculture sub-links), and mobile accordion menu with full sitemap hierarchy
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
