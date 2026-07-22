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
| Package manager | pnpm 9+ |
| Database | **MySQL 8.0** — Hostinger managed MySQL |
| File storage | **Hostinger filesystem** — `UPLOAD_ROOT` outside `public_html` |
| Build tool | esbuild (API) + Vite (frontends) |

> **Dual-mode design:** The same codebase runs on both Replit (PostgreSQL + GCS) and Hostinger (MySQL + filesystem). The active backend is selected at startup via environment variables (`MYSQL_DATABASE_URL` and `UPLOAD_ROOT`).

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

## 6. Environment Variable Checklist

Copy `.env.example` and fill in every value marked **REQUIRED**.

### Server

| Variable | Required | Notes |
|---|---|---|
| `PORT` | ✅ REQUIRED | Hostinger injects this automatically |
| `NODE_ENV` | ✅ REQUIRED | Set to `production` |
| `TRUST_PROXY` | ✅ REQUIRED | Set to `1` (Hostinger runs behind a load balancer) |
| `SESSION_SECRET` | ✅ REQUIRED | Random 48-byte hex string (see generation command in `.env.example`) |
| `ADMIN_PASSWORD` | ✅ REQUIRED | Password for the admin panel default user |

### Database (MySQL — Hostinger mode)

| Variable | Required | Notes |
|---|---|---|
| `MYSQL_DATABASE_URL` | ✅ REQUIRED | Setting this activates MySQL mode. Format: `mysql://USER:PASS@HOST:PORT/DATABASE` |

> **When `MYSQL_DATABASE_URL` is set**, the server loads `@workspace/db-mysql` (mysql2 driver). PostgreSQL / Supabase variables are ignored entirely.

Hostinger MySQL connection string format:
```
mysql://CPANEL_USER_DB_USER:PASSWORD@localhost:3306/CPANEL_USER_DBNAME
```
Find credentials in hPanel → Databases → MySQL Databases.

### File Storage (filesystem — Hostinger mode)

| Variable | Required | Notes |
|---|---|---|
| `UPLOAD_ROOT` | ✅ REQUIRED | Absolute path **outside** `public_html`. Example: `/home/u123456789/domains/yourdomain.com/private_uploads` |

> **When `UPLOAD_ROOT` is set**, the server saves uploaded files to that directory. GCS variables are ignored entirely.

The directory is created automatically on first upload. Make sure the Node.js process has write permission to the parent directory.

### Optional

| Variable | Default | Notes |
|---|---|---|
| `LOG_LEVEL` | `info` | Pino log level: trace/debug/info/warn/error/fatal |

---

## 7. Database Setup

### 7a. Create the MySQL database

In hPanel → Databases → MySQL Databases:

1. Create database: e.g. `u123456789_yemenici`
2. Create user: e.g. `u123456789_yemuser` with a strong password
3. Add user to database with **All Privileges**

### 7b. Apply the schema

Run the migration SQL on the Hostinger MySQL server:

```bash
# Option A: From your local machine using mysql client
mysql -h HOSTINGER_MYSQL_HOST -u DB_USER -p DB_NAME < lib/db-mysql/migrations/0000_initial.sql

# Option B: From Hostinger hPanel → phpMyAdmin
# Import the file: lib/db-mysql/migrations/0000_initial.sql
```

The migration file is at `lib/db-mysql/migrations/0000_initial.sql`.

For future schema changes using drizzle-kit:

```bash
# Generate new migration files (requires MYSQL_DATABASE_URL to be set):
MYSQL_DATABASE_URL='mysql://...' pnpm --filter @workspace/db-mysql run generate

# Apply migrations:
MYSQL_DATABASE_URL='mysql://...' pnpm --filter @workspace/db-mysql run migrate
```

### 7c. Migrate data from PostgreSQL

Use the migration tool to copy data from the existing PostgreSQL/Supabase database:

