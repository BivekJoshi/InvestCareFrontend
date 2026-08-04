import bcrypt from "bcryptjs";
import { env } from "../config/env.js";
import { pool } from "./pool.js";

const run = async () => {
  const { name, email, password } = env.seedAdmin;

  if (!email || !password) {
    throw new Error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in backend/.env before seeding.");
  }

  const passwordHash = await bcrypt.hash(password, env.bcryptRounds);

  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password_hash, role)
          VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO UPDATE
            SET name = EXCLUDED.name,
                password_hash = EXCLUDED.password_hash,
                is_active = TRUE
      RETURNING id, email`,
    [name, email.trim().toLowerCase(), passwordHash]
  );

  console.log(`[seed] admin ready: ${rows[0].email}`);
};

run()
  .catch((error) => {
    console.error("[seed] failed:", error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
