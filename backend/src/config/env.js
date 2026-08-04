import dotenv from "dotenv";

dotenv.config();

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
  const missing = ["JWT_SECRET"].filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(
      `Missing required environment variable(s): ${missing.join(", ")}. ` +
        "Copy backend/.env.example to backend/.env locally, or set them in the cPanel Node.js App panel."
    );
  }
}
