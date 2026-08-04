import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
};

/** Postgres and multer raise codes we can translate into honest 4xx replies. */
const translate = (error) => {
  if (error.name === "MulterError") {
    const message =
      error.code === "LIMIT_FILE_SIZE" ? "That file is larger than 5 MB" : error.message;
    return new ApiError(400, message);
  }

  // unique_violation — a slug or email already taken.
  if (error.code === "23505") {
    return new ApiError(409, "That value is already in use");
  }

  // foreign_key_violation — referencing a row that is gone.
  if (error.code === "23503") {
    return new ApiError(400, "That reference no longer exists");
  }

  return error;
};

// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity
export const errorHandler = (rawError, _req, res, _next) => {
  const error = translate(rawError);
  const isKnown = error instanceof ApiError;
  const status = isKnown ? error.status : 500;

  if (!isKnown) {
    console.error("[error]", error);
  }

  res.status(status).json({
    success: false,
    error: {
      message: isKnown || !env.isProduction ? error.message : "Internal server error",
      ...(error.details ? { details: error.details } : {}),
    },
  });
};
