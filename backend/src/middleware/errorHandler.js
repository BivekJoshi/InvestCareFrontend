import { env } from "../config/env.js";
import { ApiError } from "../utils/ApiError.js";

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: { message: `Route not found: ${req.method} ${req.originalUrl}` },
  });
};

// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by arity
export const errorHandler = (error, _req, res, _next) => {
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
