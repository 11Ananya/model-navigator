import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getRecommendations } from "../services/recommend.js";
import { getModelsForTask } from "../services/modelsFallback.js";

const RecommendationConfigSchema = z.object({
  taskType: z.enum([
    "text-generation",
    "classification",
    "summarization",
    "question-answering",
    "code-generation",
    "embedding",
  ]),
  gpuMemory: z.enum(["8gb", "16gb", "24gb", "40gb", "80gb"]),
  inferenceDevice: z.enum([
    "consumer-gpu",
    "datacenter-gpu",
    "cpu-only",
    "apple-silicon",
  ]),
  maxLatency: z.number().int().min(20).max(500),
  licenseType: z.enum(["any", "permissive", "commercial", "non-commercial"]),
  inferenceFramework: z
    .enum(["any", "transformers", "llama.cpp", "vllm", "onnx", "ollama"])
    .default("any"),
  quantization: z
    .enum(["none", "int8", "int4", "gptq", "awq"])
    .default("none"),
  deploymentTarget: z
    .enum(["local-dev", "on-prem-server", "cloud-vm", "edge-device"])
    .default("local-dev"),
  useCaseDescription: z.string().max(1000).default(""),
});

export const recommendationsRouter = new Hono();

recommendationsRouter.post(
  "/",
  zValidator("json", RecommendationConfigSchema, (result, c) => {
    if (!result.success) {
      return c.json(
        {
          error: "Validation failed",
          details: result.error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        },
        422
      );
    }
  }),
  async (c) => {
    const config = c.req.valid("json");
    const { models, warningModel } = getModelsForTask(config.taskType);
    const result = getRecommendations(config, models, warningModel);

    return c.json({ ...result, usedLlmReranking: false }, 200);
  }
);
