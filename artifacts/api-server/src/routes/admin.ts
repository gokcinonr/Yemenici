import { Router } from "express";
import bcrypt from "bcryptjs";
import multer from "multer";
import path from "path";
import { db, adminUsersTable, siteContentTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const storage = multer.diskStorage({
  destination: path.join(process.cwd(), "public/uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only images allowed"));
  },
});

function requireAuth(req: any, res: any, next: any) {
  if (req.session?.adminId) return next();
  res.status(401).json({ error: "Unauthorized" });
}

router.post("/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body as { username: string; password: string };
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

router.get("/admin/me", requireAuth, (req, res) => {
  res.json({ username: req.session.adminUsername });
});

router.get("/admin/content", requireAuth, async (req, res) => {
  try {
    const rows = await db.select().from(siteContentTable);
    res.json(rows);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/admin/content", requireAuth, async (req, res) => {
  try {
    const { section, key, value, label } = req.body as {
      section: string; key: string; value: string; label?: string;
    };
    if (!section || !key) {
      res.status(400).json({ error: "section and key are required" });
      return;
    }
    const existing = await db
      .select()
      .from(siteContentTable)
      .where(eq(siteContentTable.section, section))
      .then((rows) => rows.find((r) => r.key === key));

    if (existing) {
      const [updated] = await db
        .update(siteContentTable)
        .set({ value: value ?? "", updatedAt: new Date() })
        .where(eq(siteContentTable.id, existing.id))
        .returning();
      res.json(updated);
      return;
    }

    const [created] = await db
      .insert(siteContentTable)
      .values({ section, key, value: value ?? "", label: label ?? key, updatedAt: new Date() })
      .returning();
    res.json(created);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/admin/content/:id", requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { value } = req.body as { value: string };
    const [updated] = await db
      .update(siteContentTable)
      .set({ value, updatedAt: new Date() })
      .where(eq(siteContentTable.id, id))
      .returning();
    res.json(updated);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/admin/upload",
  requireAuth,
  upload.single("file"),
  (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  },
);

const pdfUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files allowed"));
  },
});

router.post(
  "/admin/upload-pdf",
  requireAuth,
  pdfUpload.single("file"),
  (req: any, res: any) => {
    if (!req.file) return res.status(400).json({ error: "No file" });
    const url = `/api/uploads/${req.file.filename}`;
    res.json({ url, filename: req.file.filename });
  },
);

router.get("/admin/media", requireAuth, (_req, res) => {
  const fs = require("fs") as typeof import("fs");
  const uploadDir = path.join(process.cwd(), "public/uploads");
  try {
    const files = fs.readdirSync(uploadDir)
      .filter((f: string) => /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(f))
      .map((f: string) => {
        const stat = fs.statSync(path.join(uploadDir, f));
        return { filename: f, url: `/api/uploads/${f}`, size: stat.size, createdAt: stat.birthtime };
      })
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(files);
  } catch {
    res.json([]);
  }
});

router.delete("/admin/media/:filename", requireAuth, (req, res) => {
  const fs = require("fs") as typeof import("fs");
  const filename = path.basename(req.params.filename);
  const filePath = path.join(process.cwd(), "public/uploads", filename);
  try {
    if (require("fs").existsSync(filePath)) fs.unlinkSync(filePath);
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

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
