import { supabaseAdmin } from "../lib/supabase.js";
import type { RecommendationConfig } from "./recommend.js";
import type { ModelRecommendation } from "./recommend.js";

interface RecommendationEvent {
  config: RecommendationConfig;
  primary: ModelRecommendation;
  alternatives: ModelRecommendation[];
  warning: ModelRecommendation;
  usedLlmReranking: boolean;
  responseTimeMs: number;
}

/**
 * Fire-and-forget analytics insert. Never throws — DB errors are logged only.
 */
export function recordRecommendationEvent(event: RecommendationEvent): void {
  supabaseAdmin()
    .from("analytics_events")
    .insert({
      task_type: event.config.taskType,
      gpu_memory: event.config.gpuMemory,
      inference_device: event.config.inferenceDevice,
      max_latency: event.config.maxLatency,
      license_type: event.config.licenseType,
      inference_framework: event.config.inferenceFramework,
      quantization: event.config.quantization,
      deployment_target: event.config.deploymentTarget,
      had_use_case_description: event.config.useCaseDescription.trim().length > 0,
      primary_model_id: event.primary.id,
      alternative_model_ids: event.alternatives.map((m) => m.id),
      warning_model_id: event.warning.id,
      used_llm_reranking: event.usedLlmReranking,
      response_time_ms: event.responseTimeMs,
    })
    .then(({ error }) => {
      if (error) console.error("[analytics] insert error:", error.message);
    });
}
