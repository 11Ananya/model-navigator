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

export interface DemoConfig {
  taskType: string;
  gpuMemory: string;
  inferenceDevice: string;
  maxLatency: number;
  licenseType: string;
}

export const taskTypes = [
  { value: "text-generation", label: "Text Generation" },
  { value: "classification", label: "Text Classification" },
  { value: "summarization", label: "Summarization" },
  { value: "question-answering", label: "Question Answering" },
  { value: "code-generation", label: "Code Generation" },
  { value: "embedding", label: "Text Embeddings" },
];

export const gpuMemoryOptions = [
  { value: "8gb", label: "8 GB" },
  { value: "16gb", label: "16 GB" },
  { value: "24gb", label: "24 GB" },
  { value: "40gb", label: "40 GB" },
  { value: "80gb", label: "80 GB+" },
];

export const inferenceDevices = [
  { value: "consumer-gpu", label: "Consumer GPU (RTX 3090/4090)" },
  { value: "datacenter-gpu", label: "Datacenter GPU (A100/H100)" },
  { value: "cpu-only", label: "CPU Only" },
  { value: "apple-silicon", label: "Apple Silicon (M1/M2/M3)" },
];

export const licenseTypes = [
  { value: "any", label: "Any License" },
  { value: "permissive", label: "Permissive (MIT, Apache)" },
  { value: "commercial", label: "Commercial Use Allowed" },
  { value: "non-commercial", label: "Non-Commercial Only" },
];

