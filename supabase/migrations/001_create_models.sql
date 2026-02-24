-- Migration 001: Create models table
-- Run this in the Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.models (
  id                   TEXT PRIMARY KEY,
  name                 TEXT NOT NULL,
  provider             TEXT NOT NULL,
  parameters           TEXT NOT NULL,
  memory_required      TEXT NOT NULL,       -- e.g. "16 GB", "512 MB"
  latency              TEXT NOT NULL,       -- e.g. "~50ms/token", "~5ms"
  license              TEXT NOT NULL,
  base_score           INTEGER NOT NULL CHECK (base_score BETWEEN 0 AND 100),
  reasoning            TEXT NOT NULL,
  tradeoffs            TEXT[] NOT NULL DEFAULT '{}',
  task_types           TEXT[] NOT NULL DEFAULT '{}',
  inference_frameworks TEXT[] NOT NULL DEFAULT '{}',
  quantization_formats TEXT[] NOT NULL DEFAULT '{}',
  deployment_targets   TEXT[] NOT NULL DEFAULT '{}',
  is_warning           BOOLEAN NOT NULL DEFAULT FALSE,
  is_active            BOOLEAN NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- GIN indexes for array containment queries (WHERE 'value' = ANY(column))
CREATE INDEX IF NOT EXISTS idx_models_task_types            ON public.models USING GIN (task_types);
CREATE INDEX IF NOT EXISTS idx_models_inference_frameworks  ON public.models USING GIN (inference_frameworks);
CREATE INDEX IF NOT EXISTS idx_models_quantization          ON public.models USING GIN (quantization_formats);
CREATE INDEX IF NOT EXISTS idx_models_deployment            ON public.models USING GIN (deployment_targets);

-- Row Level Security
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Anyone can read active models; only service role (backend) can write
DROP POLICY IF EXISTS "Public read active models" ON public.models;
CREATE POLICY "Public read active models"
  ON public.models FOR SELECT
  USING (is_active = TRUE);
