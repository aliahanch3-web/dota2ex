-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create table for caching hero guides
CREATE TABLE public.hero_guides_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hero_name TEXT NOT NULL UNIQUE,
  guide_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_guides_cache ENABLE ROW LEVEL SECURITY;

-- Allow public read access (no authentication needed for reading cached guides)
CREATE POLICY "Anyone can read cached hero guides"
ON public.hero_guides_cache
FOR SELECT
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_hero_guides_cache_hero_name ON public.hero_guides_cache(hero_name);