// Sample model data that changes based on configuration
const modelDatabase: Record<string, ModelRecommendation[]> = {
  "text-generation": [
    {
      id: "llama-3.1-8b",
      name: "Llama 3.1 8B Instruct",
      provider: "Meta",
      parameters: "8B",
      memoryRequired: "16 GB",
      latency: "~50ms/token",
      license: "Llama 3.1 Community",
      score: 94,
      reasoning: "Best balance of quality and efficiency for your constraints. Strong instruction following with reasonable memory footprint.",
      tradeoffs: ["Requires custom license agreement", "Not fully open-source"],
    },
    {
      id: "mistral-7b",
      name: "Mistral 7B Instruct v0.3",
      provider: "Mistral AI",
      parameters: "7B",
      memoryRequired: "14 GB",
      latency: "~45ms/token",
      license: "Apache 2.0",
      score: 89,
      reasoning: "Excellent Apache-licensed alternative with strong performance on instruction tasks.",
      tradeoffs: ["Slightly lower benchmark scores", "Smaller context window than Llama"],
    },
    {
      id: "phi-3-mini",
      name: "Phi-3 Mini 4K",
      provider: "Microsoft",
      parameters: "3.8B",
      memoryRequired: "8 GB",
      latency: "~30ms/token",
      license: "MIT",
      score: 82,
      reasoning: "Highly efficient for memory-constrained environments with MIT license.",
      tradeoffs: ["Limited context length", "May struggle with complex reasoning"],
    },
  ],
  "classification": [
    {
      id: "deberta-v3-large",
      name: "DeBERTa v3 Large",
      provider: "Microsoft",
      parameters: "304M",
      memoryRequired: "2 GB",
      latency: "~5ms",
      license: "MIT",
      score: 96,
      reasoning: "State-of-the-art for classification tasks with minimal resource requirements.",
      tradeoffs: ["Requires fine-tuning for custom tasks"],
    },
    {
      id: "roberta-large",
      name: "RoBERTa Large",
      provider: "Meta",
      parameters: "355M",
      memoryRequired: "2 GB",
      latency: "~5ms",
      license: "MIT",
      score: 91,
      reasoning: "Battle-tested encoder with excellent fine-tuning ecosystem.",
      tradeoffs: ["Slightly older architecture", "Less efficient than DeBERTa"],
    },
    {
      id: "distilbert",
      name: "DistilBERT Base",
      provider: "Hugging Face",
      parameters: "66M",
      memoryRequired: "512 MB",
      latency: "~2ms",
      license: "Apache 2.0",
      reasoning: "Ultra-efficient for high-throughput classification pipelines.",
      score: 78,
      tradeoffs: ["Lower accuracy ceiling", "Best for simpler classification tasks"],
    },
  ],
  "summarization": [
    {
      id: "bart-large-cnn",
      name: "BART Large CNN",
      provider: "Meta",
      parameters: "406M",
      memoryRequired: "3 GB",
      latency: "~20ms",
      license: "MIT",
      score: 92,
      reasoning: "Purpose-built for summarization with strong abstractive capabilities.",
      tradeoffs: ["Limited to shorter documents", "English-focused"],
    },
    {
      id: "flan-t5-large",
      name: "FLAN-T5 Large",
      provider: "Google",
      parameters: "780M",
      memoryRequired: "4 GB",
      latency: "~25ms",
      license: "Apache 2.0",
      score: 88,
      reasoning: "Instruction-tuned encoder-decoder with good zero-shot summarization.",
      tradeoffs: ["Higher memory than BART", "Generalist model"],
    },
    {
      id: "llama-3.1-8b-sum",
      name: "Llama 3.1 8B Instruct",
      provider: "Meta",
      parameters: "8B",
      memoryRequired: "16 GB",
      latency: "~50ms/token",
      license: "Llama 3.1 Community",
      score: 85,
      reasoning: "Best for long-form, nuanced summaries when resources allow.",
      tradeoffs: ["Much higher resource requirements", "Overkill for simple summaries"],
    },
  ],
  "question-answering": [
    {
      id: "llama-3.1-8b-qa",
      name: "Llama 3.1 8B Instruct",
      provider: "Meta",
      parameters: "8B",
      memoryRequired: "16 GB",
      latency: "~50ms/token",
      license: "Llama 3.1 Community",
      score: 93,
      reasoning: "Excellent for complex, multi-hop reasoning with strong context understanding.",
      tradeoffs: ["Higher latency for simple questions", "License restrictions"],
    },
    {
      id: "roberta-squad",
      name: "RoBERTa Base SQuAD",
      provider: "Community",
      parameters: "125M",
      memoryRequired: "1 GB",
      latency: "~3ms",
      license: "MIT",
      score: 86,
      reasoning: "Optimal for extractive QA from documents with minimal resources.",
      tradeoffs: ["Cannot generate answers", "Requires context passage"],
    },
    {
      id: "flan-t5-qa",
      name: "FLAN-T5 Base",
      provider: "Google",
      parameters: "248M",
      memoryRequired: "1.5 GB",
      latency: "~10ms",
      license: "Apache 2.0",
      score: 81,
      reasoning: "Good balance of efficiency and generative QA capability.",
      tradeoffs: ["Less accurate than larger models", "Limited context window"],
    },
  ],
  "code-generation": [
    {
      id: "codellama-13b",
      name: "Code Llama 13B Instruct",
      provider: "Meta",
      parameters: "13B",
      memoryRequired: "26 GB",
      latency: "~60ms/token",
      license: "Llama 2 Community",
      score: 95,
      reasoning: "Purpose-built for code with strong multi-language support and instruction following.",
      tradeoffs: ["Higher memory requirements", "License restrictions for large deployments"],
    },
    {
      id: "starcoder2-7b",
      name: "StarCoder2 7B",
      provider: "BigCode",
      parameters: "7B",
      memoryRequired: "14 GB",
      latency: "~45ms/token",
      license: "BigCode OpenRAIL-M",
      score: 90,
      reasoning: "Excellent permissive-licensed code model with broad language coverage.",
      tradeoffs: ["Slightly lower than Code Llama on benchmarks", "Newer, less battle-tested"],
    },
    {
      id: "deepseek-coder-6.7b",
      name: "DeepSeek Coder 6.7B",
      provider: "DeepSeek",
      parameters: "6.7B",
      memoryRequired: "14 GB",
      latency: "~40ms/token",
      license: "DeepSeek License",
      score: 87,
      reasoning: "Strong performance with efficient inference for code tasks.",
      tradeoffs: ["Custom license terms", "Less community tooling"],
    },
  ],
  "embedding": [
    {
      id: "bge-large",
      name: "BGE Large EN v1.5",
      provider: "BAAI",
      parameters: "335M",
      memoryRequired: "1.5 GB",
      latency: "~3ms",
      license: "MIT",
      score: 97,
      reasoning: "State-of-the-art embedding model with excellent retrieval performance.",
      tradeoffs: ["English-focused", "Larger than some alternatives"],
    },
    {
      id: "e5-large",
      name: "E5 Large v2",
      provider: "Microsoft",
      parameters: "335M",
      memoryRequired: "1.5 GB",
      latency: "~3ms",
      license: "MIT",
      score: 94,
      reasoning: "Strong multilingual support with consistent embedding quality.",
      tradeoffs: ["Slightly lower English-only benchmarks", "Requires prefix formatting"],
    },
    {
      id: "gte-small",
      name: "GTE Small",
      provider: "Alibaba",
      parameters: "33M",
      memoryRequired: "256 MB",
      latency: "~1ms",
      license: "MIT",
      score: 85,
      reasoning: "Ultra-efficient for high-throughput embedding pipelines.",
      tradeoffs: ["Lower accuracy ceiling", "Best for simpler retrieval tasks"],
    },
  ],
};

