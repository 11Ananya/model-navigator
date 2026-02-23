/**
 * Recommendation engine — server-side port of src/lib/recommend.ts
 *
 * All logic is deterministic and pure. Models are passed in as parameters
 * rather than imported from a static file so this service works with both
 * the temporary hardcoded fallback (Phase 1) and the DB-backed source (Phase 3).
 */

export interface ModelRecommendation {
  id: string;
  name: string;
  provider: string;
  parameters: string;
  memoryRequired: string;
  latency: string;
  license: string;
  score: number;
  reasoning: string;
  tradeoffs: string[];
  isWarning?: boolean;
}

export interface RecommendationConfig {
  taskType: string;
  gpuMemory: string;
  inferenceDevice: string;
  maxLatency: number;
  licenseType: string;
  inferenceFramework: string;
  quantization: string;
  deploymentTarget: string;
  useCaseDescription: string;
}

export interface RecommendationResult {
  primary: ModelRecommendation;
  alternatives: ModelRecommendation[];
  warning: ModelRecommendation;
  usedLlmReranking: boolean;
}

// ─── Parsing helpers ──────────────────────────────────────────────────────────

function parseMemoryGB(memoryStr: string): number {
  const normalized = memoryStr.trim().toLowerCase();
  if (normalized.includes("mb")) return parseFloat(normalized) / 1024;
  if (normalized.includes("gb")) return parseFloat(normalized);
  return parseFloat(normalized) || 0;
}

function isPermissiveLicense(license: string): boolean {
  const n = license.toLowerCase();
  return n.includes("mit") || n.includes("apache");
}

function parseLatency(latencyStr: string): number {
  const match = latencyStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 50;
}

// ─── Filtering ────────────────────────────────────────────────────────────────

function filterByMemory(
  models: ModelRecommendation[],
  maxMemoryGB: number
): ModelRecommendation[] {
  return models.filter(
    (m) => parseMemoryGB(m.memoryRequired) <= maxMemoryGB
  );
}

function filterByLicense(
  models: ModelRecommendation[],
  licenseType: string
): ModelRecommendation[] {
  if (licenseType === "any") return models;
  if (licenseType === "permissive")
    return models.filter((m) => isPermissiveLicense(m.license));
  // "commercial" and "non-commercial" need richer metadata — return all for now
  return models;
}

// ─── Scoring ──────────────────────────────────────────────────────────────────

function adjustScoreForLatency(
  model: ModelRecommendation,
  maxLatency: number
): number {
  if (maxLatency >= 100) return model.score;
  const modelLatency = parseLatency(model.latency);
  return model.score + (100 - modelLatency) * 0.1;
}

// ─── Main entry point ─────────────────────────────────────────────────────────

export function getRecommendations(
  config: RecommendationConfig,
  allModels: ModelRecommendation[],
  warningModel: ModelRecommendation
): Omit<RecommendationResult, "usedLlmReranking"> {
  let filtered = [...allModels];

  // Memory filter
  const maxMemoryGB = parseMemoryGB(config.gpuMemory);
  if (maxMemoryGB > 0) {
    const memFiltered = filterByMemory(filtered, maxMemoryGB);
    if (memFiltered.length > 0) filtered = memFiltered;
  }

  // License filter
  const licFiltered = filterByLicense(filtered, config.licenseType);
  if (licFiltered.length > 0) filtered = licFiltered;

  // Score + sort
  const sorted = filtered
    .map((m) => ({ ...m, _adj: adjustScoreForLatency(m, config.maxLatency) }))
    .sort((a, b) => b._adj - a._adj)
    .map(({ _adj, ...m }) => m);

  return {
    primary: sorted[0] ?? allModels[0],
    alternatives: sorted.slice(1, 3),
    warning: warningModel,
  };
}
