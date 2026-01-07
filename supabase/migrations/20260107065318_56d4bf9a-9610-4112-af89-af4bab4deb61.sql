-- Create a table to cache team analysis results
CREATE TABLE public.team_analysis_cache (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    team_heroes_key TEXT NOT NULL UNIQUE,
    analysis_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.team_analysis_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read cached analysis (public data)
CREATE POLICY "Anyone can read cached team analysis" 
ON public.team_analysis_cache 
FOR SELECT 
USING (true);

-- Allow service role to insert cached analysis
CREATE POLICY "Service role can insert cached team analysis" 
ON public.team_analysis_cache 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX idx_team_analysis_cache_team_heroes_key ON public.team_analysis_cache(team_heroes_key);