import { Hono } from "hono";
import { modelDatabase, warningModels } from "../services/modelsFallback.js";

export const modelsRouter = new Hono();

modelsRouter.get("/", (c) => {
  const taskType = c.req.query("taskType");
  const isWarningParam = c.req.query("isWarning");

  let models = Object.values(modelDatabase).flat();

  if (taskType) {
    models = (modelDatabase as Record<string, typeof models>)[taskType] ?? [];
  }

  if (isWarningParam !== undefined) {
    const wantWarning = isWarningParam === "true";
    if (wantWarning) {
      models = taskType
        ? [(warningModels as Record<string, (typeof models)[number]>)[taskType]].filter(Boolean)
        : Object.values(warningModels);
    }
  }

  return c.json({ models, total: models.length });
});
