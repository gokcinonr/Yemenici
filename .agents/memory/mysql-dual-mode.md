---
name: MySQL dual-mode DB adapter
description: How the DB adapter selects MySQL vs PostgreSQL at runtime, and why db is typed as any.
---

## Rule
Set `MYSQL_DATABASE_URL` → loads `@workspace/db-mysql` (mysql2 driver).
Absent → loads `@workspace/db` (PG/Supabase driver, uses `SUPABASE_DATABASE_URL` then `DATABASE_URL`).

**Why:** Same codebase must run on Replit (PG+GCS) and Hostinger (MySQL+filesystem). Dynamic import at startup selects the correct driver.

**How to apply:** See `artifacts/api-server/src/lib/database.ts`. Adapter uses top-level await + dynamic import. `db` is exported as `any` because `PgDatabase | MySql2Database` has incompatible TypeScript method signatures — union is not useful here; the schema types diverge too. The tradeoff is loss of static query safety; mitigate by keeping route handlers simple.
