import { query } from "../../db/pool.js";
import { ApiError } from "../../utils/ApiError.js";

/**
 * Singleton documents — the company profile, capital structure, contact
 * details, the investor quote. Each is one JSON blob under a stable key.
 *
 * These fields always change together and are never listed or reordered, so a
 * document beats a wide table: the CMS edits one form, and adding a field
 * needs no migration.
 */

/** Keys the CMS knows about. Anything else is rejected, so typos can't create orphan rows. */
export const SETTING_KEYS = [
  "company", // name, tagline, intro, mission, vision
  "incorporation", // summary + legal detail rows
  "contact", // office, email, phones
  "capital", // bars, build-up, the ask
  "investorQuote", // pull quote and attribution
  "seo", // default title/description/OG image
];

export async function getAll() {
  const { rows } = await query("SELECT key, value, updated_at FROM site_settings");

  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, {});
}

export async function get(key) {
  assertKnownKey(key);
  const { rows } = await query("SELECT value FROM site_settings WHERE key = $1", [key]);
  return rows[0]?.value ?? {};
}

/** Upsert — the CMS saves a whole document at a time. */
export async function put(key, value, userId = null) {
  assertKnownKey(key);

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw ApiError.badRequest("Value must be a JSON object");
  }

  const { rows } = await query(
    `INSERT INTO site_settings (key, value, updated_by)
          VALUES ($1, $2::jsonb, $3)
     ON CONFLICT (key) DO UPDATE
            SET value = EXCLUDED.value,
                updated_by = EXCLUDED.updated_by,
                updated_at = NOW()
      RETURNING value`,
    [key, JSON.stringify(value), userId]
  );

  return rows[0].value;
}

function assertKnownKey(key) {
  if (!SETTING_KEYS.includes(key)) {
    throw ApiError.badRequest(`Unknown settings key "${key}"`, { allowed: SETTING_KEYS });
  }
}
