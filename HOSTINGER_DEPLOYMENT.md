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
| Database | PostgreSQL 17 — Supabase (external, stays external) |
| Object storage | Google Cloud Storage (GCS) |
| Build tool | esbuild (API) + Vite (frontends) |

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

### Database

| Variable | Required | Notes |
|---|---|---|
| `SUPABASE_DATABASE_URL` | ✅ REQUIRED | Supabase Transaction Pooler URL (port 6543). Format: `postgresql://USER:PASS@HOST:6543/postgres` |
| `DATABASE_URL` | fallback | Only used when `SUPABASE_DATABASE_URL` is absent |

> **The Supabase database stays external.** No database migration or provider
> change is needed; simply copy the connection string from the Supabase dashboard
> (Project Settings → Database → Transaction pooler).

### Server

| Variable | Required | Notes |
|---|---|---|
| `PORT` | ✅ REQUIRED | Hostinger injects this automatically |
| `NODE_ENV` | ✅ REQUIRED | Set to `production` |
| `TRUST_PROXY` | ✅ REQUIRED | Set to `1` (Hostinger runs behind a load balancer) |
| `SESSION_SECRET` | ✅ REQUIRED | Random 48-byte hex string (see generation command in `.env.example`) |
| `ADMIN_PASSWORD` | ✅ REQUIRED | Password for the admin panel default user |

### Google Cloud Storage

| Variable | Required | Notes |
|---|---|---|
| `PRIVATE_OBJECT_DIR` | ✅ REQUIRED | GCS path for private uploads. Format: `/bucket-name/prefix` |
| `PUBLIC_OBJECT_SEARCH_PATHS` | ✅ REQUIRED | Comma-separated GCS paths for public assets |
| `GCS_SERVICE_ACCOUNT_KEY` | ✅ REQUIRED* | Inline service-account JSON (preferred on Hostinger) |
| `GOOGLE_APPLICATION_CREDENTIALS` | alt | Path to service-account JSON file on disk |

*Use `GCS_SERVICE_ACCOUNT_KEY` (inline JSON) OR `GOOGLE_APPLICATION_CREDENTIALS` (file path) — not both.

### Optional

| Variable | Default | Notes |
|---|---|---|
| `LOG_LEVEL` | `info` | Pino log level: trace/debug/info/warn/error/fatal |

---

## 7. Database Migration Requirements

**No migration required.** The database (Supabase PostgreSQL) is externally hosted and
will remain unchanged. Schema is already deployed.

To apply future schema changes from development to production:

```bash
SUPABASE_DATABASE_URL='postgresql://...' pnpm --filter @workspace/db run push
```

> ⚠️ Run `drizzle-kit push` **before** deploying new server code that depends on
> the new schema.

---

## 8. Storage Migration Requirements

The current Replit setup uses a **Replit-managed GCS bucket** with a local
authentication sidecar (`http://127.0.0.1:1106`). This sidecar does not exist
on Hostinger.

### Steps to migrate storage

1. **Create a GCS bucket** in Google Cloud Console
   - Recommended region: `europe-west1` (closest to Supabase eu-west-1)
   - Uncheck "Public access prevention" if you need public assets

2. **Create a Service Account**
   - Grant role: **Storage Object Admin** (`roles/storage.objectAdmin`)
   - Grant role: **Service Account Token Creator** (`roles/iam.serviceAccountTokenCreator`) — needed for signed URL generation
   - Download the JSON key file

3. **Migrate existing files** from the Replit bucket to the new bucket:
   ```bash
   # Using gsutil with the old Replit credentials (run from Replit before closing)
   gsutil -m cp -r gs://replit-objstore-0bd0ac77-d9b1-4f7c-ba9c-6aaea8fd3ef0/** gs://your-new-bucket/
   ```

4. **Set environment variables** on Hostinger:
   ```
   PRIVATE_OBJECT_DIR=/your-new-bucket/private
   PUBLIC_OBJECT_SEARCH_PATHS=/your-new-bucket/public
   GCS_SERVICE_ACCOUNT_KEY=<paste entire contents of JSON key on one line>
   ```

5. **Update `site_images` table** if image URLs stored in the database reference
   the old Replit bucket path — run a SQL UPDATE to replace the old path prefix
   with the new one.

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
- [ ] Upload an image from the admin panel → image appears on the site
- [ ] Contact form submission → email sent (verify SMTP settings in admin)

### Session and security

- [ ] Admin session persists across page reloads
- [ ] Logging out invalidates the session
- [ ] `SESSION_SECRET` is not the default fallback value

### Database

- [ ] Site content (navbar, page text) loads from Supabase
- [ ] Contact form submissions appear in the admin panel

### Performance

- [ ] Static assets served with `Cache-Control` headers
- [ ] Images served from GCS with correct `Content-Type`

---

## 10. Why Managed Hosting Is Sufficient

This project does **not** require VPS because:

- ✅ Single Express process — no process manager (PM2/supervisor) configuration needed
- ✅ No native Node.js addons (`bcryptjs` is pure JS, not `bcrypt`)
- ✅ No Playwright, Chromium, or headless browser
- ✅ No WebSockets
- ✅ No cron jobs or background queues
- ✅ All persistence is external (Supabase DB + GCS)
- ✅ No custom OS packages or system-level dependencies

---

## Final Assessment

> **B — Ready after storage migration**
>
> The database (Supabase PostgreSQL) is already externally hosted and requires
> no changes. The only prerequisite before going live on Hostinger is:
>
> 1. Create a GCS bucket with a service account and set `GCS_SERVICE_ACCOUNT_KEY`.
> 2. Migrate existing media files from the Replit bucket to the new bucket.
> 3. Set all required environment variables listed in Section 6.
>
> Once those three steps are complete, `pnpm install && pnpm run build` followed
> by `pnpm run start` will bring the full application online.
