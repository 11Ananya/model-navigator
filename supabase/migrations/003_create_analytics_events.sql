-- Migration 003: Create analytics_events table
-- Run this in the Supabase SQL Editor (after 002)

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id               TEXT,
  task_type                TEXT NOT NULL,
  gpu_memory               TEXT NOT NULL,
  inference_device         TEXT NOT NULL,
  max_latency              INTEGER NOT NULL,
  license_type             TEXT NOT NULL,
  inference_framework      TEXT,
  quantization             TEXT,
  deployment_target        TEXT,
  had_use_case_description BOOLEAN NOT NULL DEFAULT FALSE,
  primary_model_id         TEXT,
  alternative_model_ids    TEXT[],
  warning_model_id         TEXT,
  used_llm_reranking       BOOLEAN NOT NULL DEFAULT FALSE,
  response_time_ms         INTEGER,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inserts from service role only — no RLS policies for anon/user SELECT
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Index for analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_task_type  ON public.analytics_events (task_type);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON public.analytics_events (created_at DESC);
