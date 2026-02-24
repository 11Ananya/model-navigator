import { Hono } from "hono";
import { getAllModels, getModelsForTask } from "../services/models.js";

export const modelsRouter = new Hono();

modelsRouter.get("/", async (c) => {
  const taskType = c.req.query("taskType");
  const framework = c.req.query("framework") ?? "any";
  const quantization = c.req.query("quantization") ?? "none";
  const deploymentTarget = c.req.query("deploymentTarget") ?? "local-dev";
  const isWarningParam = c.req.query("isWarning");

  if (taskType) {
    const { models, warningModel } = await getModelsForTask(
      taskType,
      framework,
      quantization,
      deploymentTarget
    );

    if (isWarningParam === "true") {
      return c.json({ models: [warningModel], total: 1 });
    }

    return c.json({ models, total: models.length });
  }

  // No taskType filter — return all active, non-warning models
  const models = await getAllModels();
  return c.json({ models, total: models.length });
});
