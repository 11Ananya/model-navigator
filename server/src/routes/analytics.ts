import { Hono } from "hono";
import { supabaseAdmin } from "../lib/supabase.js";

export const analyticsRouter = new Hono();

analyticsRouter.post("/event", async (c) => {
  const body = await c.req.json();

  // Fire-and-forget — don't let DB errors fail the client request
  supabaseAdmin()
    .from("analytics_events")
    .insert({
      user_id: body.userId ?? null,
      session_id: body.sessionId ?? null,
      task_type: body.taskType,
      gpu_memory: body.gpuMemory,
      inference_device: body.inferenceDevice,
      max_latency: body.maxLatency,
      license_type: body.licenseType,
      inference_framework: body.inferenceFramework ?? null,
      quantization: body.quantization ?? null,
      deployment_target: body.deploymentTarget ?? null,
      had_use_case_description: Boolean(body.useCaseDescription),
      primary_model_id: body.primaryModelId ?? null,
      alternative_model_ids: body.alternativeModelIds ?? [],
      warning_model_id: body.warningModelId ?? null,
      used_llm_reranking: body.usedLlmReranking ?? false,
      response_time_ms: body.responseTimeMs ?? null,
    })
    .then(({ error }) => {
      if (error) console.error("[analytics] insert error:", error.message);
    });

  return c.json({ recorded: true }, 202);
});
