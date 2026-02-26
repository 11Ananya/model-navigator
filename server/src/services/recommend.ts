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

// ─── Use-case keyword matching ───────────────────────────────────────────────

/** Keyword clusters that signal preferences for certain model traits. */
const USE_CASE_SIGNALS: {
  keywords: string[];
  prefer: (m: ModelRecommendation) => boolean;
  weight: number;
}[] = [
  // User mentions speed / real-time → prefer low-latency (small) models
  {
    keywords: ["fast", "real-time", "realtime", "low latency", "speed", "quick", "responsive", "streaming"],
    prefer: (m) => parseLatency(m.latency) <= 30 || parseMemoryGB(m.memoryRequired) <= 4,
    weight: 10,
  },
  // User mentions efficiency / edge / mobile / lightweight
  {
    keywords: ["edge", "mobile", "lightweight", "efficient", "small", "tiny", "embedded", "raspberry", "phone", "iot"],
    prefer: (m) => parseMemoryGB(m.memoryRequired) <= 4,
    weight: 12,
  },
  // User mentions quality / accuracy / complex / reasoning
  {
    keywords: ["accurate", "accuracy", "quality", "complex", "reasoning", "nuanced", "sophisticated", "advanced", "best"],
    prefer: (m) => parseMemoryGB(m.memoryRequired) >= 8,
    weight: 8,
  },
  // User mentions production / enterprise / commercial
  {
    keywords: ["production", "enterprise", "commercial", "business", "company", "deploy", "scale"],
    prefer: (m) => isPermissiveLicense(m.license),
    weight: 8,
  },
  // User mentions code-related tasks
  {
    keywords: ["code", "coding", "programming", "developer", "ide", "copilot", "autocomplete", "software"],
    prefer: (m) => {
      const n = (m.name + " " + m.id).toLowerCase();
      return n.includes("code") || n.includes("coder") || n.includes("starcoder") || n.includes("deepseek");
    },
    weight: 10,
  },
  // User mentions chat / conversation / assistant
  {
    keywords: ["chat", "chatbot", "conversation", "assistant", "support", "customer service", "helpdesk"],
    prefer: (m) => {
      const n = (m.name + " " + m.id).toLowerCase();
      return n.includes("instruct") || n.includes("chat") || n.includes("hermes");
    },
    weight: 8,
  },
  // User mentions privacy / on-prem / self-hosted / local
  {
    keywords: ["privacy", "private", "on-prem", "on-premise", "self-hosted", "local", "offline", "air-gap"],
    prefer: (m) => isPermissiveLicense(m.license) && parseMemoryGB(m.memoryRequired) <= 16,
    weight: 6,
  },
  // User mentions cost / budget / cheap / free
  {
    keywords: ["cost", "budget", "cheap", "free", "affordable", "economical", "save money"],
    prefer: (m) => parseMemoryGB(m.memoryRequired) <= 8,
    weight: 8,
  },
  // User mentions summarization / documents / legal / medical
  {
    keywords: ["summarize", "summarization", "document", "legal", "medical", "clinical", "report", "paper"],
    prefer: (m) => {
      const n = (m.name + " " + m.id).toLowerCase();
      return n.includes("bart") || n.includes("t5") || n.includes("flan") || parseMemoryGB(m.memoryRequired) >= 8;
    },
    weight: 8,
  },
  // User mentions multilingual / translation
  {
    keywords: ["multilingual", "translation", "translate", "language", "spanish", "french", "chinese", "german", "japanese"],
    prefer: (m) => {
      const n = (m.name + " " + m.id).toLowerCase();
      return n.includes("e5") || n.includes("multilingual") || n.includes("llama") || n.includes("qwen");
    },
    weight: 8,
  },
];

function adjustScoreForUseCase(
  model: ModelRecommendation,
  description: string
): number {
  if (!description.trim()) return 0;

  const lower = description.toLowerCase();
  let bonus = 0;

  for (const signal of USE_CASE_SIGNALS) {
    const matched = signal.keywords.some((kw) => lower.includes(kw));
    if (matched && signal.prefer(model)) {
      bonus += signal.weight;
    }
  }

  // Also boost models whose name/provider appears directly in the description
  const modelTerms = [
    model.name.toLowerCase(),
    model.provider.toLowerCase(),
    model.id.toLowerCase(),
  ];
  for (const term of modelTerms) {
    if (term.length >= 3 && lower.includes(term)) {
      bonus += 15;
      break; // don't double-count
    }
  }

  return Math.min(bonus, 25); // cap at 25-point max boost
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

  // Score + sort (latency + use-case adjustments)
  const sorted = filtered
    .map((m) => ({
      ...m,
      _adj: adjustScoreForLatency(m, config.maxLatency)
        + adjustScoreForUseCase(m, config.useCaseDescription),
    }))
    .sort((a, b) => b._adj - a._adj)
    .map(({ _adj, ...m }) => m);

  return {
    primary: sorted[0] ?? allModels[0],
    alternatives: sorted.slice(1, 3),
    warning: warningModel,
  };
}
