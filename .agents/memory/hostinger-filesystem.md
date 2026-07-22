---
name: Hostinger filesystem storage adapter
description: How file storage switches between filesystem (Hostinger) and GCS (Replit) at runtime.
---

## Rule
Set `UPLOAD_ROOT` → activates `fileStorage.ts` (local filesystem, atomic write).
Absent → activates `objectStorage.ts` (GCS via Replit-managed sidecar).

**Why:** Hostinger managed Node.js hosting has no GCS auth sidecar. Files must be stored on the server filesystem outside public_html.

**How to apply:**
- `saveFile()` writes to `$UPLOAD_ROOT/uploads/<uuid>.<ext>` atomically (write to `.tmp`, then `fs.rename`).
- `readFile(filename)` strips to `path.basename()` only — no directory component allowed, prevents path traversal.
- `UPLOAD_ROOT` must be set outside `public_html` so files are not web-accessible directly.
- Supported MIME types: image/jpeg, image/png, image/webp, image/gif, image/svg+xml, application/pdf.
- `getUploadRoot()` throws `Error: UPLOAD_ROOT env var is not set` if the variable is missing — explicit failure, no silent fallback.
