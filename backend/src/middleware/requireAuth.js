import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findActiveUserById, verifyToken } from "../modules/auth/auth.service.js";

/** Rejects the request unless a valid `Authorization: Bearer <token>` is present. */
export const requireAuth = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw ApiError.unauthorized("Missing authentication token");
  }

  const payload = verifyToken(token);
  const user = await findActiveUserById(payload.sub);

  if (!user) {
    throw ApiError.unauthorized("Account no longer available");
  }

  req.user = user;
  next();
});
