/**
 * Type definitions and schemas for InfraLens
 * 
 * These types define the boundary between UI and business logic.
 * All data structures used by both UI and recommendation engine are defined here.
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
}

export interface RecommendationResult {
  primary: ModelRecommendation;
  alternatives: ModelRecommendation[];
  warning: ModelRecommendation;
}

export type TaskType = 
  | "text-generation"
  | "classification"
  | "summarization"
  | "question-answering"
  | "code-generation"
  | "embedding";

export type GPUMemoryTier = "8gb" | "16gb" | "24gb" | "40gb" | "80gb";

export type InferenceDevice = 
  | "consumer-gpu"
  | "datacenter-gpu"
  | "cpu-only"
  | "apple-silicon";

export type LicenseType = 
  | "any"
  | "permissive"
  | "commercial"
  | "non-commercial";

/**
 * UI option arrays for form controls
 * These are used by the DemoInterface component
 */
export const taskTypes = [
  { value: "text-generation", label: "Text Generation" },
  { value: "classification", label: "Text Classification" },
  { value: "summarization", label: "Summarization" },
  { value: "question-answering", label: "Question Answering" },
  { value: "code-generation", label: "Code Generation" },
  { value: "embedding", label: "Text Embeddings" },
] as const;

export const gpuMemoryOptions = [
  { value: "8gb", label: "8 GB" },
  { value: "16gb", label: "16 GB" },
  { value: "24gb", label: "24 GB" },
  { value: "40gb", label: "40 GB" },
  { value: "80gb", label: "80 GB+" },
] as const;

export const inferenceDevices = [
  { value: "consumer-gpu", label: "Consumer GPU (RTX 3090/4090)" },
  { value: "datacenter-gpu", label: "Datacenter GPU (A100/H100)" },
  { value: "cpu-only", label: "CPU Only" },
  { value: "apple-silicon", label: "Apple Silicon (M1/M2/M3)" },
] as const;

export const licenseTypes = [
  { value: "any", label: "Any License" },
  { value: "permissive", label: "Permissive (MIT, Apache)" },
  { value: "commercial", label: "Commercial Use Allowed" },
  { value: "non-commercial", label: "Non-Commercial Only" },
] as const;