```bash
# Dry run (prints what would be inserted without writing):
SUPABASE_DATABASE_URL='postgresql://...' MYSQL_DATABASE_URL='mysql://...' \
  pnpm --filter @workspace/scripts run migrate-to-mysql

# Execute the migration (actually writes to MySQL):
SUPABASE_DATABASE_URL='postgresql://...' MYSQL_DATABASE_URL='mysql://...' \
  pnpm --filter @workspace/scripts run migrate-to-mysql -- --execute
```

Safe to re-run — uses `INSERT IGNORE` (skips existing rows by primary key).

---

## 8. File Storage Setup

### 8a. Create the uploads directory

```bash
# SSH into Hostinger, create directory outside public_html:
mkdir -p /home/USERNAME/domains/yourdomain.com/private_uploads/uploads
chmod 755 /home/USERNAME/domains/yourdomain.com/private_uploads
```

### 8b. Set the environment variable

```bash
UPLOAD_ROOT=/home/USERNAME/domains/yourdomain.com/private_uploads
```

### 8c. Migrate existing GCS files (if any)

If media was previously stored in GCS, download and re-upload via the admin panel, or copy using gsutil + upload manually to the private_uploads directory with matching filenames.

> **Note:** `site_images` table was empty at the time of MySQL migration, so no image URL migration is needed. Images stored as URLs in `site_content` rows (e.g. nav boxes) will need to be re-uploaded via the admin panel after the Hostinger deploy.

---

## 9. Domain and Post-Deployment Testing Checklist

After pointing your domain to Hostinger and the app is live:

### Smoke tests

- [ ] `https://yourdomain.com/` — homepage loads with all images
- [ ] `https://yourdomain.com/solutions` — sub-page loads (SPA routing works)
- [ ] `https://yourdomain.com/quality/certification` — nested SPA route works
- [ ] `https://yourdomain.com/api/healthz` — returns `{"status":"ok"}`
- [ ] `https://yourdomain.com/admin/` — admin login page loads
- [ ] Admin login with configured `ADMIN_PASSWORD`
- [ ] Upload an image from the admin panel → image served from `/api/storage/objects/`
- [ ] Contact form submission → email sent (verify SMTP settings in admin)

### Session and security

- [ ] Admin session persists across page reloads
- [ ] Logging out invalidates the session
- [ ] `SESSION_SECRET` is not the default fallback value

### Database

- [ ] Site content (navbar, page text) loads from MySQL
- [ ] Contact form submissions appear in the admin panel

### Storage

- [ ] Uploaded files stored in `UPLOAD_ROOT/uploads/`
- [ ] Images served correctly with `Content-Type` headers
- [ ] Path traversal prevented (test: `GET /api/storage/objects/../../../etc/passwd` returns 404)

---

## 10. Why Managed Hosting Is Sufficient

This project does **not** require VPS because:

- ✅ Single Express process — no process manager (PM2/supervisor) configuration needed
- ✅ No native Node.js addons (`bcryptjs` is pure JS, not `bcrypt`)
- ✅ No Playwright, Chromium, or headless browser
- ✅ No WebSockets
- ✅ No cron jobs or background queues
- ✅ All persistence is local (Hostinger MySQL DB + filesystem)
- ✅ No custom OS packages or system-level dependencies

---

## 11. Rollback Plan

If the Hostinger deployment encounters issues, the Replit environment (PostgreSQL + GCS) continues to work unchanged. The database adapter (`src/lib/database.ts`) falls back to PostgreSQL when `MYSQL_DATABASE_URL` is not set, and the storage adapter falls back to GCS when `UPLOAD_ROOT` is not set.

---

## Final Assessment

> **Ready to deploy** after completing these steps:
>
> 1. Create MySQL database on Hostinger hPanel
> 2. Run `lib/db-mysql/migrations/0000_initial.sql` to create tables
> 3. Run the migration tool with `--execute` to copy PostgreSQL data to MySQL
> 4. Create `UPLOAD_ROOT` directory outside `public_html`
> 5. Set all required environment variables in Hostinger hPanel
> 6. Run `pnpm install --frozen-lockfile && pnpm run build`
> 7. Set entry point to `artifacts/api-server/dist/index.mjs`
