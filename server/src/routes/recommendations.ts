import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { getRecommendations } from "../services/recommend.js";
import { getModelsForTask } from "../services/models.js";
import { llmRerank } from "../services/llmRerank.js";
import { recordRecommendationEvent } from "../services/analytics.js";

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
    const startTime = Date.now();
    const config = c.req.valid("json");
    const { models, warningModel } = await getModelsForTask(
      config.taskType,
      config.inferenceFramework,
      config.quantization,
      config.deploymentTarget
    );

    // Step 1: deterministic filter + score
    const { primary, alternatives, warning } = getRecommendations(config, models, warningModel);
    const candidates = [primary, ...alternatives];

    // Step 2: if user described their use case, let Claude re-rank and rewrite reasoning
    const hasDescription = config.useCaseDescription.trim().length > 0;
    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;
    const useLlm = hasDescription && hasApiKey;

    console.log(`[recommendations] description="${config.useCaseDescription.slice(0, 60)}..." | hasDescription=${hasDescription} | hasApiKey=${hasApiKey} | useLlm=${useLlm}`);
    console.log(`[recommendations] deterministic top pick: ${primary.name} (score=${primary.score})`);

    if (useLlm) {
      try {
        console.log("[recommendations] calling LLM rerank...");
        const reranked = await llmRerank(candidates, warning, config);
        console.log(`[recommendations] LLM rerank SUCCESS — top pick: ${reranked.primary.name} (score=${reranked.primary.score})`);
        recordRecommendationEvent({
          config,
          ...reranked,
          usedLlmReranking: true,
          responseTimeMs: Date.now() - startTime,
        });
        return c.json({ ...reranked, usedLlmReranking: true }, 200);
      } catch (err) {
        console.error("[recommendations] LLM rerank FAILED, falling back to deterministic:", err);
      }
    }

    recordRecommendationEvent({
      config,
      primary,
      alternatives,
      warning,
      usedLlmReranking: false,
      responseTimeMs: Date.now() - startTime,
    });
    return c.json({ primary, alternatives, warning, usedLlmReranking: false }, 200);
  }
);
