import { query } from "../../db/pool.js";
import { ApiError } from "../../utils/ApiError.js";
import { isUuid } from "../../utils/isUuid.js";

const COLUMNS =
  "id, name, email, phone, subject, message, source, status, notes, handled_by, handled_at, created_at";

const STATUSES = ["new", "read", "replied", "archived"];

const toApi = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  subject: row.subject,
  message: row.message,
  source: row.source,
  status: row.status,
  notes: row.notes,
  handledBy: row.handled_by,
  handledAt: row.handled_at,
  createdAt: row.created_at,
});

const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value));

/** Written by the public contact form. */
export async function create(payload) {
  const name = String(payload?.name ?? "").trim();
  const email = String(payload?.email ?? "").trim().toLowerCase();
  const message = String(payload?.message ?? "").trim();

  const errors = {};
  if (!name) errors.name = "is required";
  if (!email) errors.email = "is required";
  else if (!isEmail(email)) errors.email = "must be a valid email address";
  if (!message) errors.message = "is required";
  else if (message.length > 5000) errors.message = "must be under 5000 characters";

  if (Object.keys(errors).length) {
    throw ApiError.badRequest("Please check the form", errors);
  }

  const { rows } = await query(
    `INSERT INTO enquiries (name, email, phone, subject, message, source)
          VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${COLUMNS}`,
    [
      name.slice(0, 200),
      email.slice(0, 200),
      payload.phone ? String(payload.phone).trim().slice(0, 50) : null,
      payload.subject ? String(payload.subject).trim().slice(0, 300) : null,
      message,
      payload.source ? String(payload.source).slice(0, 50) : "website",
    ]
  );

  return toApi(rows[0]);
}

export async function list({ status = null, search = null } = {}) {
  const where = [];
  const params = [];

  if (status) {
    if (!STATUSES.includes(status)) throw ApiError.badRequest(`Unknown status "${status}"`);
    params.push(status);
    where.push(`status = $${params.length}`);
  }

  if (search) {
    params.push(`%${search}%`);
    where.push(`(name ILIKE $${params.length} OR email ILIKE $${params.length} OR message ILIKE $${params.length})`);
  }

  const { rows } = await query(
    `SELECT ${COLUMNS} FROM enquiries
      ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
      ORDER BY created_at DESC`,
    params
  );

  return rows.map(toApi);
}

export async function counts() {
  const { rows } = await query("SELECT status, COUNT(*)::int AS total FROM enquiries GROUP BY status");
  const base = Object.fromEntries(STATUSES.map((status) => [status, 0]));
  return rows.reduce((acc, row) => ({ ...acc, [row.status]: row.total }), base);
}

export async function setStatus(id, status, userId, notes) {
  if (!isUuid(id)) throw ApiError.notFound("Enquiry not found");

  if (!STATUSES.includes(status)) {
    throw ApiError.badRequest(`Status must be one of: ${STATUSES.join(", ")}`);
  }

  const { rows } = await query(
    `UPDATE enquiries
        SET status = $1,
            notes = COALESCE($2, notes),
            handled_by = $3,
            handled_at = CASE WHEN $1 = 'new' THEN NULL ELSE NOW() END
      WHERE id = $4
  RETURNING ${COLUMNS}`,
    [status, notes ?? null, userId, id]
  );

  if (!rows.length) throw ApiError.notFound("Enquiry not found");
  return toApi(rows[0]);
}

export async function remove(id) {
  if (!isUuid(id)) throw ApiError.notFound("Enquiry not found");
  const { rowCount } = await query("DELETE FROM enquiries WHERE id = $1", [id]);
  if (!rowCount) throw ApiError.notFound("Enquiry not found");
}
