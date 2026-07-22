---
name: MySQL drizzle has no .returning()
description: drizzle-orm MySQL driver omits .returning(); all mutations must re-fetch after write.
---

## Rule
Never call `.returning()` on INSERT/UPDATE/DELETE when using `@workspace/db-mysql`.

**Why:** MySQL protocol does not support `RETURNING`. The drizzle-orm mysql-core driver simply does not expose the method. The PG driver does.

**How to apply:**
- After `db.insert(...).values(...)`, use `db.select().from(...).where(eq(..., lastInsertId))` to get the inserted row.
- For UPDATE, re-fetch by the primary key after `db.update(...).set(...).where(...)`.
- `lastInsertId` is available from the mysql2 result if needed (raw query), but for Drizzle ORM inserts use re-fetch pattern.
- Already applied in `artifacts/api-server/src/routes/admin.ts` and `contact.ts`.
