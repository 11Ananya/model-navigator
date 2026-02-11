/**
 * Recommendation engine for InfraLens
 * 
 * Contains deterministic, rule-based filtering and scoring logic.
 * No LLM inference - all decisions are based on explicit rules.
 */

import type { 
  ModelRecommendation, 
  RecommendationConfig, 
  RecommendationResult,
  TaskType 
} from "./schemas";
import { modelDatabase, warningModels } from "./models";

/**
 * Parse memory requirement string to numeric GB value
 */
function parseMemoryGB(memoryStr: string): number {
  // Handle formats like "16 GB", "512 MB", "1.5 GB"
  const normalized = memoryStr.trim().toLowerCase();
  
  if (normalized.includes("mb")) {
    const mb = parseFloat(normalized);
    return mb / 1024; // Convert MB to GB
  }
  
  if (normalized.includes("gb")) {
    return parseFloat(normalized);
  }
  
  // Fallback: try to parse as-is
  return parseFloat(normalized) || 0;
}

/**
 * Check if a license is permissive (MIT or Apache)
 */
function isPermissiveLicense(license: string): boolean {
  const normalized = license.toLowerCase();
  return normalized.includes("mit") || normalized.includes("apache");
}

/**
 * Filter models by GPU memory constraint
 */
function filterByMemory(
  models: ModelRecommendation[],
  maxMemoryGB: number
): ModelRecommendation[] {
  return models.filter(model => {
    const modelMemoryGB = parseMemoryGB(model.memoryRequired);
    return modelMemoryGB <= maxMemoryGB;
  });
}

/**
 * Filter models by license requirement
 */
function filterByLicense(
  models: ModelRecommendation[],
  licenseType: string
): ModelRecommendation[] {
  if (licenseType === "any") {
    return models;
  }
  
  if (licenseType === "permissive") {
    return models.filter(model => isPermissiveLicense(model.license));
  }
  
  // For "commercial" and "non-commercial", we'd need more detailed license parsing
  // For now, return all models (this is a simplified implementation)
  return models;
}

/**
 * Extract numeric latency value from latency string
 * Handles formats like "~50ms/token", "~5ms", "50ms"
 */
function parseLatency(latencyStr: string): number {
  const match = latencyStr.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 50; // Default to 50ms if parsing fails
}

/**
 * Adjust score based on latency preference
 */
function adjustScoreForLatency(
  model: ModelRecommendation,
  maxLatency: number
): number {
  if (maxLatency >= 100) {
    // No latency penalty for relaxed requirements
    return model.score;
  }
  
  // Boost lower latency models for strict requirements
  const modelLatency = parseLatency(model.latency);
  const latencyBonus = (100 - modelLatency) * 0.1;
  return model.score + latencyBonus;
}

/**
 * Get model recommendations based on configuration
 * 
 * This is the main entry point for the recommendation engine.
 * It applies deterministic filtering and scoring rules.
 */
export function getRecommendations(
  config: RecommendationConfig
): RecommendationResult {
  const taskType = config.taskType as TaskType;
  
  // Get models for this task type, fallback to text-generation
  const allModels = modelDatabase[taskType] || modelDatabase["text-generation"];
  const warning = warningModels[taskType] || warningModels["text-generation"];
  
  // Start with all models
  let filteredModels = [...allModels];
  
  // Apply memory filter
  const maxMemoryGB = parseMemoryGB(config.gpuMemory);
  if (maxMemoryGB > 0) {
    const memoryFiltered = filterByMemory(filteredModels, maxMemoryGB);
    // Only apply filter if it doesn't remove all models
    if (memoryFiltered.length > 0) {
      filteredModels = memoryFiltered;
    }
  }
  
  // Apply license filter
  const licenseFiltered = filterByLicense(filteredModels, config.licenseType);
  // Only apply filter if it doesn't remove all models
  if (licenseFiltered.length > 0) {
    filteredModels = licenseFiltered;
  }
  
  // Score and sort models
  const scoredModels = filteredModels.map(model => ({
    ...model,
    adjustedScore: adjustScoreForLatency(model, config.maxLatency),
  }));
  
  // Sort by adjusted score (descending)
  const sortedModels = scoredModels.sort((a, b) => b.adjustedScore - a.adjustedScore);
  
  // Extract original models (without adjustedScore)
  const resultModels: ModelRecommendation[] = sortedModels.map(({ adjustedScore, ...model }) => model);
  
  return {
    primary: resultModels[0] || allModels[0],
    alternatives: resultModels.slice(1, 3),
    warning,
  };
}
