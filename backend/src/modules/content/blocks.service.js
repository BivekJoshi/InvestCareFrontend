import { pool, query } from "../../db/pool.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Ordered lists of small blocks, partitioned by `group_key`.
 *
 * Roughly a dozen sections of the site are the same shape — a heading, a line
 * of copy, in a fixed order. They share this table so the CMS needs one list
 * editor instead of a dozen, and a new section needs no migration.
 */

const COLUMNS = "id, group_key, title, body, label, value, icon, position, is_published, created_at, updated_at";

const toApi = (row) => ({
  id: row.id,
  group: row.group_key,
  title: row.title,
  body: row.body,
  label: row.label,
  value: row.value,
  icon: row.icon,
  position: row.position,
  isPublished: row.is_published,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

const clean = (value) => {
  if (value === undefined || value === null) return null;
  const text = String(value).trim();
  return text.length ? text : null;
};

export async function listGroup(group, { publishedOnly = false } = {}) {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM content_blocks
      WHERE group_key = $1 ${publishedOnly ? "AND is_published = TRUE" : ""}
      ORDER BY position ASC, created_at ASC`,
    [group]
  );
  return rows.map(toApi);
}

/** Every group at once — used by the public site payload. */
export async function listAllGroups({ publishedOnly = false } = {}) {
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM content_blocks
      ${publishedOnly ? "WHERE is_published = TRUE" : ""}
      ORDER BY group_key ASC, position ASC, created_at ASC`
  );

  return rows.reduce((acc, row) => {
    (acc[row.group_key] ??= []).push(toApi(row));
    return acc;
  }, {});
}

export async function createBlock(group, payload) {
  if (!group) throw ApiError.badRequest("A group is required");

  const { rows: [{ next }] } = await query(
    "SELECT COALESCE(MAX(position), -1) + 1 AS next FROM content_blocks WHERE group_key = $1",
    [group]
  );

  const { rows } = await query(
    `INSERT INTO content_blocks (group_key, title, body, label, value, icon, position)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING ${COLUMNS}`,
    [
      group,
      clean(payload.title),
      clean(payload.body),
      clean(payload.label),
      clean(payload.value),
      clean(payload.icon),
      typeof payload.position === "number" ? payload.position : next,
    ]
  );

  return toApi(rows[0]);
}

export async function updateBlock(id, payload) {
  const allowed = { title: "title", body: "body", label: "label", value: "value", icon: "icon" };
  const sets = [];
  const params = [];

  for (const [key, column] of Object.entries(allowed)) {
    if (key in payload) {
      params.push(clean(payload[key]));
      sets.push(`${column} = $${params.length}`);
    }
  }

  if (typeof payload.isPublished === "boolean") {
    params.push(payload.isPublished);
    sets.push(`is_published = $${params.length}`);
  }

  if (typeof payload.position === "number") {
    params.push(payload.position);
    sets.push(`position = $${params.length}`);
  }

  if (!sets.length) throw ApiError.badRequest("Nothing to update");

  params.push(id);
  const { rows } = await query(
    `UPDATE content_blocks SET ${sets.join(", ")} WHERE id = $${params.length} RETURNING ${COLUMNS}`,
    params
  );

  if (!rows.length) throw ApiError.notFound("Block not found");
  return toApi(rows[0]);
}

export async function deleteBlock(id) {
  const { rowCount } = await query("DELETE FROM content_blocks WHERE id = $1", [id]);
  if (!rowCount) throw ApiError.notFound("Block not found");
}

/**
 * Replaces a whole group in one transaction — the natural fit for a CMS screen
 * where the editor adds, edits, reorders and removes rows, then hits Save once.
 */
export async function replaceGroup(group, items) {
  if (!Array.isArray(items)) throw ApiError.badRequest("Send an array of items");

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM content_blocks WHERE group_key = $1", [group]);

    for (const [index, item] of items.entries()) {
      await client.query(
        `INSERT INTO content_blocks (group_key, title, body, label, value, icon, position, is_published)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          group,
          clean(item.title),
          clean(item.body),
          clean(item.label),
          clean(item.value),
          clean(item.icon),
          index,
          item.isPublished === false ? false : true,
        ]
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }

  return listGroup(group);
}

export async function reorderGroup(group, ids) {
  if (!Array.isArray(ids) || !ids.length) throw ApiError.badRequest("Send an array of ids");

  await query(
    `UPDATE content_blocks AS b
        SET position = ord.position
       FROM (SELECT UNNEST($1::uuid[]) AS id, GENERATE_SUBSCRIPTS($1::uuid[], 1) - 1 AS position) AS ord
      WHERE b.id = ord.id AND b.group_key = $2`,
    [ids, group]
  );

  return listGroup(group);
}
