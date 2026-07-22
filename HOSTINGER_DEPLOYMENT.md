# Hostinger Deployment Guide — Yemenici

## 1. Required Hosting Type

**Hostinger Managed Node.js Web App** is sufficient.  
No VPS is required. All runtime dependencies are pure Node.js; there are no native binaries, Playwright, Chromium, WebSockets, or background workers.

---

## 2. Stack Summary

| Item | Value |
|---|---|
| Framework | Express 5 (API) + React 19 + Vite 7 (frontends) |
| Node.js version | **24** (minimum 22 LTS) |
| Package manager | pnpm 10.26.1 |
| Database | **MySQL 8.0** — Hostinger managed MySQL |
| File storage | **Hostinger filesystem** — `UPLOAD_ROOT` (absolute path outside `public_html`) |
| Build tool | esbuild (API) + Vite (frontends) |

> **Dual-mode design:** The same codebase runs on both Replit (PostgreSQL + GCS) and Hostinger (MySQL + filesystem). The active backend is selected at startup via environment variables (`MYSQL_DATABASE_URL` and `UPLOAD_ROOT`). The fallback is always PostgreSQL + GCS, so Replit continues to work during the Hostinger cutover.

---

## 3. Build Command

Run once on the server (or in Hostinger's build pipeline):

```bash
pnpm install --frozen-lockfile
pnpm run build
```

`pnpm run build` executes in order:
1. `pnpm --filter @workspace/yemenici run build` → `artifacts/yemenici/dist/public/`
2. `pnpm --filter @workspace/admin run build` → `artifacts/admin/dist/public/`
3. `pnpm --filter @workspace/api-server run build` → `artifacts/api-server/dist/index.mjs`

---

## 4. Start Command

```bash
pnpm run start
```

Which expands to:

```bash
NODE_ENV=production node --enable-source-maps artifacts/api-server/dist/index.mjs
```

In Hostinger's Node.js panel, set the **entry file** to:

```
artifacts/api-server/dist/index.mjs
```

---

## 5. Output Directory

| Artifact | Output path |
|---|---|
| Main website | `artifacts/yemenici/dist/public/` |
| Admin panel | `artifacts/admin/dist/public/` |
| API server bundle | `artifacts/api-server/dist/index.mjs` |

In production (`NODE_ENV=production`) the Express server automatically serves both
React builds as static files — no separate nginx config is needed:

- `https://yourdomain.com/` → Yemenici website (SPA)
- `https://yourdomain.com/admin/` → Admin panel (SPA)
- `https://yourdomain.com/api/` → REST API

---

## 6. Hostinger Runtime Environment Variables

Set these in hPanel → Node.js → Environment Variables (or in `.env` on the server).

### Required — Server

| Variable | Value | Notes |
|---|---|---|
| `PORT` | `3000` | Hostinger injects this automatically; defaults to 3000 if absent |
| `NODE_ENV` | `production` | Enables static file serving and JSON logs |
| `TRUST_PROXY` | `1` | Hostinger sits behind a load balancer |
| `SESSION_SECRET` | (random hex) | `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_PASSWORD` | (strong password) | Password for the admin panel |

> ⚠️ `NODE_ENV` and `PORT` are **separate variables**. `PORT` must be a number (e.g. `3000`), never the string `production`.

### Required — Database (MySQL)

| Variable | Value | Notes |
|---|---|---|
| `MYSQL_DATABASE_URL` | `mysql://DB_USER:PASS@localhost:3306/DB_NAME` | Uses Hostinger's **internal** host (`localhost`). Setting this activates MySQL mode. |

> Credentials in hPanel → Databases → MySQL Databases.

### Required — File Storage (filesystem)

| Variable | Value | Notes |
|---|---|---|
| `UPLOAD_ROOT` | `/home/USERNAME/domains/yourdomain.com/private_uploads` | Must be an **absolute path** outside `public_html`. Setting this activates filesystem mode. Directory is created automatically on first startup. |

### Optional

| Variable | Default | Notes |
|---|---|---|
| `LOG_LEVEL` | `info` | Pino log level: trace/debug/info/warn/error/fatal |

---

## 7. One-Time Migration Environment Variables

These variables are used **only** by the migration script — not by the running application.

```bash
SUPABASE_DATABASE_URL='postgresql://postgres.xxx:PASS@aws-0-eu-west-1.pooler.supabase.com:6543/postgres'
MYSQL_MIGRATION_DATABASE_URL='mysql://DB_USER:PASS@REMOTE_HOSTINGER_HOST:3306/DB_NAME'
```

> `MYSQL_MIGRATION_DATABASE_URL` uses Hostinger's **remote** MySQL hostname (visible in hPanel → Databases → Remote MySQL) so the script can connect from Replit or a local machine. This is a different host than `localhost` used by `MYSQL_DATABASE_URL`.

Run the migration:

```bash
# Dry run (reads from PG, prints plan, does NOT connect to MySQL):
SUPABASE_DATABASE_URL='...' MYSQL_MIGRATION_DATABASE_URL='...' \
  pnpm --filter @workspace/scripts run migrate-to-mysql

# Execute (actually writes to MySQL):
SUPABASE_DATABASE_URL='...' MYSQL_MIGRATION_DATABASE_URL='...' \
  pnpm --filter @workspace/scripts run migrate-to-mysql -- --execute
```

---

## 8. Database Setup

### 8a. Create the MySQL database

In hPanel → Databases → MySQL Databases:

1. Create database: e.g. `u123456789_yemenici`
2. Create database user: e.g. `u123456789_yemuser` with a strong password
3. Add user to database with **All Privileges**
4. Enable **Remote MySQL** access for your Replit/local IP (needed for migration only)

### 8b. Apply the schema

```bash
# Option A: From Replit or local machine using mysql client:
mysql -h REMOTE_HOSTINGER_HOST -u DB_USER -p DB_NAME < lib/db-mysql/migrations/0000_initial.sql

# Option B: hPanel → phpMyAdmin → Import
# File: lib/db-mysql/migrations/0000_initial.sql
```

The migration file is at `lib/db-mysql/migrations/0000_initial.sql`.

For future schema changes using drizzle-kit:

```bash
# From Hostinger (internal host):
MYSQL_DATABASE_URL='mysql://...' pnpm --filter @workspace/db-mysql run push

# From local machine (remote host):
MYSQL_MIGRATION_DATABASE_URL='mysql://...' pnpm --filter @workspace/db-mysql run push
```

### 8c. Migrate data from PostgreSQL

```bash
# Dry run first (no MySQL writes — safe to test):
SUPABASE_DATABASE_URL='postgresql://...' MYSQL_MIGRATION_DATABASE_URL='mysql://...' \
  pnpm --filter @workspace/scripts run migrate-to-mysql

# Execute the migration:
SUPABASE_DATABASE_URL='postgresql://...' MYSQL_MIGRATION_DATABASE_URL='mysql://...' \
  pnpm --filter @workspace/scripts run migrate-to-mysql -- --execute
```

Migration guarantees:
- Source PostgreSQL data is never modified or deleted
- Duplicate primary-key rows are skipped (not duplicated); schema/encoding/FK errors abort the migration
- Source IDs are preserved exactly (passwords, hashes, existing row IDs)
- `AUTO_INCREMENT` is reset above the largest migrated ID on each table

---

## 9. File Storage Setup

### 9a. Create the uploads directory

```bash
# SSH into Hostinger (or use hPanel File Manager):
mkdir -p /home/USERNAME/domains/yourdomain.com/private_uploads
chmod 750 /home/USERNAME/domains/yourdomain.com/private_uploads
```

The path must be **outside** `public_html` (or any directory served as static web content).

### 9b. Set UPLOAD_ROOT

```
UPLOAD_ROOT=/home/USERNAME/domains/yourdomain.com/private_uploads
```

On first startup the server creates the `uploads/` subdirectory and verifies write access. If UPLOAD_ROOT is not writable, the server exits immediately with a clear error message.

### 9c. Existing WebP files

Three existing WebP files stored in GCS use relative keys of the form `uploads/<uuid>.webp`.
To carry them over to Hostinger:

1. Download each file from GCS using the admin panel or gsutil
2. Place them in `UPLOAD_ROOT/uploads/<uuid>.webp` (preserving the filename exactly)
3. The database `url` column values (`/api/storage/objects/<uuid>.webp`) remain valid without any SQL update

---

## 10. Domain and Post-Deployment Testing Checklist

After pointing your domain to Hostinger and the app is live:

### Smoke tests

- [ ] `https://yourdomain.com/` — homepage loads with all images
- [ ] `https://yourdomain.com/solutions` — SPA routing works
- [ ] `https://yourdomain.com/quality/certification` — nested SPA route works
- [ ] `https://yourdomain.com/api/healthz` — returns `{"status":"ok"}`
- [ ] `https://yourdomain.com/admin/` — admin login page loads
- [ ] Admin login with configured `ADMIN_PASSWORD`
- [ ] Upload an image from the admin panel → image appears on the site
- [ ] Contact form submission → appears in admin panel

### Security

- [ ] `GET /api/storage/objects/../../../etc/passwd` → 404
- [ ] `SESSION_SECRET` is not the default fallback value
- [ ] Uploaded files are not accessible under any public static URL (only via `/api/storage/objects/`)
- [ ] Admin session persists across page reloads; logout invalidates session

### Database

- [ ] Site content (navbar, page text) loads from MySQL
- [ ] Contact form submissions appear in the admin panel
- [ ] Admin login works with migrated password hash

### Storage

- [ ] Uploaded files stored in `UPLOAD_ROOT/uploads/`
- [ ] Images served with correct `Content-Type` headers

---

## 11. Why Managed Hosting Is Sufficient

This project does **not** require VPS because:

- ✅ Single Express process — no process manager (PM2/supervisor) needed
- ✅ No native Node.js addons (`bcryptjs` is pure JS, not `bcrypt`)
- ✅ No Playwright, Chromium, or headless browser
- ✅ No WebSockets
- ✅ No cron jobs or background queues
- ✅ All persistence is local (Hostinger MySQL DB + filesystem)
- ✅ No custom OS packages or system-level dependencies

---

## 12. Rollback Plan

If the Hostinger deployment encounters issues, the Replit environment (PostgreSQL + GCS) continues to work unchanged. The server falls back to PostgreSQL when `MYSQL_DATABASE_URL` is not set, and falls back to GCS when `UPLOAD_ROOT` is not set.

---

## Final Assessment

> **Ready to deploy** after completing these steps in order:
>
> 1. Create MySQL database and user in hPanel
> 2. Import `lib/db-mysql/migrations/0000_initial.sql` via phpMyAdmin
> 3. Enable Remote MySQL access, run migration tool with `--execute`
> 4. Disable Remote MySQL access after migration is confirmed
> 5. Create `UPLOAD_ROOT` directory outside `public_html`
> 6. Copy existing WebP files to `UPLOAD_ROOT/uploads/` (if any)
> 7. Set all runtime environment variables in hPanel (see Section 6)
> 8. `pnpm install --frozen-lockfile && pnpm run build`
> 9. Set entry point to `artifacts/api-server/dist/index.mjs`
> 10. Verify with smoke tests in Section 10
