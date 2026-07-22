/**
 * Unit tests for artifacts/api-server/src/lib/fileStorage.ts
 *
 * These tests use a temporary directory — no DB, no network, no external services.
 * Run: pnpm --filter @workspace/api-server run test
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import os from "os";

// We import after setting UPLOAD_ROOT so the module picks up the right root.
// Use a dynamic import inside each test to get the live module exports.

let tmpDir: string;

beforeEach(async () => {
  tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), "yemenici-test-"));
  process.env.UPLOAD_ROOT = tmpDir;
});

afterEach(async () => {
  delete process.env.UPLOAD_ROOT;
  await fs.rm(tmpDir, { recursive: true, force: true });
});

// Helper: fresh import (clears module cache side effects on getUploadRoot())
async function storage() {
  const mod = await import("../lib/fileStorage.js");
  return mod;
}

// ── saveFile ──────────────────────────────────────────────────────────────────

describe("saveFile", () => {
  it("writes a file and returns a key with the correct extension", async () => {
    const { saveFile } = await storage();
    const buf = Buffer.from("hello world");
    const result = await saveFile(buf, "image/webp", ".webp");

    expect(result.key).toMatch(/^uploads\/.+\.webp$/);
    expect(result.filename).toMatch(/^.+\.webp$/);
    expect(result.url).toMatch(/^\/api\/storage\/objects\/.+\.webp$/);

    // File must exist on disk
    const fullPath = path.join(tmpDir, result.key);
    const stat = await fs.stat(fullPath);
    expect(stat.isFile()).toBe(true);
    expect(stat.size).toBe(buf.length);
  });

  it("stores content correctly (atomic write)", async () => {
    const { saveFile } = await storage();
    const content = "atomic write test content";
    const buf = Buffer.from(content, "utf8");
    const result = await saveFile(buf, "image/png", ".png");

    const stored = await fs.readFile(path.join(tmpDir, result.key), "utf8");
    expect(stored).toBe(content);
  });

  it("leaves no .tmp files after successful write", async () => {
    const { saveFile } = await storage();
    await saveFile(Buffer.from("x"), "image/png", ".png");

    const entries = await fs.readdir(path.join(tmpDir, "uploads"));
    const tmpFiles = entries.filter((e) => e.endsWith(".tmp"));
    expect(tmpFiles).toHaveLength(0);
  });

  it("rejects unsupported MIME types", async () => {
    const { saveFile } = await storage();
    await expect(
      saveFile(Buffer.from("x"), "text/html", ".html"),
    ).rejects.toThrow(/Unsupported MIME type/);
  });

  it("allows PDF uploads", async () => {
    const { saveFile } = await storage();
    const result = await saveFile(Buffer.from("%PDF-1.4"), "application/pdf", ".pdf");
    expect(result.key).toMatch(/\.pdf$/);
  });
});

// ── readFile ──────────────────────────────────────────────────────────────────

describe("readFile", () => {
  it("reads an existing file and returns correct MIME type and size", async () => {
    const { saveFile, readFile } = await storage();
    const content = Buffer.from("read test");
    const saved = await saveFile(content, "image/jpeg", ".jpg");

    const result = await readFile(saved.filename);
    expect(result).not.toBeNull();
    expect(result!.mimeType).toBe("image/jpeg");
    expect(result!.size).toBe(content.length);
  });

  it("returns null for a missing file", async () => {
    const { readFile } = await storage();
    const result = await readFile("nonexistent-file-abc123.webp");
    expect(result).toBeNull();
  });

  it("rejects path traversal via directory separators", async () => {
    const { readFile } = await storage();
    // Attempt to traverse up — basename extraction should neutralise this
    const result = await readFile("../../../etc/passwd");
    // Should return null (file not found under uploads/) rather than serving system files
    expect(result).toBeNull();
  });

  it("ignores directory component in filename (uses only basename)", async () => {
    const { saveFile, readFile } = await storage();
    const saved = await saveFile(Buffer.from("test"), "image/png", ".png");

    // Supply an attacker-style path — only the basename part should be used
    const withPrefix = `uploads/${saved.filename}`;
    const result = await readFile(withPrefix);
    // readFile accepts "uploads/uuid.ext" as input, strips to basename, resolves to uploads/basename
    expect(result).not.toBeNull();
  });
});

// ── listFiles ─────────────────────────────────────────────────────────────────

describe("listFiles", () => {
  it("returns an empty array when no files exist", async () => {
    const { listFiles } = await storage();
    const files = await listFiles();
    expect(files).toHaveLength(0);
  });

  it("lists uploaded files sorted newest first", async () => {
    const { saveFile, listFiles } = await storage();
    await saveFile(Buffer.from("a"), "image/png", ".png");
    // Small delay to ensure different birthtime (on fast filesystems birthtime may be same second)
    await new Promise((r) => setTimeout(r, 50));
    await saveFile(Buffer.from("b"), "image/webp", ".webp");

    const files = await listFiles();
    expect(files.length).toBeGreaterThanOrEqual(2);
    // Most recent first
    const dates = files.map((f) => new Date(f.createdAt).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });

  it("excludes .tmp files", async () => {
    const { listFiles } = await storage();
    // Manually create a .tmp file
    const uploadsDir = path.join(tmpDir, "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, "orphan.webp.tmp"), "orphan");

    const files = await listFiles();
    expect(files.every((f) => !f.filename.endsWith(".tmp"))).toBe(true);
  });
});

// ── deleteFile ────────────────────────────────────────────────────────────────

describe("deleteFile", () => {
  it("deletes an existing file", async () => {
    const { saveFile, deleteFile, readFile } = await storage();
    const saved = await saveFile(Buffer.from("delete me"), "image/png", ".png");

    await deleteFile(saved.filename);

    const result = await readFile(saved.filename);
    expect(result).toBeNull();
  });

  it("silently succeeds when file does not exist", async () => {
    const { deleteFile } = await storage();
    await expect(deleteFile("ghost-file-xyz.webp")).resolves.toBeUndefined();
  });
});

// ── getUploadRoot ─────────────────────────────────────────────────────────────

describe("getUploadRoot", () => {
  it("throws a clear error when UPLOAD_ROOT is not set", async () => {
    delete process.env.UPLOAD_ROOT;
    const { getUploadRoot } = await storage();
    expect(() => getUploadRoot()).toThrow(/UPLOAD_ROOT/);
  });

  it("throws when UPLOAD_ROOT is a relative path", async () => {
    process.env.UPLOAD_ROOT = "relative/path/uploads";
    const { getUploadRoot } = await storage();
    expect(() => getUploadRoot()).toThrow(/absolute/i);
  });

  it("returns the root when UPLOAD_ROOT is an absolute path", async () => {
    // tmpDir is set to an absolute path in beforeEach
    const { getUploadRoot } = await storage();
    const root = getUploadRoot();
    expect(path.isAbsolute(root)).toBe(true);
    expect(root).toBe(tmpDir);
  });
});

// ── validateAndPrepareUploadRoot ───────────────────────────────────────────────

describe("validateAndPrepareUploadRoot", () => {
  it("creates the uploads directory when it does not exist", async () => {
    const { validateAndPrepareUploadRoot } = await storage();
    await validateAndPrepareUploadRoot();
    const stat = await fs.stat(path.join(tmpDir, "uploads"));
    expect(stat.isDirectory()).toBe(true);
  });

  it("succeeds idempotently (safe to call multiple times)", async () => {
    const { validateAndPrepareUploadRoot } = await storage();
    await validateAndPrepareUploadRoot();
    await expect(validateAndPrepareUploadRoot()).resolves.toBeUndefined();
  });

  it("throws when UPLOAD_ROOT is not set", async () => {
    delete process.env.UPLOAD_ROOT;
    const { validateAndPrepareUploadRoot } = await storage();
    await expect(validateAndPrepareUploadRoot()).rejects.toThrow(/UPLOAD_ROOT/);
  });

  it("throws when UPLOAD_ROOT is a relative path", async () => {
    process.env.UPLOAD_ROOT = "relative/path";
    const { validateAndPrepareUploadRoot } = await storage();
    await expect(validateAndPrepareUploadRoot()).rejects.toThrow(/absolute/i);
  });
});
