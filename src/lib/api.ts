import type { RecommendationConfig, RecommendationResult } from "./schemas";

// Retrieve the stored Supabase session token (set by useAuth hook)
function getAuthHeader(): Record<string, string> {
  const token = sessionStorage.getItem("infralens-access-token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

export async function fetchRecommendations(
  config: RecommendationConfig
): Promise<RecommendationResult & { usedLlmReranking: boolean }> {
  const res = await fetch("/api/recommendations", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export async function fetchSavedConfigs() {
  const res = await fetch("/api/configs", {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch saved configs");
  return res.json() as Promise<{ configs: SavedConfig[] }>;
}

export async function createSavedConfig(payload: RecommendationConfig & { name: string }) {
  const res = await fetch("/api/configs", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({
      name: payload.name,
      task_type: payload.taskType,
      gpu_memory: payload.gpuMemory,
      inference_device: payload.inferenceDevice,
      max_latency: payload.maxLatency,
      license_type: payload.licenseType,
      inference_framework: payload.inferenceFramework,
      quantization: payload.quantization,
      deployment_target: payload.deploymentTarget,
      use_case_description: payload.useCaseDescription,
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? "Failed to save config");
  }
  return res.json();
}

export async function deleteSavedConfig(id: string) {
  const res = await fetch(`/api/configs/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete config");
  return res.json();
}

export interface SavedConfig {
  id: string;
  name: string;
  task_type: string;
  gpu_memory: string;
  inference_device: string;
  max_latency: number;
  license_type: string;
  inference_framework: string;
  quantization: string;
  deployment_target: string;
  use_case_description: string;
  created_at: string;
  updated_at: string;
}
