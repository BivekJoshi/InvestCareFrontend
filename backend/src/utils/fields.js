import { ApiError } from "./ApiError.js";

/**
 * Field-type coercion and validation shared by every resource.
 *
 * Each resource declares its columns once; this module turns that declaration
 * into validation, SQL parameters and the camelCase shape the API returns —
 * so adding a field is a one-line change, not four.
 */

const COERCERS = {
  string: (value) => (value === null ? null : String(value).trim()),
  text: (value) => (value === null ? null : String(value)),
  number: (value) => {
    if (value === null || value === "") return null;
    const num = Number(value);
    if (Number.isNaN(num)) throw new TypeError("must be a number");
    return num;
  },
  integer: (value) => {
    if (value === null || value === "") return null;
    const num = Number(value);
    if (!Number.isInteger(num)) throw new TypeError("must be a whole number");
    return num;
  },
  boolean: (value) => {
    if (typeof value === "boolean") return value;
    if (value === "true" || value === 1 || value === "1") return true;
    if (value === "false" || value === 0 || value === "0") return false;
    throw new TypeError("must be true or false");
  },
  /** Arrays of plain strings — metrics, requirements, bullet points. */
  stringArray: (value) => {
    if (value === null) return [];
    if (!Array.isArray(value)) throw new TypeError("must be an array");
    return value.map((entry) => String(entry).trim()).filter(Boolean);
  },
  json: (value) => {
    if (value === null) return null;
    if (typeof value !== "object") throw new TypeError("must be an object");
    return value;
  },
  date: (value) => {
    if (value === null || value === "") return null;
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) throw new TypeError("must be a date");
    return parsed.toISOString().slice(0, 10);
  },
};

/** Column name (snake_case) → API key (camelCase). */
export const toCamel = (column) => column.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

/**
 * Validates and coerces an incoming payload against a field map.
 * `partial` skips the required check, for PATCH.
 */
export function coercePayload(fields, payload, { partial = false } = {}) {
  if (!payload || typeof payload !== "object") {
    throw ApiError.badRequest("Request body must be a JSON object");
  }

  const values = {};
  const errors = {};

  for (const [column, field] of Object.entries(fields)) {
    const key = field.key ?? toCamel(column);
    const provided = Object.prototype.hasOwnProperty.call(payload, key);

    if (!provided) {
      if (!partial && field.required) errors[key] = "is required";
      continue;
    }

    const raw = payload[key];

    if ((raw === null || raw === "") && field.required) {
      errors[key] = "is required";
      continue;
    }

    try {
      values[column] = COERCERS[field.type](raw === "" ? null : raw);
    } catch (error) {
      errors[key] = error.message;
    }
  }

  if (Object.keys(errors).length) {
    throw ApiError.badRequest("Some fields need attention", errors);
  }

  return values;
}

/** Database row → the camelCase object the API hands out. */
export function rowToApi(fields, row) {
  if (!row) return null;

  const out = { id: row.id };

  for (const column of Object.keys(fields)) {
    const field = fields[column];
    out[field.key ?? toCamel(column)] = row[column];
  }

  if ("position" in row) out.position = row.position;
  if ("is_published" in row) out.isPublished = row.is_published;
  if ("created_at" in row) out.createdAt = row.created_at;
  if ("updated_at" in row) out.updatedAt = row.updated_at;

  return out;
}
