import { ApiError } from "../../utils/ApiError.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import * as authService from "./auth.service.js";

const isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;

export const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};

  if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
    throw ApiError.badRequest("Email and password are required");
  }

  const { user, token } = await authService.login(email, password);
  res.json({ success: true, data: { user, token } });
});

export const meHandler = asyncHandler(async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

export const logoutHandler = asyncHandler(async (_req, res) => {
  // Tokens are stateless — the client discards it. Endpoint exists so the CMS
  // has a single place to call, and so we can add a denylist later if needed.
  res.json({ success: true, message: "Logged out" });
});

export const changePasswordHandler = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body ?? {};

  if (!isNonEmptyString(currentPassword) || !isNonEmptyString(newPassword)) {
    throw ApiError.badRequest("Current password and new password are required");
  }

  if (newPassword.length < 8) {
    throw ApiError.badRequest("New password must be at least 8 characters");
  }

  await authService.changePassword(req.user.id, currentPassword, newPassword);
  res.json({ success: true, message: "Password updated" });
});
