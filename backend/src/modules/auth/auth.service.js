import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { query } from "../../db/pool.js";
import { ApiError } from "../../utils/ApiError.js";

// Compared against when no user matches, so a missing account costs the same
// time as a wrong password (no user enumeration through response timing).
const DUMMY_HASH = "$2b$12$1FpPNjhUSBOiyaXIfC5th.uhPAZYoDGRvw3gm/NDyr5NXMQVpidYy";

const PUBLIC_FIELDS = "id, name, email, role, is_active, last_login_at, created_at";

const toPublicUser = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  isActive: row.is_active,
  lastLoginAt: row.last_login_at,
  createdAt: row.created_at,
});

const signToken = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwt.secret, {
    expiresIn: env.jwt.expiresIn,
  });

export const login = async (email, password) => {
  const { rows } = await query(
    `SELECT id, name, email, password_hash, role, is_active, last_login_at, created_at
       FROM users
      WHERE email = $1`,
    [email.trim().toLowerCase()]
  );

  const user = rows[0];
  const passwordMatches = await bcrypt.compare(password, user?.password_hash ?? DUMMY_HASH);

  if (!user || !passwordMatches) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  if (!user.is_active) {
    throw ApiError.forbidden("This account has been disabled");
  }

  await query("UPDATE users SET last_login_at = NOW() WHERE id = $1", [user.id]);

  return { user: toPublicUser(user), token: signToken(user) };
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, env.jwt.secret);
  } catch {
    throw ApiError.unauthorized("Invalid or expired session");
  }
};

export const findActiveUserById = async (id) => {
  const { rows } = await query(
    `SELECT ${PUBLIC_FIELDS} FROM users WHERE id = $1 AND is_active = TRUE`,
    [id]
  );
  return rows[0] ? toPublicUser(rows[0]) : null;
};

export const changePassword = async (userId, currentPassword, newPassword) => {
  const { rows } = await query("SELECT password_hash FROM users WHERE id = $1", [userId]);
  const user = rows[0];

  if (!user || !(await bcrypt.compare(currentPassword, user.password_hash))) {
    throw ApiError.unauthorized("Current password is incorrect");
  }

  const passwordHash = await bcrypt.hash(newPassword, env.bcryptRounds);
  await query("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, userId]);
};
