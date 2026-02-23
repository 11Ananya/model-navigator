import { useMutation } from "@tanstack/react-query";
import { fetchRecommendations } from "@/lib/api";
import { getRecommendations } from "@/lib/recommend";
import { modelDatabase, warningModels } from "@/lib/models";
import type { RecommendationConfig } from "@/lib/schemas";

async function fetchWithFallback(config: RecommendationConfig) {
  try {
    return await fetchRecommendations(config);
  } catch {
    // Server unavailable — fall back to local computation so the demo always works
    const taskType = config.taskType as keyof typeof modelDatabase;
    const models = modelDatabase[taskType] ?? modelDatabase["text-generation"];
    const warningModel = warningModels[taskType] ?? warningModels["text-generation"];
    return { ...getRecommendations(config, models, warningModel), usedLlmReranking: false };
  }
}

export function useRecommendations() {
  return useMutation({
    mutationFn: fetchWithFallback,
  });
}
