import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import authRoutes from "./modules/auth/auth.routes.js";

export const createApp = () => {
  const app = express();

  // Correct client IPs behind a reverse proxy (nginx, Render, Railway...) so
  // the login rate limiter keys on the real address.
  app.set("trust proxy", 1);

  app.use(helmet());
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.isProduction ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, status: "ok", env: env.nodeEnv });
  });

  app.use("/api/auth", authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
