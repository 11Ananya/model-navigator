/**
 * Phase 3: DB-backed model service with 1-minute in-memory cache.
 * Falls back to hardcoded data if Supabase is unavailable.
 */

import { supabaseAdmin } from "../lib/supabase.js";
import { getModelsForTask as getFallback } from "./modelsFallback.js";
import type { ModelRecommendation } from "./recommend.js";

interface DbRow {
  id: string;
  name: string;
  provider: string;
  parameters: string;
  memory_required: string;
  latency: string;
  license: string;
  base_score: number;
  reasoning: string;
  tradeoffs: string[];
  is_warning: boolean;
}

function mapRow(row: DbRow): ModelRecommendation {
  return {
    id: row.id,
    name: row.name,
    provider: row.provider,
    parameters: row.parameters,
    memoryRequired: row.memory_required,
    latency: row.latency,
    license: row.license,
    score: row.base_score,
    reasoning: row.reasoning,
    tradeoffs: row.tradeoffs,
    isWarning: row.is_warning,
  };
}

type TaskModelResult = {
  models: ModelRecommendation[];
  warningModel: ModelRecommendation;
};

const CACHE_TTL_MS = 60_000; // 1 minute
const modelCache = new Map<string, { data: TaskModelResult; expiresAt: number }>();

export async function getModelsForTask(
  taskType: string,
  framework = "any",
  quantization = "none",
  deploymentTarget = "local-dev"
): Promise<TaskModelResult> {
  const cacheKey = `${taskType}:${framework}:${quantization}:${deploymentTarget}`;
  const now = Date.now();

  const cached = modelCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.data;

  try {
    let query = supabaseAdmin()
      .from("models")
      .select(
        "id, name, provider, parameters, memory_required, latency, license, base_score, reasoning, tradeoffs, is_warning"
      )
      .eq("is_active", true)
      .contains("task_types", [taskType]);

    if (framework !== "any") {
      query = query.contains("inference_frameworks", [framework]);
    }
    if (quantization !== "none") {
      query = query.contains("quantization_formats", [quantization]);
    }
    if (deploymentTarget !== "local-dev") {
      query = query.contains("deployment_targets", [deploymentTarget]);
    }

    const { data, error } = await query;
    if (error) throw error;

    const rows = (data ?? []) as DbRow[];
    const warningRows = rows.filter((r) => r.is_warning);
    const normalRows = rows.filter((r) => !r.is_warning);

    const fallback = getFallback(taskType);

    const result: TaskModelResult = {
      models: normalRows.length > 0 ? normalRows.map(mapRow) : fallback.models,
      warningModel:
        warningRows.length > 0 ? mapRow(warningRows[0]) : fallback.warningModel,
    };

    modelCache.set(cacheKey, { data: result, expiresAt: now + CACHE_TTL_MS });
    return result;
  } catch {
    // Supabase unavailable or not configured — use hardcoded fallback silently
    return getFallback(taskType);
  }
}

/** Return all active models (for GET /api/models). Cached per call. */
export async function getAllModels(): Promise<ModelRecommendation[]> {
  const cacheKey = "all";
  const now = Date.now();

  const cached = modelCache.get(cacheKey);
  if (cached && cached.expiresAt > now) return cached.data.models;

  try {
    const { data, error } = await supabaseAdmin()
      .from("models")
      .select(
        "id, name, provider, parameters, memory_required, latency, license, base_score, reasoning, tradeoffs, is_warning"
      )
      .eq("is_active", true)
      .eq("is_warning", false)
      .order("base_score", { ascending: false });

    if (error) throw error;

    const models = ((data ?? []) as DbRow[]).map(mapRow);
    modelCache.set(cacheKey, {
      data: { models, warningModel: models[0] },
      expiresAt: now + CACHE_TTL_MS,
    });
    return models;
  } catch {
    const { modelDatabase } = await import("./modelsFallback.js");
    return Object.values(modelDatabase).flat();
  }
}
