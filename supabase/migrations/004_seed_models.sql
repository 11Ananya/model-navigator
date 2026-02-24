-- Migration 004: Seed initial model data
-- Run this in the Supabase SQL Editor (after 001)
-- Uses INSERT ... ON CONFLICT DO UPDATE so it's safe to re-run

INSERT INTO public.models
  (id, name, provider, parameters, memory_required, latency, license,
   base_score, reasoning, tradeoffs, task_types,
   inference_frameworks, quantization_formats, deployment_targets,
   is_warning, is_active)
VALUES

-- ── TEXT GENERATION ───────────────────────────────────────────────────────────
(
  'llama-3.1-8b', 'Llama 3.1 8B Instruct', 'Meta', '8B', '16 GB', '~50ms/token',
  'Llama 3.1 Community', 94,
  'Best balance of quality and efficiency for your constraints. Strong instruction following with reasonable memory footprint.',
  ARRAY['Requires custom license agreement', 'Not fully open-source'],
  ARRAY['text-generation', 'summarization', 'question-answering'],
  ARRAY['transformers', 'llama.cpp', 'vllm', 'ollama'],
  ARRAY['none', 'int8', 'int4', 'gptq', 'awq'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),
(
  'mistral-7b', 'Mistral 7B Instruct v0.3', 'Mistral AI', '7B', '14 GB', '~45ms/token',
  'Apache 2.0', 89,
  'Excellent Apache-licensed alternative with strong performance on instruction tasks.',
  ARRAY['Slightly lower benchmark scores', 'Smaller context window than Llama'],
  ARRAY['text-generation', 'summarization', 'question-answering'],
  ARRAY['transformers', 'llama.cpp', 'vllm', 'ollama'],
  ARRAY['none', 'int8', 'int4', 'gptq', 'awq'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),
(
  'phi-3-mini', 'Phi-3 Mini 4K', 'Microsoft', '3.8B', '8 GB', '~30ms/token',
  'MIT', 82,
  'Highly efficient for memory-constrained environments with MIT license.',
  ARRAY['Limited context length', 'May struggle with complex reasoning'],
  ARRAY['text-generation', 'summarization', 'question-answering'],
  ARRAY['transformers', 'llama.cpp', 'ollama', 'onnx'],
  ARRAY['none', 'int8', 'int4'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),

-- ── CLASSIFICATION ────────────────────────────────────────────────────────────
(
  'deberta-v3-large', 'DeBERTa v3 Large', 'Microsoft', '304M', '2 GB', '~5ms',
  'MIT', 96,
  'State-of-the-art for classification tasks with minimal resource requirements.',
  ARRAY['Requires fine-tuning for custom tasks'],
  ARRAY['classification'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),
(
  'roberta-large', 'RoBERTa Large', 'Meta', '355M', '2 GB', '~5ms',
  'MIT', 91,
  'Battle-tested encoder with excellent fine-tuning ecosystem.',
  ARRAY['Slightly older architecture', 'Less efficient than DeBERTa'],
  ARRAY['classification', 'question-answering'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),
(
  'distilbert', 'DistilBERT Base', 'Hugging Face', '66M', '512 MB', '~2ms',
  'Apache 2.0', 78,
  'Ultra-efficient for high-throughput classification pipelines.',
  ARRAY['Lower accuracy ceiling', 'Best for simpler classification tasks'],
  ARRAY['classification'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),

-- ── SUMMARIZATION ─────────────────────────────────────────────────────────────
(
  'bart-large-cnn', 'BART Large CNN', 'Meta', '406M', '3 GB', '~20ms',
  'MIT', 92,
  'Purpose-built for summarization with strong abstractive capabilities.',
  ARRAY['Limited to shorter documents', 'English-focused'],
  ARRAY['summarization'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),
(
  'flan-t5-large', 'FLAN-T5 Large', 'Google', '780M', '4 GB', '~25ms',
  'Apache 2.0', 88,
  'Instruction-tuned encoder-decoder with good zero-shot summarization.',
  ARRAY['Higher memory than BART', 'Generalist model'],
  ARRAY['summarization', 'question-answering'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),

-- ── QUESTION ANSWERING ────────────────────────────────────────────────────────
(
  'roberta-squad', 'RoBERTa Base SQuAD', 'Community', '125M', '1 GB', '~3ms',
  'MIT', 86,
  'Optimal for extractive QA from documents with minimal resources.',
  ARRAY['Cannot generate answers', 'Requires context passage'],
  ARRAY['question-answering'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),
(
  'flan-t5-qa', 'FLAN-T5 Base', 'Google', '248M', '1.5 GB', '~10ms',
  'Apache 2.0', 81,
  'Good balance of efficiency and generative QA capability.',
  ARRAY['Less accurate than larger models', 'Limited context window'],
  ARRAY['question-answering'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),

-- ── CODE GENERATION ───────────────────────────────────────────────────────────
(
  'codellama-13b', 'Code Llama 13B Instruct', 'Meta', '13B', '26 GB', '~60ms/token',
  'Llama 2 Community', 95,
  'Purpose-built for code with strong multi-language support and instruction following.',
  ARRAY['Higher memory requirements', 'License restrictions for large deployments'],
  ARRAY['code-generation'],
  ARRAY['transformers', 'llama.cpp', 'vllm', 'ollama'],
  ARRAY['none', 'int8', 'int4', 'gptq'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),
(
  'starcoder2-7b', 'StarCoder2 7B', 'BigCode', '7B', '14 GB', '~45ms/token',
  'BigCode OpenRAIL-M', 90,
  'Excellent permissive-licensed code model with broad language coverage.',
  ARRAY['Slightly lower than Code Llama on benchmarks', 'Newer, less battle-tested'],
  ARRAY['code-generation'],
  ARRAY['transformers', 'llama.cpp', 'vllm', 'ollama'],
  ARRAY['none', 'int8', 'int4', 'gptq'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),
(
  'deepseek-coder-6.7b', 'DeepSeek Coder 6.7B', 'DeepSeek', '6.7B', '14 GB', '~40ms/token',
  'DeepSeek License', 87,
  'Strong performance with efficient inference for code tasks.',
  ARRAY['Custom license terms', 'Less community tooling'],
  ARRAY['code-generation'],
  ARRAY['transformers', 'llama.cpp', 'vllm', 'ollama'],
  ARRAY['none', 'int8', 'int4'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm'],
  FALSE, TRUE
),

-- ── EMBEDDING ─────────────────────────────────────────────────────────────────
(
  'bge-large', 'BGE Large EN v1.5', 'BAAI', '335M', '1.5 GB', '~3ms',
  'MIT', 97,
  'State-of-the-art embedding model with excellent retrieval performance.',
  ARRAY['English-focused', 'Larger than some alternatives'],
  ARRAY['embedding'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),
(
  'e5-large', 'E5 Large v2', 'Microsoft', '335M', '1.5 GB', '~3ms',
  'MIT', 94,
  'Strong multilingual support with consistent embedding quality.',
  ARRAY['Slightly lower English-only benchmarks', 'Requires prefix formatting'],
  ARRAY['embedding'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),
(
  'gte-small', 'GTE Small', 'Alibaba', '33M', '256 MB', '~1ms',
  'MIT', 85,
  'Ultra-efficient for high-throughput embedding pipelines.',
  ARRAY['Lower accuracy ceiling', 'Best for simpler retrieval tasks'],
  ARRAY['embedding'],
  ARRAY['transformers', 'onnx'],
  ARRAY['none', 'int8'],
  ARRAY['local-dev', 'on-prem-server', 'cloud-vm', 'edge-device'],
  FALSE, TRUE
),

-- ── WARNING MODELS (one per task type) ────────────────────────────────────────
(
  'gpt2-large', 'GPT-2 Large', 'OpenAI', '774M', '3 GB', '~15ms/token',
  'MIT', 0,
  'Outdated architecture with poor instruction following. Modern alternatives significantly outperform on all metrics.',
  ARRAY['No instruction tuning', 'Poor safety alignment', 'Inferior quality'],
  ARRAY['text-generation'],
  ARRAY['transformers'],
  ARRAY['none'],
  ARRAY['local-dev'],
  TRUE, TRUE
),
(
  'bert-base', 'BERT Base (uncased)', 'Google', '110M', '1 GB', '~4ms',
  'Apache 2.0', 0,
  'Superseded by DeBERTa and RoBERTa on virtually all classification benchmarks.',
  ARRAY['Outdated tokenization', 'Lower accuracy', 'Better alternatives exist'],
  ARRAY['classification'],
  ARRAY['transformers'],
  ARRAY['none'],
  ARRAY['local-dev'],
  TRUE, TRUE
),
(
  't5-small', 'T5 Small', 'Google', '60M', '512 MB', '~8ms',
  'Apache 2.0', 0,
  'Too small for quality summaries. Produces repetitive and incoherent outputs.',
  ARRAY['Poor output quality', 'Repetition issues', 'Use FLAN-T5 instead'],
  ARRAY['summarization'],
  ARRAY['transformers'],
  ARRAY['none'],
  ARRAY['local-dev'],
  TRUE, TRUE
),
(
  'distilbert-qa', 'DistilBERT SQuAD', 'Hugging Face', '66M', '512 MB', '~2ms',
  'Apache 2.0', 0,
  'Accuracy too low for production QA. High error rate on complex questions.',
  ARRAY['15% lower accuracy', 'Misses nuanced answers', 'Use RoBERTa instead'],
  ARRAY['question-answering'],
  ARRAY['transformers'],
  ARRAY['none'],
  ARRAY['local-dev'],
  TRUE, TRUE
),
(
  'codegen-350m', 'CodeGen 350M', 'Salesforce', '350M', '1.5 GB', '~10ms/token',
  'Apache 2.0', 0,
  'Too small for reliable code generation. High syntax error rate and limited language support.',
  ARRAY['Frequent syntax errors', 'Limited language support', 'Outdated training'],
  ARRAY['code-generation'],
  ARRAY['transformers'],
  ARRAY['none'],
  ARRAY['local-dev'],
  TRUE, TRUE
),
(
  'sentence-bert', 'Sentence-BERT Base', 'UKP Lab', '110M', '1 GB', '~3ms',
  'Apache 2.0', 0,
  'Significantly outperformed by modern embedding models like BGE and E5.',
  ARRAY['20% lower retrieval accuracy', 'Outdated architecture', 'Use BGE instead'],
  ARRAY['embedding'],
  ARRAY['transformers'],
  ARRAY['none'],
  ARRAY['local-dev'],
  TRUE, TRUE
)

ON CONFLICT (id) DO UPDATE SET
  name                 = EXCLUDED.name,
  provider             = EXCLUDED.provider,
  parameters           = EXCLUDED.parameters,
  memory_required      = EXCLUDED.memory_required,
  latency              = EXCLUDED.latency,
  license              = EXCLUDED.license,
  base_score           = EXCLUDED.base_score,
  reasoning            = EXCLUDED.reasoning,
  tradeoffs            = EXCLUDED.tradeoffs,
  task_types           = EXCLUDED.task_types,
  inference_frameworks = EXCLUDED.inference_frameworks,
  quantization_formats = EXCLUDED.quantization_formats,
  deployment_targets   = EXCLUDED.deployment_targets,
  is_warning           = EXCLUDED.is_warning,
  is_active            = EXCLUDED.is_active,
  updated_at           = NOW();
