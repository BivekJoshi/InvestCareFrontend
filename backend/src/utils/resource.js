import { Router } from "express";

import { query } from "../db/pool.js";
import { requireAuth } from "../middleware/requireAuth.js";
import { ApiError } from "./ApiError.js";
import { asyncHandler } from "./asyncHandler.js";
import { coercePayload, rowToApi } from "./fields.js";
import { isUuid } from "./isUuid.js";
import { slugify } from "./slugify.js";

/**
 * Every content type in this CMS is the same shape: an ordered, publishable
 * list of rows. Rather than writing nine near-identical controllers, each
 * module declares its table and fields and gets the whole set of endpoints.
 *
 * Column names only ever come from the declaration below — never from request
 * data — so the interpolation used to build these statements cannot be
 * influenced by a caller. Values always travel as $n parameters.
 */
/**
 * node-pg turns a JavaScript array into a Postgres *array* literal (`{a,b}`),
 * which a jsonb column rejects. Anything object-shaped is handed over as JSON
 * text instead, and the column's own type does the parsing.
 */
const toSqlValue = (value) =>
  value !== null && typeof value === "object" ? JSON.stringify(value) : value;

export function defineResource({
  table,
  fields,
  orderBy = "position ASC, created_at ASC",
  slugFrom = null,
  publishable = true,
  searchable = [],
}) {
  const columns = Object.keys(fields);
  const selectList = ["id", ...columns, publishable ? "is_published" : null, "position", "created_at", "updated_at"]
    .filter(Boolean)
    .join(", ");

  const findById = async (id) => {
    if (!isUuid(id)) return null;
    const { rows } = await query(`SELECT ${selectList} FROM ${table} WHERE id = $1`, [id]);
    return rows[0] ?? null;
  };

  /** Keeps a slug unique by appending -2, -3 … only when it collides. */
  const uniqueSlug = async (base, ignoreId = null) => {
    const root = slugify(base) || "item";

    for (let attempt = 0; attempt < 50; attempt += 1) {
      const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
      const { rows } = await query(
        `SELECT 1 FROM ${table} WHERE slug = $1 AND ($2::uuid IS NULL OR id <> $2)`,
        [candidate, ignoreId]
      );
      if (!rows.length) return candidate;
    }

    throw ApiError.badRequest("Could not generate a unique slug — try a different name");
  };

  const list = async ({ publishedOnly = false, search = null } = {}) => {
    const where = [];
    const params = [];

    if (publishedOnly && publishable) where.push("is_published = TRUE");

    if (search && searchable.length) {
      params.push(`%${search}%`);
      where.push(`(${searchable.map((col) => `${col} ILIKE $${params.length}`).join(" OR ")})`);
    }

    const { rows } = await query(
      `SELECT ${selectList} FROM ${table}
       ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
       ORDER BY ${orderBy}`,
      params
    );

    return rows.map((row) => rowToApi(fields, row));
  };

  const create = async (payload) => {
    const values = coercePayload(fields, payload);

    if (slugFrom) {
      values.slug = await uniqueSlug(payload.slug || payload[slugFrom] || "");
    }

    if (publishable && typeof payload.isPublished === "boolean") {
      values.is_published = payload.isPublished;
    }

    // New rows land at the end of the list unless told otherwise.
    if (typeof payload.position === "number") {
      values.position = payload.position;
    } else {
      const { rows } = await query(`SELECT COALESCE(MAX(position), -1) + 1 AS next FROM ${table}`);
      values.position = rows[0].next;
    }

    const cols = Object.keys(values);
    const { rows } = await query(
      `INSERT INTO ${table} (${cols.join(", ")})
       VALUES (${cols.map((_, i) => `$${i + 1}`).join(", ")})
       RETURNING ${selectList}`,
      cols.map((col) => toSqlValue(values[col]))
    );

    return rowToApi(fields, rows[0]);
  };

  const update = async (id, payload) => {
    const existing = await findById(id);
    if (!existing) throw ApiError.notFound("Not found");

    const values = coercePayload(fields, payload, { partial: true });

    if (slugFrom && payload.slug) {
      values.slug = await uniqueSlug(payload.slug, id);
    }

    if (publishable && typeof payload.isPublished === "boolean") {
      values.is_published = payload.isPublished;
    }

    if (typeof payload.position === "number") values.position = payload.position;

    if (!Object.keys(values).length) return rowToApi(fields, existing);

    const cols = Object.keys(values);
    const { rows } = await query(
      `UPDATE ${table}
          SET ${cols.map((col, i) => `${col} = $${i + 1}`).join(", ")}
        WHERE id = $${cols.length + 1}
      RETURNING ${selectList}`,
      [...cols.map((col) => toSqlValue(values[col])), id]
    );

    return rowToApi(fields, rows[0]);
  };

  const remove = async (id) => {
    if (!isUuid(id)) throw ApiError.notFound("Not found");
    const { rowCount } = await query(`DELETE FROM ${table} WHERE id = $1`, [id]);
    if (!rowCount) throw ApiError.notFound("Not found");
  };

  /** Drag-and-drop reordering: the CMS sends the ids in their new order. */
  const reorder = async (ids) => {
    if (!Array.isArray(ids) || !ids.length) {
      throw ApiError.badRequest("Send an array of ids in their new order");
    }

    await query(
      `UPDATE ${table} AS t
          SET position = new_order.position
         FROM (SELECT UNNEST($1::uuid[]) AS id, GENERATE_SUBSCRIPTS($1::uuid[], 1) - 1 AS position) AS new_order
        WHERE t.id = new_order.id`,
      [ids]
    );

    return list();
  };

  /** Admin router — mounted under /api/admin, every route authenticated. */
  const adminRouter = () => {
    const router = Router();
    router.use(requireAuth);

    router.get(
      "/",
      asyncHandler(async (req, res) => {
        res.json({ success: true, data: await list({ search: req.query.q ?? null }) });
      })
    );

    router.post(
      "/reorder",
      asyncHandler(async (req, res) => {
        res.json({ success: true, data: await reorder(req.body?.ids) });
      })
    );

    router.get(
      "/:id",
      asyncHandler(async (req, res) => {
        const row = await findById(req.params.id);
        if (!row) throw ApiError.notFound("Not found");
        res.json({ success: true, data: rowToApi(fields, row) });
      })
    );

    router.post(
      "/",
      asyncHandler(async (req, res) => {
        res.status(201).json({ success: true, data: await create(req.body) });
      })
    );

    router.patch(
      "/:id",
      asyncHandler(async (req, res) => {
        res.json({ success: true, data: await update(req.params.id, req.body) });
      })
    );

    router.delete(
      "/:id",
      asyncHandler(async (req, res) => {
        await remove(req.params.id);
        res.json({ success: true, message: "Deleted" });
      })
    );

    return router;
  };

  return { table, fields, list, create, update, remove, reorder, findById, adminRouter };
}
