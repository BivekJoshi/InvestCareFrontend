import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";

dotenv.config();

const backendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

const bool = (value, fallback = false) =>
  value === undefined ? fallback : ["1", "true", "yes"].includes(String(value).toLowerCase());

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  isProduction: (process.env.NODE_ENV || "development") === "production",

  corsOrigins: (process.env.CORS_ORIGIN || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),

  db: {
    connectionString: process.env.DATABASE_URL,
    host: process.env.PGHOST,
    port: process.env.PGPORT ? Number(process.env.PGPORT) : undefined,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: bool(process.env.DB_SSL),
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },

  bcryptRounds: Number(process.env.BCRYPT_ROUNDS || 12),

  /** Where uploaded images are written, and the origin they are served from. */
  uploadsDir: process.env.UPLOADS_DIR
    ? resolve(process.env.UPLOADS_DIR)
    : resolve(backendRoot, "uploads"),
  publicUrl: (process.env.PUBLIC_URL || `http://localhost:${process.env.PORT || 5000}`).replace(
    /\/+$/,
    ""
  ),

  seedAdmin: {
    name: process.env.SEED_ADMIN_NAME || "Administrator",
    email: process.env.SEED_ADMIN_EMAIL,
    password: process.env.SEED_ADMIN_PASSWORD,
  },
};

/**
 * Checked when the HTTP server boots, not on import — the migrate and seed
 * scripts need only a database, so they can run against a remote database
 * without carrying auth secrets.
 */
export function assertServerEnv() {
  // Created on demand so a fresh checkout (or a fresh cPanel deploy, which
  // never carries an empty directory over FTP) can accept uploads immediately.
  mkdirSync(env.uploadsDir, { recursive: true });

  const missing = ["JWT_SECRET"].filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Copy backend/.env.example to backend/.env locally, or set them in the cPanel Node.js App panel."
    );
  }
}
