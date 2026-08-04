import { randomUUID } from "node:crypto";
import { unlink } from "node:fs/promises";
import { extname, join } from "node:path";

import { Router } from "express";
import multer from "multer";

import { env } from "../../config/env.js";
import { query } from "../../db/pool.js";
import { requireAuth } from "../../middleware/requireAuth.js";
import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { isUuid } from "../../utils/isUuid.js";
import { slugify } from "../../utils/slugify.js";

const ALLOWED = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/svg+xml",
]);

const MAX_BYTES = 5 * 1024 * 1024;

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, env.uploadsDir),
  filename: (_req, file, cb) => {
    // Never trust the client's filename on disk — keep a readable stem for
    // humans, but guarantee uniqueness and a safe extension ourselves.
    const stem = slugify(file.originalname.replace(/\.[^.]+$/, "")) || "image";
    const ext = extname(file.originalname).toLowerCase().slice(0, 10);
    cb(null, `${stem}-${randomUUID().slice(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      cb(ApiError.badRequest(`Unsupported file type "${file.mimetype}"`));
      return;
    }
    cb(null, true);
  },
});

const toApi = (row) => ({
  id: row.id,
  filename: row.filename,
  originalName: row.original_name,
  mimeType: row.mime_type,
  sizeBytes: row.size_bytes,
  url: row.url,
  altText: row.alt_text,
  createdAt: row.created_at,
});

const router = Router();
router.use(requireAuth);

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const { rows } = await query(
      `SELECT id, filename, original_name, mime_type, size_bytes, url, alt_text, created_at
         FROM media ORDER BY created_at DESC`
    );
    res.json({ success: true, data: rows.map(toApi) });
  })
);

router.post(
  "/",
  upload.single("file"),
  asyncHandler(async (req, res) => {
    if (!req.file) throw ApiError.badRequest("No file received — send it as `file`");

    const url = `${env.publicUrl}/uploads/${req.file.filename}`;

    const { rows } = await query(
      `INSERT INTO media (filename, original_name, mime_type, size_bytes, url, alt_text, uploaded_by)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id, filename, original_name, mime_type, size_bytes, url, alt_text, created_at`,
      [
        req.file.filename,
        req.file.originalname.slice(0, 255),
        req.file.mimetype,
        req.file.size,
        url,
        req.body?.altText ? String(req.body.altText).slice(0, 300) : null,
        req.user.id,
      ]
    );

    res.status(201).json({ success: true, data: toApi(rows[0]) });
  })
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!isUuid(req.params.id)) throw ApiError.notFound("File not found");

    const { rows } = await query("DELETE FROM media WHERE id = $1 RETURNING filename", [
      req.params.id,
    ]);

    if (!rows.length) throw ApiError.notFound("File not found");

    // The row is the source of truth; a missing file on disk must not fail the
    // request, or a half-deleted upload could never be cleared.
    await unlink(join(env.uploadsDir, rows[0].filename)).catch(() => {});

    res.json({ success: true, message: "Deleted" });
  })
);

export default router;