const warningModels: Record<string, ModelRecommendation> = {
  "text-generation": {
    id: "gpt2-large",
    name: "GPT-2 Large",
    provider: "OpenAI",
    parameters: "774M",
    memoryRequired: "3 GB",
    latency: "~15ms/token",
    license: "MIT",
    score: 0,
    reasoning: "Outdated architecture with poor instruction following. Modern alternatives significantly outperform on all metrics.",
    tradeoffs: ["No instruction tuning", "Poor safety alignment", "Inferior quality"],
    isWarning: true,
  },
  "classification": {
    id: "bert-base",
    name: "BERT Base (uncased)",
    provider: "Google",
    parameters: "110M",
    memoryRequired: "1 GB",
    latency: "~4ms",
    license: "Apache 2.0",
    score: 0,
    reasoning: "Superseded by DeBERTa and RoBERTa on virtually all classification benchmarks.",
    tradeoffs: ["Outdated tokenization", "Lower accuracy", "Better alternatives exist"],
    isWarning: true,
  },
  "summarization": {
    id: "t5-small",
    name: "T5 Small",
    provider: "Google",
    parameters: "60M",
    memoryRequired: "512 MB",
    latency: "~8ms",
    license: "Apache 2.0",
    score: 0,
    reasoning: "Too small for quality summaries. Produces repetitive and incoherent outputs.",
    tradeoffs: ["Poor output quality", "Repetition issues", "Use FLAN-T5 instead"],
    isWarning: true,
  },
  "question-answering": {
    id: "distilbert-qa",
    name: "DistilBERT SQuAD",
    provider: "Hugging Face",
    parameters: "66M",
    memoryRequired: "512 MB",
    latency: "~2ms",
    license: "Apache 2.0",
    score: 0,
    reasoning: "Accuracy too low for production QA. High error rate on complex questions.",
    tradeoffs: ["15% lower accuracy", "Misses nuanced answers", "Use RoBERTa instead"],
    isWarning: true,
  },
  "code-generation": {
    id: "codegen-350m",
    name: "CodeGen 350M",
    provider: "Salesforce",
    parameters: "350M",
    memoryRequired: "1.5 GB",
    latency: "~10ms/token",
    license: "Apache 2.0",
    score: 0,
    reasoning: "Too small for reliable code generation. High syntax error rate and limited language support.",
    tradeoffs: ["Frequent syntax errors", "Limited language support", "Outdated training"],
    isWarning: true,
  },
  "embedding": {
    id: "sentence-bert",
    name: "Sentence-BERT Base",
    provider: "UKP Lab",
    parameters: "110M",
    memoryRequired: "1 GB",
    latency: "~3ms",
    license: "Apache 2.0",
    score: 0,
    reasoning: "Significantly outperformed by modern embedding models like BGE and E5.",
    tradeoffs: ["20% lower retrieval accuracy", "Outdated architecture", "Use BGE instead"],
    isWarning: true,
  },
};

export function getRecommendations(config: DemoConfig): {
  primary: ModelRecommendation;
  alternatives: ModelRecommendation[];
  warning: ModelRecommendation;
} {
  const models = modelDatabase[config.taskType] || modelDatabase["text-generation"];
  const warning = warningModels[config.taskType] || warningModels["text-generation"];

  // Filter based on GPU memory (simplified logic for demo)
  let filteredModels = [...models];
  
  if (config.gpuMemory === "8gb") {
    filteredModels = models.filter(m => 
      parseFloat(m.memoryRequired) <= 8 || m.memoryRequired.includes("MB")
    );
  } else if (config.gpuMemory === "16gb") {
    filteredModels = models.filter(m => 
      parseFloat(m.memoryRequired) <= 16 || m.memoryRequired.includes("MB")
    );
  }

  // If filtering removed all models, use originals
  if (filteredModels.length === 0) {
    filteredModels = models;
  }

  // Filter by license
  if (config.licenseType === "permissive") {
    const permissive = filteredModels.filter(m => 
      m.license.includes("MIT") || m.license.includes("Apache")
    );
    if (permissive.length > 0) filteredModels = permissive;
  }

  // Sort by score (adjusted for latency preference)
  const sortedModels = filteredModels.sort((a, b) => {
    let scoreA = a.score;
    let scoreB = b.score;
    
    // Boost lower latency models if user wants < 100ms
    if (config.maxLatency < 100) {
      const latencyA = parseInt(a.latency) || 50;
      const latencyB = parseInt(b.latency) || 50;
      scoreA += (100 - latencyA) * 0.1;
      scoreB += (100 - latencyB) * 0.1;
    }
    
    return scoreB - scoreA;
  });

  return {
    primary: sortedModels[0],
    alternatives: sortedModels.slice(1, 3),
    warning,
  };
}
