import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

const config = env.db.connectionString
  ? { connectionString: env.db.connectionString }
  : {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
    };

if (env.db.ssl) {
  config.ssl = { rejectUnauthorized: false };
}

export const pool = new Pool(config);

pool.on("error", (error) => {
  console.error("[db] unexpected error on idle client:", error.message);
});

/** Run a parameterised query. Always use placeholders ($1, $2...) — never string concatenation. */
export const query = (text, params) => pool.query(text, params);
