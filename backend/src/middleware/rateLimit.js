import rateLimit from "express-rate-limit";

const message = (text) => ({ success: false, error: { message: text } });

/** Slows down password guessing: 10 login attempts per IP per 15 minutes. */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: message("Too many login attempts. Please try again in a few minutes."),
});

/**
 * The contact form is the only endpoint the public can write to, so it is the
 * only one worth flooding. Generous enough that a genuine sender who mistypes
 * their email twice is never blocked.
 */
export const publicWriteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 8,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: message("Too many submissions from this address. Please try again later."),
});

/** A ceiling on the read API so a scraper cannot monopolise the database. */
export const publicReadLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: message("Too many requests. Please slow down."),
});
