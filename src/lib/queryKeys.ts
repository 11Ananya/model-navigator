import type { RecommendationConfig } from "./schemas";

export const queryKeys = {
  recommendations: (config: RecommendationConfig) =>
    ["recommendations", config] as const,
  savedConfigs: () => ["savedConfigs"] as const,
  savedConfig: (id: string) => ["savedConfigs", id] as const,
};
