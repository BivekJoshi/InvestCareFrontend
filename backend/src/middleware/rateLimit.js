import rateLimit from "express-rate-limit";

/** Slows down password guessing: 10 login attempts per IP per 15 minutes. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    error: { message: "Too many login attempts. Please try again in a few minutes." },
  },
});
