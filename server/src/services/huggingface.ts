/**
 * Phase 6: Hugging Face Hub API integration.
 * Fetches live model data from the HF Hub as the primary source,
 * with Supabase and hardcoded fallback as safety nets.
 */

import type { ModelRecommendation } from "./recommend.js";

// ─── HF API types ───────────────────────────────────────────────────────────

interface HfModel {
  modelId: string;
  pipeline_tag?: string;
  downloads: number;
  likes: number;
  lastModified: string;
  tags: string[];
  safetensors?: {
    total?: number;
    parameters?: Record<string, number>;
  };
  config?: {
    model_type?: string;
  };
}

// ─── Task type → HF pipeline_tag mapping ────────────────────────────────────

const TASK_TO_PIPELINE: Record<string, string> = {
  "text-generation": "text-generation",
  classification: "text-classification",
  summarization: "summarization",
  "question-answering": "question-answering",
  "code-generation": "text-generation",
  embedding: "feature-extraction",
};

// ─── Cache ──────────────────────────────────────────────────────────────────

const HF_CACHE_TTL_MS = 3_600_000; // 1 hour
const hfCache = new Map<string, { data: ModelRecommendation[]; expiresAt: number }>();

// ─── Parameter parsing helpers ──────────────────────────────────────────────

/** Try to extract parameter count from safetensors metadata. */
function getParamCountFromSafetensors(model: HfModel): number | null {
  if (model.safetensors?.total) return model.safetensors.total;
  if (model.safetensors?.parameters) {
    const values = Object.values(model.safetensors.parameters);
    if (values.length > 0) return Math.max(...values);
  }
  return null;
}

/** Try to parse parameter count from model name (e.g. "7B", "1.5B", "70B", "350M"). */
function parseParamsFromName(modelId: string): number | null {
  const name = modelId.toLowerCase();
  const bMatch = name.match(/(\d+(?:\.\d+)?)\s*b(?:illion)?(?:\b|[-_])/);
  if (bMatch) return parseFloat(bMatch[1]) * 1e9;
  const mMatch = name.match(/(\d+(?:\.\d+)?)\s*m(?:illion)?(?:\b|[-_])/);
  if (mMatch) return parseFloat(mMatch[1]) * 1e6;
  return null;
}

/** Estimate param count from known model architecture keywords when no other data exists. */
function estimateParamsFromType(modelId: string, tags: string[]): number | null {
  const id = modelId.toLowerCase();
  const allTags = tags.join(" ").toLowerCase();
  const combined = id + " " + allTags;

  // Well-known architectures with roughly known sizes
  if (combined.includes("distilbert")) return 66e6;
  if (combined.includes("roberta-large") || combined.includes("xlm-roberta-large")) return 355e6;
  if (combined.includes("roberta-base") || combined.includes("xlm-roberta-base")) return 125e6;
  if (combined.includes("deberta-v3-large") || combined.includes("deberta-large")) return 304e6;
  if (combined.includes("deberta-v3-base") || combined.includes("deberta-base")) return 86e6;
  if (combined.includes("bert-large")) return 340e6;
  if (combined.includes("bert-base")) return 110e6;
  if (combined.includes("albert-base")) return 12e6;
  if (combined.includes("albert-large")) return 18e6;
  if (combined.includes("electra-large")) return 335e6;
  if (combined.includes("electra-base")) return 110e6;
  if (combined.includes("bart-large")) return 406e6;
  if (combined.includes("bart-base")) return 139e6;
  if (combined.includes("t5-large")) return 770e6;
  if (combined.includes("t5-base")) return 220e6;
  if (combined.includes("t5-small")) return 60e6;
  if (combined.includes("flan-t5")) return 250e6;
  if (combined.includes("e5-large")) return 335e6;
  if (combined.includes("e5-base")) return 110e6;
  if (combined.includes("bge-large")) return 335e6;
  if (combined.includes("bge-base")) return 110e6;
  if (combined.includes("minilm")) return 33e6;
  if (combined.includes("sentence-transformers")) return 110e6;
  return null;
}

/** Format raw parameter count to human-readable string. */
function formatParams(count: number): string {
  if (count >= 1e9) {
    const val = count / 1e9;
    return val % 1 === 0 ? `${val}B` : `${val.toFixed(1)}B`;
  }
  if (count >= 1e6) {
    const val = count / 1e6;
    return val % 1 === 0 ? `${val}M` : `${val.toFixed(0)}M`;
  }
  return `${Math.round(count / 1e3)}K`;
}

/** Estimate memory required for fp16 inference: params * 2 bytes. */
function estimateMemory(paramCount: number): string {
  const bytes = paramCount * 2;
  const gb = bytes / (1024 ** 3);
  if (gb < 1) return `${Math.round(gb * 1024)} MB`;
  return gb < 10 ? `${gb.toFixed(1)} GB` : `${Math.round(gb)} GB`;
}

