import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import session from "express-session";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "yemenici-admin-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000,
      // On Hostinger (HTTPS) set secure:true; locally keep false.
      secure: process.env.NODE_ENV === "production" && process.env.TRUST_PROXY === "1",
    },
  }),
);

// Legacy local-upload path (no-op on GCS setups — kept for backward compat).
app.use("/api/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// API routes
app.use("/api", router);

// ── Production static file serving ──────────────────────────────────────
// When NODE_ENV=production the Express server serves both React builds so
// no separate web-server (nginx) is needed on Hostinger managed hosting.
// Build outputs expected at (relative to CWD = monorepo root):
//   artifacts/yemenici/dist/public  → served at /
//   artifacts/admin/dist/public     → served at /admin
if (process.env.NODE_ENV === "production") {
  const root = process.cwd();

  // ── Admin panel ──────────────────────────────────────────────────────
  const adminDist = path.join(root, "artifacts/admin/dist/public");
  app.use("/admin", express.static(adminDist));
  // SPA fallback: any /admin/* that isn't a static asset gets index.html
  app.get(["/admin", "/admin/*path"], (_req, res) => {
    res.sendFile(path.join(adminDist, "index.html"));
  });

  // ── Main site ────────────────────────────────────────────────────────
  const yemeniciDist = path.join(root, "artifacts/yemenici/dist/public");
  app.use(express.static(yemeniciDist));
  // SPA fallback: any route that isn't a static asset or /api gets index.html
  app.get("/*path", (_req, res) => {
    res.sendFile(path.join(yemeniciDist, "index.html"));
  });
}

export default app;
