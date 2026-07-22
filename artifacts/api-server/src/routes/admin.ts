import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { eq, and, desc } from "drizzle-orm";
import {
  db,
  adminUsersTable,
  siteContentTable,
  contactSubmissionsTable,
} from "../lib/database";
import * as fileStorage from "../lib/fileStorage";
import { objectStorageClient } from "../lib/objectStorage";

const router = Router();

// ── Storage mode detection ─────────────────────────────────────────────────
// UPLOAD_ROOT set → Hostinger filesystem storage
// Otherwise       → GCS (Replit or standard service-account)
const useFilesystem = Boolean(process.env.UPLOAD_ROOT);

// ── GCS helpers (Replit / GCS path) ──────────────────────────────────────

function parsePrivateDir(): { bucketName: string; prefix: string } {
  const dir = process.env.PRIVATE_OBJECT_DIR || "";
  const normalized = dir.startsWith("/") ? dir.slice(1) : dir;
  const idx = normalized.indexOf("/");
  const bucketName = idx >= 0 ? normalized.slice(0, idx) : normalized;
  const prefix = idx >= 0 ? normalized.slice(idx + 1) : "";
  return { bucketName, prefix };
}

async function uploadToGCS(
  buffer: Buffer,
  contentType: string,
  ext: string,
): Promise<{ url: string; filename: string }> {
  const { bucketName, prefix } = parsePrivateDir();
  const { randomUUID } = await import("crypto");
  const uuid = randomUUID();
  const objectName = prefix
    ? `${prefix}/uploads/${uuid}${ext}`
    : `uploads/${uuid}${ext}`;

  await objectStorageClient
    .bucket(bucketName)
    .file(objectName)
    .save(buffer, { metadata: { contentType }, resumable: false });

  const entityId = `uploads/${uuid}${ext}`;
  return {
    url: `/api/storage/objects/${entityId}`,
    filename: `${uuid}${ext}`,
  };
}

// ── Unified upload dispatcher ──────────────────────────────────────────────

async function uploadToStorage(
  buffer: Buffer,
  mimeType: string,
  ext: string,
): Promise<{ url: string; filename: string }> {
  if (useFilesystem) {
    const result = await fileStorage.saveFile(buffer, mimeType, ext);
    return { url: result.url, filename: result.filename };
  }
  return uploadToGCS(buffer, mimeType, ext);
}

// ── Multer (memory only — no disk writes) ─────────────────────────────────

const memStorage = multer.memoryStorage();

const upload = multer({
  storage: memStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

const pdfUploadMiddleware = multer({
  storage: memStorage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

function requireAuth(req: any, res: any, next: any) {
  if (req.session?.adminId) return next();
  res.status(401).json({ error: "Unauthorized" });
}

// ── Auth ──────────────────────────────────────────────────────────────────

router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };
    if (!username || !password) {
      res.status(400).json({ error: "Username and password required" });
      return;
    }
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, username))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }
    req.session.adminId = user.id;
    req.session.adminUsername = user.username;
    res.json({ ok: true, username: user.username });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.json({ ok: true });
  });
});

router.get("/admin/me", (req, res) => {
  if (!req.session?.adminId) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json({ username: req.session.adminUsername });
});

// ── Content ───────────────────────────────────────────────────────────────
// NOTE: .returning() is not supported by MySQL Drizzle.
// All mutations use explicit re-fetch after insert/update.

router.post("/admin/content", requireAuth, async (req, res) => {
  try {
    const { section, key, value } = req.body as {
      section: string;
      key: string;
      value: string;
    };
    const existing = await db
      .select()
      .from(siteContentTable)
      .where(eq(siteContentTable.section, section))
      .limit(1000);
    const row = existing.find((r: any) => r.key === key);

    if (row) {
      await db
        .update(siteContentTable)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteContentTable.id, row.id));
      const [updated] = await db
        .select()
        .from(siteContentTable)
        .where(eq(siteContentTable.id, row.id))
        .limit(1);
      res.json(updated);
    } else {
      await db
        .insert(siteContentTable)
        .values({ section, key, value, label: "" });
      const [created] = await db
        .select()
        .from(siteContentTable)
        .where(
          and(
            eq(siteContentTable.section, section),
            eq(siteContentTable.key, key),
          ),
        )
        .limit(1);
      res.json(created);
    }
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/admin/content/:id", requireAuth, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { value } = req.body as { value: string };
    await db
      .update(siteContentTable)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteContentTable.id, id));
    const [updated] = await db
      .select()
      .from(siteContentTable)
      .where(eq(siteContentTable.id, id))
      .limit(1);
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Image upload ──────────────────────────────────────────────────────────

