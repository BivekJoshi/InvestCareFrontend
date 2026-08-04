import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { pool } from "./pool.js";

const here = dirname(fileURLToPath(import.meta.url));

const run = async () => {
  const sql = await readFile(join(here, "schema.sql"), "utf8");
  await pool.query(sql);
  console.log("[migrate] schema applied");
};

run()
  .catch((error) => {
    console.error("[migrate] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
