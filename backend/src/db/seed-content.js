/**
 * Imports the site content that currently lives in `src/data/*.js` into the
 * database, so the CMS starts with the real site rather than an empty shell.
 *
 * Idempotent: rows are matched on their natural key (slug, or position within
 * a block group) and updated in place, so re-running never duplicates.
 * Existing edits made in the CMS ARE overwritten — this is a first-run import,
 * not a sync. Guard rail: pass --force to run it against a database that
 * already has content.
 */

import { pool, query } from "./pool.js";
import { seedData } from "./seed-data.js";

const force = process.argv.includes("--force");

const upsertSetting = (key, value) =>
  query(
    `INSERT INTO site_settings (key, value) VALUES ($1, $2::jsonb)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  );

const replaceBlocks = async (group, items) => {
  await query("DELETE FROM content_blocks WHERE group_key = $1", [group]);

  for (const [index, item] of items.entries()) {
    await query(
      `INSERT INTO content_blocks (group_key, title, body, label, value, icon, position)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [group, item.title ?? null, item.body ?? null, item.label ?? null, item.value ?? null, item.icon ?? null, index]
    );
  }
};

const upsertBySlug = async (table, columns, rows) => {
  for (const [index, row] of rows.entries()) {
    const record = { ...row, position: index };
    const cols = [...columns, "position"];
    const values = cols.map((col) => {
      const value = record[col];
      return Array.isArray(value) ? JSON.stringify(value) : value ?? null;
    });

    await query(
      `INSERT INTO ${table} (${cols.join(", ")})
            VALUES (${cols.map((_, i) => `$${i + 1}`).join(", ")})
       ON CONFLICT (slug) DO UPDATE
              SET ${cols.filter((c) => c !== "slug").map((c) => `${c} = EXCLUDED.${c}`).join(", ")},
                  updated_at = NOW()`,
      values
    );
  }
};

/** Tables without a slug — cleared and rewritten, since order is their identity. */
const replaceRows = async (table, columns, rows) => {
  await query(`DELETE FROM ${table}`);

  for (const [index, row] of rows.entries()) {
    const record = { ...row, position: index };
    const cols = [...columns, "position"];

    await query(
      `INSERT INTO ${table} (${cols.join(", ")})
       VALUES (${cols.map((_, i) => `$${i + 1}`).join(", ")})`,
      cols.map((col) => {
        const value = record[col];
        return Array.isArray(value) ? JSON.stringify(value) : value ?? null;
      })
    );
  }
};

const run = async () => {
  const { rows: [{ total }] } = await query(
    "SELECT (SELECT COUNT(*) FROM board_members) + (SELECT COUNT(*) FROM content_blocks) AS total"
  );

  if (Number(total) > 0 && !force) {
    console.log(
      `[content] database already holds content (${total} rows). ` +
        "Re-run with --force to overwrite it with the files in src/data."
    );
    return;
  }

  // --- Singleton documents -------------------------------------------------
  await upsertSetting("company", seedData.company);
  await upsertSetting("incorporation", { summary: seedData.incorporation.summary });
  await upsertSetting("contact", { office: seedData.contact.office, email: seedData.contact.email });
  await upsertSetting("capital", seedData.capital);
  await upsertSetting("investorQuote", seedData.investorQuote);
  await upsertSetting("seo", seedData.seo);

  const { landing } = seedData;

  // --- Block lists ---------------------------------------------------------
  await replaceBlocks("company.values", seedData.values);
  await replaceBlocks("incorporation.details", seedData.incorporation.details);
  await replaceBlocks(
    "incorporation.governance",
    seedData.incorporation.governancePillars.map((title) => ({ title }))
  );
  await replaceBlocks("contact.phones", seedData.contact.phones.map((p) => ({ label: p.name, value: p.number })));
  await replaceBlocks("portfolio.stats", seedData.portfolioStats);
  await replaceBlocks("invest.holdingPrinciples", seedData.holdingPrinciples.map((title) => ({ title })));
  await replaceBlocks("invest.nepalStats", seedData.nepalStats);
  await replaceBlocks("invest.nepalMomentum", seedData.nepalMomentum.map((body) => ({ body })));
  await replaceBlocks("invest.nepalWhyNow", seedData.nepalWhyNow.map((body) => ({ body })));
  await replaceBlocks("landing.ticker", landing.ticker.map((title) => ({ title })));
  await replaceBlocks("landing.stats", landing.stats);
  await replaceBlocks("landing.valueProps", landing.valueProps);
  await replaceBlocks("landing.investorCommitments", landing.investorCommitments);

  // --- Records -------------------------------------------------------------
  await upsertBySlug(
    "board_members",
    ["slug", "name", "role", "credentials", "bio", "image"],
    seedData.board
  );

  await upsertBySlug("sectors", ["slug", "name", "share", "icon", "color", "body"], seedData.sectors);

  // The seed carries the API's camelCase shape; these two columns differ.
  await upsertBySlug(
    "portfolio_companies",
    [
      "slug", "name", "brand", "location", "sector", "icon", "status",
      "summary", "profile", "metrics", "image", "image_hint", "logo",
    ],
    seedData.portfolio.map(({ imageHint, ...rest }) => ({ ...rest, image_hint: imageHint }))
  );

  await replaceRows(
    "roadmap_milestones",
    ["date_label", "title", "detail"],
    seedData.roadmap.map(({ date, ...rest }) => ({ ...rest, date_label: date }))
  );
  await replaceRows(
    "benchmarks",
    ["name", "country", "figure", "caption", "featured", "points"],
    seedData.benchmarks
  );

  const counts = await query(
    `SELECT
       (SELECT COUNT(*) FROM site_settings)       AS settings,
       (SELECT COUNT(*) FROM content_blocks)      AS blocks,
       (SELECT COUNT(*) FROM board_members)       AS board,
       (SELECT COUNT(*) FROM sectors)             AS sectors,
       (SELECT COUNT(*) FROM portfolio_companies) AS portfolio,
       (SELECT COUNT(*) FROM roadmap_milestones)  AS roadmap,
       (SELECT COUNT(*) FROM benchmarks)          AS benchmarks`
  );

  console.log("[content] imported:", counts.rows[0]);
};

run()
  .catch((error) => {
    console.error("[content] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
