-- Create table for caching counter suggestions
CREATE TABLE public.counter_suggestions_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  enemy_heroes_key TEXT NOT NULL UNIQUE,
  suggestions_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.counter_suggestions_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Anyone can read cached counter suggestions"
ON public.counter_suggestions_cache
FOR SELECT
USING (true);

-- Allow service role to insert
CREATE POLICY "Service role can insert cached counter suggestions"
ON public.counter_suggestions_cache
FOR INSERT
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_counter_suggestions_cache_key ON public.counter_suggestions_cache(enemy_heroes_key);