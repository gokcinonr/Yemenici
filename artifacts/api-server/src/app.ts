import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import path from "path";
import fs from "fs";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// ── Public directory (module-relative so it works regardless of cwd) ─────────
// In production: __dirname = artifacts/api-server/dist/
// → publicDir   = artifacts/api-server/public/
const publicDir = path.join(__dirname, "..", "public");
const uploadsDir = path.join(publicDir, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// ── Logging ───────────────────────────────────────────────────────────────────
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return { id: req.id, method: req.method, url: req.url?.split("?")[0] };
      },
      res(res) {
        return { statusCode: res.statusCode };
      },
    },
  }),
);

// ── CORS / body parsing ───────────────────────────────────────────────────────
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Session ───────────────────────────────────────────────────────────────────
const isProd = process.env.NODE_ENV === "production";
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yemenici-admin-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
      secure: isProd,
      sameSite: isProd ? "strict" : "lax",
    },
  }),
);

// ── API routes ────────────────────────────────────────────────────────────────
app.use("/api/uploads", express.static(uploadsDir));
app.use("/api", router);

// ── Admin SPA (production only — in dev, Vite serves it on its own port) ─────
const adminDist = path.join(publicDir, "admin");
if (fs.existsSync(adminDist)) {
  app.use("/admin", express.static(adminDist));
  app.get("/admin/*splat", (_req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });
}

// ── Yemenici SPA (catch-all — must be last) ───────────────────────────────────
const yemeniciDist = path.join(publicDir, "yemenici");
if (fs.existsSync(yemeniciDist)) {
  app.use(express.static(yemeniciDist));
  app.get("*splat", (_req, res) => {
    res.sendFile(path.join(yemeniciDist, "index.html"));
  });
}

export default app;
