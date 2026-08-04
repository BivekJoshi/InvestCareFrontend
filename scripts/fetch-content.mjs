/**
 * Pulls published content from the CMS into `src/data/generated/site.json`.
 *
 * The website is a static export, so content is resolved once at build time
 * rather than per request. Running this before `next build` is what makes a
 * CMS edit appear on the live site.
 *
 * The generated file is committed. If the API is unreachable — offline, or the
 * backend is down mid-deploy — the build keeps the last known-good content
 * instead of failing or, worse, shipping an empty site.
 *
 *   node scripts/fetch-content.mjs [--url https://api.example.com/api] [--strict]
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const OUTPUT = resolve(here, "../src/data/generated/site.json");

const arg = (flag) => {
  const index = process.argv.indexOf(flag);
  return index === -1 ? null : process.argv[index + 1];
};

const API_URL = (
  arg("--url") ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api"
).replace(/\/+$/, "");

/** In CI you may prefer a hard failure to silently shipping stale content. */
const strict = process.argv.includes("--strict");

/** Sections that must be present and non-empty for the payload to be usable. */
const REQUIRED = ["company", "board", "sectors", "portfolio"];

const keepExisting = async (reason) => {
  const existing = await readFile(OUTPUT, "utf8").catch(() => null);

  if (!existing) {
    console.error(`[content] ${reason} — and no previously generated file exists.`);
    process.exit(1);
  }

  if (strict) {
    console.error(`[content] ${reason} — failing because --strict was passed.`);
    process.exit(1);
  }

  const { fetchedAt } = JSON.parse(existing);
  console.warn(`[content] ${reason}`);
  console.warn(`[content] keeping the committed content (last pulled ${fetchedAt ?? "unknown"}).`);
  process.exit(0);
};

const response = await fetch(`${API_URL}/public/site`, {
  headers: { accept: "application/json" },
  signal: AbortSignal.timeout(20_000),
}).catch((error) => ({ ok: false, statusText: error.message }));

if (!response.ok) {
  await keepExisting(`could not reach ${API_URL}/public/site (${response.statusText})`);
}

const payload = await response.json().catch(() => null);

if (!payload?.success || !payload.data) {
  await keepExisting("the API responded but the payload was not usable");
}

const missing = REQUIRED.filter((key) => {
  const value = payload.data[key];
  return !value || (Array.isArray(value) && value.length === 0);
});

if (missing.length) {
  await keepExisting(`the API returned no content for: ${missing.join(", ")}`);
}

await mkdir(dirname(OUTPUT), { recursive: true });
await writeFile(
  OUTPUT,
  `${JSON.stringify({ fetchedAt: new Date().toISOString(), source: API_URL, ...payload.data }, null, 2)}\n`
);

const { board, portfolio, sectors, jobs } = payload.data;
console.log(
  `[content] pulled from ${API_URL} — ` +
    `${board.length} board, ${portfolio.length} portfolio, ${sectors.length} sectors, ${jobs?.length ?? 0} jobs`
);