/** Estimate latency heuristic based on parameter count. */
function estimateLatency(paramCount: number): string {
  const billions = paramCount / 1e9;
  if (billions >= 30) return "~100ms/token";
  if (billions >= 10) return "~60ms/token";
  if (billions >= 3) return "~40ms/token";
  if (billions >= 1) return "~30ms/token";
  return "~5ms";
}

/** Extract license from tags array. */
function extractLicense(tags: string[]): string {
  for (const tag of tags) {
    if (tag.startsWith("license:")) {
      const raw = tag.slice("license:".length);
      // Prettify common licenses
      if (raw === "apache-2.0") return "Apache 2.0";
      if (raw === "mit") return "MIT";
      if (raw === "cc-by-4.0") return "CC BY 4.0";
      if (raw === "cc-by-sa-4.0") return "CC BY-SA 4.0";
      if (raw === "openrail") return "OpenRAIL";
      return raw;
    }
  }
  return "Unknown";
}

// ─── Scoring ────────────────────────────────────────────────────────────────

const LICENSE_SCORES: Record<string, number> = {
  "Apache 2.0": 15,
  MIT: 15,
  "CC BY 4.0": 12,
  "CC BY-SA 4.0": 10,
  OpenRAIL: 10,
};

function scoreModel(
  model: HfModel,
  paramCount: number,
  maxDownloads: number,
  maxLikes: number,
  maxParams: number,
  license: string
): number {
  // Downloads popularity: 30pts — log-scaled
  const dlScore =
    maxDownloads > 0
      ? (Math.log1p(model.downloads) / Math.log1p(maxDownloads)) * 30
      : 0;

  // Recency: 20pts — full within 30 days, linear decay over 180 days
  const modifiedMs = new Date(model.lastModified).getTime();
  const daysSinceUpdate = Number.isFinite(modifiedMs)
    ? (Date.now() - modifiedMs) / (1000 * 60 * 60 * 24)
    : 90; // fallback: assume ~3 months old if date missing
  const recencyScore =
    daysSinceUpdate <= 30 ? 20 : Math.max(0, 20 * (1 - (daysSinceUpdate - 30) / 150));

  // License openness: 15pts
  const licenseScore = LICENSE_SCORES[license] ?? 5;

  // Community signal: 10pts — log-scaled
  const likesScore =
    maxLikes > 0
      ? (Math.log1p(model.likes) / Math.log1p(maxLikes)) * 10
      : 0;

  // Size efficiency: 25pts — smaller models score higher
  const sizeScore =
    maxParams > 0
      ? (1 - paramCount / maxParams) * 25
      : 12.5;

  return Math.round(dlScore + recencyScore + licenseScore + likesScore + sizeScore);
}

function generateReasoning(
  model: HfModel,
  paramCount: number,
  license: string
): string {
  const parts: string[] = [];
  if (model.downloads >= 1_000_000) {
    parts.push(`Highly popular with ${(model.downloads / 1e6).toFixed(1)}M+ downloads`);
  } else if (model.downloads >= 100_000) {
    parts.push(`Well-adopted with ${(model.downloads / 1e3).toFixed(0)}K+ downloads`);
  }
  const modMs = new Date(model.lastModified).getTime();
  const daysSinceUpdate = Number.isFinite(modMs)
    ? (Date.now() - modMs) / (1000 * 60 * 60 * 24)
    : 90;
  if (daysSinceUpdate <= 60) parts.push("recently updated");
  if (license === "Apache 2.0" || license === "MIT") {
    parts.push(`permissive ${license} license`);
  }
  if (paramCount < 1e9) parts.push("lightweight and efficient");
  else if (paramCount > 30e9) parts.push("large model with strong capabilities");
  return parts.length > 0
    ? parts.join(". ") + "."
    : "Community model from Hugging Face Hub.";
}

function generateTradeoffs(
  paramCount: number,
  license: string,
  daysSinceUpdate: number,
  downloads: number,
  likes: number,
  modelId: string
): string[] {
  const tradeoffs: string[] = [];
  const lower = modelId.toLowerCase();

  // ── Size-based tradeoffs ──
  if (paramCount >= 30e9) {
    tradeoffs.push("Requires multi-GPU or offloading for inference");
  } else if (paramCount >= 13e9) {
    tradeoffs.push("Needs a high-VRAM GPU (16 GB+) for full-precision inference");
  } else if (paramCount >= 3e9) {
    tradeoffs.push("Mid-size model — may underperform larger alternatives on complex reasoning");
  } else if (paramCount >= 500e6) {
    tradeoffs.push("Compact model — faster inference but limited on nuanced tasks");
  } else {
    tradeoffs.push("Very small model — best for narrow or well-defined tasks");
  }

  // ── License ──
  if (license !== "Apache 2.0" && license !== "MIT" && license !== "Unknown") {
    tradeoffs.push("Review license terms before commercial deployment");
  } else if (license === "Unknown") {
    tradeoffs.push("License not specified — verify terms before use");
  }

  // ── Recency ──
  if (daysSinceUpdate > 365) {
    tradeoffs.push("Over a year since last update — may lack recent improvements");
  } else if (daysSinceUpdate > 180) {
    tradeoffs.push("Not recently maintained — verify compatibility with current tooling");
  } else if (daysSinceUpdate <= 14) {
    tradeoffs.push("Very recently published — less battle-tested in production");
  }

  // ── Community adoption ──
  if (downloads < 10_000) {
    tradeoffs.push("Low download count — limited community validation");
  } else if (downloads < 100_000 && likes < 50) {
    tradeoffs.push("Modest community adoption — fewer real-world usage reports");
  }

  // ── Architecture-specific hints ──
  if (lower.includes("distil")) {
    tradeoffs.push("Distilled variant — trades some accuracy for speed");
  }
  if (lower.includes("gptq") || lower.includes("awq") || lower.includes("gguf")) {
    tradeoffs.push("Pre-quantized weights — slight quality loss vs. full precision");
  }

  return tradeoffs.slice(0, 3);
}