router.post(
  "/admin/upload",
  requireAuth,
  upload.single("file"),
  async (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    try {
      const ext = path.extname(req.file.originalname).toLowerCase();
      const result = await uploadToStorage(
        req.file.buffer,
        req.file.mimetype,
        ext,
      );
      res.json(result);
    } catch (err) {
      req.log.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

// ── PDF upload ────────────────────────────────────────────────────────────

router.post(
  "/admin/upload-pdf",
  requireAuth,
  pdfUploadMiddleware.single("file"),
  async (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    try {
      const result = await uploadToStorage(
        req.file.buffer,
        "application/pdf",
        ".pdf",
      );
      res.json(result);
    } catch (err) {
      req.log.error(err);
      res.status(500).json({ error: "Upload failed" });
    }
  },
);

// ── Media library ─────────────────────────────────────────────────────────

router.get("/admin/media", requireAuth, async (req, res) => {
  try {
    if (useFilesystem) {
      const IMAGE_RE = /\.(png|jpe?g|gif|webp|svg|bmp|tiff?)$/i;
      const files = await fileStorage.listFiles();
      const media = files
        .filter((f) => IMAGE_RE.test(f.filename))
        .map((f) => ({
          filename: f.filename,
          url: `/api/storage/objects/${f.filename}`,
          size: f.size,
          createdAt: f.createdAt,
        }));
      res.json(media);
      return;
    }

    // GCS path
    const { bucketName, prefix } = parsePrivateDir();
    const gcsPrefix = prefix ? `${prefix}/uploads/` : "uploads/";
    const bucket = objectStorageClient.bucket(bucketName);
    const [files] = await bucket.getFiles({ prefix: gcsPrefix });

    const IMAGE_RE = /\.(png|jpe?g|gif|webp|svg|bmp|tiff?)$/i;
    const media = files
      .filter((f) => IMAGE_RE.test(f.name))
      .map((f) => {
        const entityId = prefix ? f.name.slice(prefix.length + 1) : f.name;
        const uuidPart = path.basename(f.name);
        return {
          filename: uuidPart,
          url: `/api/storage/objects/${entityId}`,
          size: Number(f.metadata?.size ?? 0),
          createdAt: f.metadata?.timeCreated ?? new Date().toISOString(),
        };
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    res.json(media);
  } catch (err) {
    req.log.error(err);
    res.json([]);
  }
});

// ── Media delete ──────────────────────────────────────────────────────────

router.delete("/admin/media/:filename", requireAuth, async (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    if (useFilesystem) {
      await fileStorage.deleteFile(filename);
      res.json({ ok: true });
      return;
    }
    // GCS path
    const { bucketName, prefix } = parsePrivateDir();
    const objectName = prefix
      ? `${prefix}/uploads/${filename}`
      : `uploads/${filename}`;
    await objectStorageClient
      .bucket(bucketName)
      .file(objectName)
      .delete({ ignoreNotFound: true });
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Delete failed" });
  }
});

// ── Contact submissions ───────────────────────────────────────────────────

router.get("/admin/submissions", requireAuth, async (req, res) => {
  try {
    const submissions = await db
      .select()
      .from(contactSubmissionsTable)
      .orderBy(desc(contactSubmissionsTable.createdAt))
      .limit(50);
    res.json(submissions);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Site access (password gate) ───────────────────────────────────────────

router.post("/site-access", async (req, res) => {
  try {
    const { password } = req.body as { password: string };
    if (!password) {
      res.status(400).json({ error: "Password required" });
      return;
    }
    const [user] = await db
      .select()
      .from(adminUsersTable)
      .where(eq(adminUsersTable.username, "admin"))
      .limit(1);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      res.status(401).json({ error: "Invalid password" });
      return;
    }
    res.json({ ok: true });
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ── Public content ────────────────────────────────────────────────────────

router.get("/content", async (req, res) => {
  try {
    const rows = await db.select().from(siteContentTable);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
