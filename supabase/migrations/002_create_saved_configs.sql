-- Migration 002: Create saved_configs table
-- Run this in the Supabase SQL Editor (after 001)

CREATE TABLE IF NOT EXISTS public.saved_configs (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name                 TEXT NOT NULL,
  task_type            TEXT NOT NULL,
  gpu_memory           TEXT NOT NULL,
  inference_device     TEXT NOT NULL,
  max_latency          INTEGER NOT NULL,
  license_type         TEXT NOT NULL,
  inference_framework  TEXT NOT NULL DEFAULT 'any',
  quantization         TEXT NOT NULL DEFAULT 'none',
  deployment_target    TEXT NOT NULL DEFAULT 'local-dev',
  use_case_description TEXT NOT NULL DEFAULT '',
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT saved_configs_name_unique_per_user UNIQUE (user_id, name)
);

-- Row Level Security — each user sees only their own configs
ALTER TABLE public.saved_configs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own configs" ON public.saved_configs;
CREATE POLICY "Users manage own configs"
  ON public.saved_configs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
