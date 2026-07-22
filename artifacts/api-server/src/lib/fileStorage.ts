/**
 * Hostinger filesystem storage adapter.
 *
 * Activated when UPLOAD_ROOT env var is set.
 * Files are stored outside public_html using UUID-based names (no user input
 * in path). Path-traversal is prevented by resolving and prefix-checking every
 * path before any disk operation.
 *
 * Atomic writes: buffer → <name>.tmp → rename to <name>.
 */

import fs from "fs/promises";
import fsSync from "fs";
import path from "path";
import { randomUUID } from "crypto";

// ── MIME validation ────────────────────────────────────────────────────────

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
  "image/bmp",
  "image/tiff",
]);

const EXT_TO_MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".bmp": "image/bmp",
  ".tiff": "image/tiff",
  ".pdf": "application/pdf",
};

export function mimeFromExt(ext: string): string {
  return EXT_TO_MIME[ext.toLowerCase()] ?? "application/octet-stream";
}

// ── Root resolution ────────────────────────────────────────────────────────

export function getUploadRoot(): string {
  const root = process.env.UPLOAD_ROOT;
  if (!root) {
    throw new Error(
      "UPLOAD_ROOT must be set for filesystem storage mode. " +
        "Example: UPLOAD_ROOT=/home/user/domains/example.com/private_uploads",
    );
  }
  return path.resolve(root);
}

/**
 * Resolve a relative key to an absolute path and verify it stays within
 * UPLOAD_ROOT (path-traversal prevention).
 *
 * @param relKey - e.g. "uploads/uuid.webp"
 * @throws if the resolved path would escape UPLOAD_ROOT
 */
function securePath(relKey: string): string {
  const root = getUploadRoot();
  const resolved = path.resolve(root, relKey);

  // Must start with root + separator (prevents root == resolved escape)
  if (!resolved.startsWith(root + path.sep) && resolved !== root) {
    throw new Error(`Path traversal rejected: "${relKey}"`);
  }
  return resolved;
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface SavedFile {
  /** Relative key stored in DB, e.g. "uploads/550e8400-...-.webp" */
  key: string;
  /** Express-serving URL, e.g. "/api/storage/objects/550e8400-...-.webp" */
  url: string;
  /** Bare filename, e.g. "550e8400-...-.webp" */
  filename: string;
}

/**
 * Save a buffer to the upload directory atomically.
 *
 * @param buffer      Raw file bytes
 * @param mimeType    MIME type string (validated by multer before reaching here)
 * @param ext         File extension including dot, e.g. ".webp"
 * @param allowedMimes  Set of permitted MIME types; defaults to image types
 */
export async function saveFile(
  buffer: Buffer,
  mimeType: string,
  ext: string,
  allowedMimes: Set<string> = ALLOWED_IMAGE_TYPES,
): Promise<SavedFile> {
  if (!allowedMimes.has(mimeType) && mimeType !== "application/pdf") {
    throw new Error(`Unsupported MIME type: ${mimeType}`);
  }

  const uuid = randomUUID();
  const filename = `${uuid}${ext}`;
  const relKey = `uploads/${filename}`;
  const fullPath = securePath(relKey);

  // Ensure the uploads sub-directory exists
  await fs.mkdir(path.dirname(fullPath), { recursive: true });

  // Atomic write: write to .tmp then rename
  const tmpPath = `${fullPath}.${Date.now()}.tmp`;
  try {
    await fs.writeFile(tmpPath, buffer);
    await fs.rename(tmpPath, fullPath);
  } catch (err) {
    await fs.unlink(tmpPath).catch(() => undefined);
    throw err;
  }

  return {
    key: relKey,
    filename,
    url: `/api/storage/objects/${filename}`,
  };
}

export interface FileInfo {
  /** Relative key, e.g. "uploads/uuid.webp" */
  key: string;
  filename: string;
  size: number;
  createdAt: string; // ISO-8601
  mimeType: string;
}

/**
 * List files in the "uploads/" sub-directory. Skips temp files (.tmp suffix).
 */
export async function listFiles(): Promise<FileInfo[]> {
  const root = getUploadRoot();
  const dir = path.join(root, "uploads");

  // Let TS infer: readdir with withFileTypes:true returns Dirent<string>[]
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const results: FileInfo[] = [];
  for (const entry of entries) {
    if (!entry.isFile() || entry.name.endsWith(".tmp")) continue;
    const fullPath = path.join(dir, entry.name);
    try {
      const stat = await fs.stat(fullPath);
      const ext = path.extname(entry.name).toLowerCase();
      results.push({
        key: `uploads/${entry.name}`,
        filename: entry.name,
        size: stat.size,
        createdAt: (stat.birthtime ?? stat.ctime).toISOString(),
        mimeType: mimeFromExt(ext),
      });
    } catch {
      // skip unreadable entries
    }
  }

  return results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export interface ReadableFile {
  stream: fsSync.ReadStream;
  mimeType: string;
  size: number;
}

/**
 * Open a file for streaming. Returns null if the file does not exist.
 *
 * @param filename  Bare filename only — directory component is ignored to
 *                  prevent traversal via the filename parameter.
 */
export async function readFile(filename: string): Promise<ReadableFile | null> {
  // Accept only the basename — discard any directory part supplied by caller
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename === "." || safeFilename === "..") {
    return null;
  }

  let fullPath: string;
  try {
    fullPath = securePath(`uploads/${safeFilename}`);
  } catch {
    return null;
  }

  let stat: Awaited<ReturnType<typeof fs.stat>>;
  try {
    stat = await fs.stat(fullPath);
  } catch {
    return null;
  }

  if (!stat.isFile()) return null;

  const ext = path.extname(safeFilename).toLowerCase();
  const mimeType = mimeFromExt(ext);
  const stream = fsSync.createReadStream(fullPath);

  return { stream, mimeType, size: stat.size };
}

/**
 * Delete a file by filename. Silently ignores missing files.
 *
 * @param filename  Bare filename only.
 */
export async function deleteFile(filename: string): Promise<void> {
  const safeFilename = path.basename(filename);
  if (!safeFilename || safeFilename === "." || safeFilename === "..") return;

  let fullPath: string;
  try {
    fullPath = securePath(`uploads/${safeFilename}`);
  } catch {
    return;
  }

  await fs.unlink(fullPath).catch(() => undefined);
}
