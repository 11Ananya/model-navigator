import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { recommendationsRouter } from "./routes/recommendations.js";
import { modelsRouter } from "./routes/models.js";
import { configsRouter } from "./routes/configs.js";
import { analyticsRouter } from "./routes/analytics.js";

const app = new Hono().basePath("/api");

const frontendOrigin =
  process.env.FRONTEND_ORIGIN ?? "http://localhost:8080";

app.use(
  "*",
  cors({
    origin: frontendOrigin,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("*", logger());

app.route("/recommendations", recommendationsRouter);
app.route("/models", modelsRouter);
app.route("/configs", configsRouter);
app.route("/analytics", analyticsRouter);

app.get("/health", (c) => c.json({ status: "ok" }));

const port = parseInt(process.env.PORT ?? "3001", 10);

serve({ fetch: app.fetch, port }, () => {
  console.log(`InfraLens API running on http://localhost:${port}`);
});
