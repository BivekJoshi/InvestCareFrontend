import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { publicReadLimiter } from "./middleware/rateLimit.js";
import authRoutes from "./modules/auth/auth.routes.js";
import contentRoutes from "./modules/content/content.routes.js";
import enquiryRoutes from "./modules/enquiries/enquiries.routes.js";
import mediaRoutes from "./modules/media/media.routes.js";
import publicRoutes from "./modules/public/public.routes.js";

export const createApp = () => {
  const app = express();

  // Correct client IPs behind a reverse proxy (Passenger, nginx, Cloudflare)
  // so the rate limiters key on the real address.
  app.set("trust proxy", 1);

  app.use(
    helmet({
      // Images are served to a different origin than the API itself.
      crossOriginResourcePolicy: { policy: "cross-origin" },
    })
  );
  app.use(
    cors({
      origin: env.corsOrigins,
      credentials: true,
      // The CMS sends an Authorization header, so every request is preceded by
      // a preflight. Caching it for a day turns two round trips per call into
      // one for the rest of the session.
      maxAge: 86400,
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan(env.isProduction ? "combined" : "dev"));

  app.get("/api/health", (_req, res) => {
    res.json({ success: true, status: "ok", env: env.nodeEnv });
  });

  // Uploaded images. Immutable filenames, so they can be cached hard.
  app.use(
    "/uploads",
    express.static(env.uploadsDir, {
      maxAge: "1y",
      immutable: true,
      index: false,
      dotfiles: "ignore",
    })
  );

  // Read-only content for the website. No authentication.
  app.use("/api/public", publicReadLimiter, publicRoutes);

  // Sign in, session, password.
  app.use("/api/auth", authRoutes);

  // The CMS. Every route below requires a valid token.
  app.use("/api/admin", contentRoutes);
  app.use("/api/admin/enquiries", enquiryRoutes);
  app.use("/api/admin/media", mediaRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