// ─── Main fetch function ────────────────────────────────────────────────────

export async function fetchFromHuggingFace(
  taskType: string,
  framework = "any",
  quantization = "none",
  deploymentTarget = "local-dev"
): Promise<ModelRecommendation[]> {
  const cacheKey = `hf:${taskType}:${framework}:${quantization}:${deploymentTarget}`;
  const now = Date.now();

  const cached = hfCache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    console.log(`[HF] Cache hit for ${cacheKey}`);
    return cached.data;
  }

  const pipelineTag = TASK_TO_PIPELINE[taskType];
  if (!pipelineTag) {
    throw new Error(`No HF pipeline mapping for task type: ${taskType}`);
  }

  const params = new URLSearchParams({
    pipeline_tag: pipelineTag,
    sort: "downloads",
    direction: "-1",
    limit: "50",
  });

  const url = `https://huggingface.co/api/models?${params}`;
  const headers: Record<string, string> = {};
  const hfToken = process.env.HF_TOKEN;
  if (hfToken) {
    headers["Authorization"] = `Bearer ${hfToken}`;
  }

  console.log(`[HF] Fetching models for ${taskType} from HF Hub...`);
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) });

  if (!response.ok) {
    throw new Error(`HF API returned ${response.status}: ${response.statusText}`);
  }

  let hfModels: HfModel[] = await response.json();

  // For code-generation, filter to models with "code" in name or tags
  if (taskType === "code-generation") {
    hfModels = hfModels.filter((m) => {
      const lower = m.modelId.toLowerCase();
      return (
        lower.includes("code") ||
        lower.includes("coder") ||
        lower.includes("starcoder") ||
        m.tags.some((t) => t.toLowerCase().includes("code"))
      );
    });
  }

  // Resolve parameter counts (try safetensors → name parsing → architecture estimate)
  const modelsWithParams = hfModels.map((m) => {
    const count =
      getParamCountFromSafetensors(m)
      ?? parseParamsFromName(m.modelId)
      ?? estimateParamsFromType(m.modelId, m.tags)
      ?? 0;
    return { model: m, paramCount: count };
  });

  // Filter out models with no discernible parameter count
  const validModels = modelsWithParams.filter((m) => m.paramCount > 0);

  if (validModels.length === 0) {
    throw new Error(`No valid models returned from HF for task: ${taskType}`);
  }

  // Compute batch-level maxes for scoring
  const maxDownloads = Math.max(...validModels.map((m) => m.model.downloads));
  const maxLikes = Math.max(...validModels.map((m) => m.model.likes));
  const maxParams = Math.max(...validModels.map((m) => m.paramCount));

  // Transform and score
  const recommendations: ModelRecommendation[] = validModels.map(({ model, paramCount }) => {
    const license = extractLicense(model.tags);
    const modMs = new Date(model.lastModified).getTime();
    const daysSinceUpdate = Number.isFinite(modMs)
      ? (Date.now() - modMs) / (1000 * 60 * 60 * 24)
      : 90;
    const nameParts = model.modelId.split("/");
    const provider = nameParts.length > 1 ? nameParts[0] : "Community";
    const name = nameParts.length > 1 ? nameParts[1] : nameParts[0];

    return {
      id: model.modelId,
      name,
      provider,
      parameters: formatParams(paramCount),
      memoryRequired: estimateMemory(paramCount),
      latency: estimateLatency(paramCount),
      license,
      score: scoreModel(model, paramCount, maxDownloads, maxLikes, maxParams, license),
      reasoning: generateReasoning(model, paramCount, license),
      tradeoffs: generateTradeoffs(paramCount, license, daysSinceUpdate, model.downloads, model.likes, model.modelId),
      isWarning: false,
    };
  });

  // Sort by score descending, take top 10
  recommendations.sort((a, b) => b.score - a.score);
  const topModels = recommendations.slice(0, 10);

  hfCache.set(cacheKey, { data: topModels, expiresAt: now + HF_CACHE_TTL_MS });
  console.log(`[HF] Cached ${topModels.length} models for ${cacheKey}`);

  return topModels;
}
