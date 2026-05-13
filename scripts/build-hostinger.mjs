#!/usr/bin/env node
/**
 * Hostinger production build script.
 * Uses only Node.js built-ins — no pre-installed deps needed.
 *
 * Called either:
 *   A) Directly:   node scripts/build-hostinger.mjs
 *   B) Via pnpm postinstall when NODE_ENV=production
 *
 * In case B, pnpm install already ran so we skip the install step.
 */
import { execSync } from "node:child_process";
import { cpSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

// True when called from a pnpm lifecycle script (postinstall)
const calledFromLifecycle = Boolean(process.env.npm_lifecycle_event);

function run(cmd, env = {}) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, {
    stdio: "inherit",
    cwd: root,
    env: { ...process.env, ...env },
  });
}

// ── 1. Ensure pnpm is available ──────────────────────────────────────────────
try {
  execSync("pnpm --version", { stdio: "pipe" });
  console.log("✓ pnpm found");
} catch {
  console.log("Installing pnpm globally...");
  run("npm install -g pnpm");
}

// ── 2. Install workspace dependencies (skip if called from postinstall) ──────
if (calledFromLifecycle) {
  console.log("✓ Skipping pnpm install (already done by lifecycle)");
} else {
  run("pnpm install --frozen-lockfile");
}

// ── 3. Build Yemenici (base path = /) ────────────────────────────────────────
run("pnpm --filter @workspace/yemenici run build", {
  PORT: "0",
  BASE_PATH: "/",
  NODE_ENV: "production",
});

// ── 4. Build Admin (base path = /admin/) ─────────────────────────────────────
run("pnpm --filter @workspace/admin run build", {
  PORT: "0",
  BASE_PATH: "/admin/",
  NODE_ENV: "production",
});

// ── 5. Build API server ───────────────────────────────────────────────────────
run("pnpm --filter @workspace/api-server run build");

// ── 6. Copy static files into api-server/public/ ────────────────────────────
const serverDir = join(root, "artifacts/api-server");
const publicDir = join(serverDir, "public");

const yemeniciDist = join(root, "artifacts/yemenici/dist/public");
const adminDist    = join(root, "artifacts/admin/dist/public");

mkdirSync(join(publicDir, "yemenici"), { recursive: true });
mkdirSync(join(publicDir, "admin"),    { recursive: true });
mkdirSync(join(publicDir, "uploads"),  { recursive: true });

cpSync(yemeniciDist, join(publicDir, "yemenici"), { recursive: true });
cpSync(adminDist,    join(publicDir, "admin"),    { recursive: true });

console.log("\n✅ Build complete!");
console.log("   Static files → artifacts/api-server/public/");
console.log("   Start server  → node artifacts/api-server/dist/index.mjs");
