import { createApp } from "./app.js";
import { assertServerEnv, env } from "./config/env.js";
import { pool } from "./db/pool.js";

const start = async () => {
  // Fail fast with a clear message rather than on the first request.
  assertServerEnv();
  await pool.query("SELECT 1");

  const server = createApp().listen(env.port, () => {
    console.log(`[server] investcare-api listening on http://localhost:${env.port} (${env.nodeEnv})`);
  });

  const shutdown = (signal) => {
    console.log(`\n[server] ${signal} received, shutting down`);
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
};

start().catch((error) => {
  console.error("[server] failed to start:", error.message);
  process.exit(1);
});
