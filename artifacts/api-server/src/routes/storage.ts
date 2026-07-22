import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { z } from "zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { ObjectPermission } from "../lib/objectAcl";
import * as fileStorage from "../lib/fileStorage";

const RequestUploadUrlBody = z.object({
  name: z.string(),
  size: z.number(),
  contentType: z.string(),
});

const RequestUploadUrlResponse = z.object({
  uploadURL: z.string(),
  objectPath: z.string(),
  metadata: z.object({
    name: z.string(),
    size: z.number(),
    contentType: z.string(),
  }),
});

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// ── Storage mode detection ─────────────────────────────────────────────────
const useFilesystem = Boolean(process.env.UPLOAD_ROOT);

/**
 * POST /storage/uploads/request-url
 *
 * Request a presigned URL for file upload (GCS mode only).
 * In filesystem mode this endpoint is not available.
 */
router.post("/storage/uploads/request-url", async (req: Request, res: Response) => {
  if (useFilesystem) {
    res.status(501).json({
      error:
        "Presigned URLs are not supported in filesystem storage mode. " +
        "Upload files via POST /api/admin/upload instead.",
    });
    return;
  }

  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }

  try {
    const { name, size, contentType } = parsed.data;
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);

    res.json(
      RequestUploadUrlResponse.parse({
        uploadURL,
        objectPath,
        metadata: { name, size, contentType },
      }),
    );
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

/**
 * GET /storage/public-objects/*filePath
 *
 * Serve public assets from PUBLIC_OBJECT_SEARCH_PATHS (GCS mode only).
 */
router.get("/storage/public-objects/*filePath", async (req: Request, res: Response) => {
  if (useFilesystem) {
    // In filesystem mode public images are served as static files by the Vite
    // build — this route is only needed for GCS.
    res.status(404).json({ error: "File not found" });
    return;
  }

  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }

    const response = await objectStorageService.downloadObject(file);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

/**
 * GET /storage/objects/*path
 *
 * Serve uploaded files. In filesystem mode: reads from UPLOAD_ROOT.
 * In GCS mode: streams from the GCS bucket.
 *
 * Authorization: currently open (the admin panel is the primary consumer).
 * To add auth, wrap with requireAuth or check req.session before serving.
 */
router.get("/storage/objects/*path", async (req: Request, res: Response) => {
  if (useFilesystem) {
    try {
      // Extract bare filename — the wildcard may be "uploads/uuid.ext" or "uuid.ext"
      const raw = req.params.path;
      const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
      // Always use only the basename to prevent path traversal from the URL
      const filename = wildcardPath.includes("/")
        ? wildcardPath.split("/").pop()!
        : wildcardPath;

      const file = await fileStorage.readFile(filename);
      if (!file) {
        res.status(404).json({ error: "File not found" });
        return;
      }

      res.setHeader("Content-Type", file.mimeType);
      res.setHeader("Content-Length", String(file.size));
      res.setHeader("Cache-Control", "private, max-age=3600");
      file.stream.pipe(res);
    } catch (error) {
      req.log.error({ err: error }, "Error serving file");
      res.status(500).json({ error: "Failed to serve file" });
    }
    return;
  }

  // GCS path
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);

    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
