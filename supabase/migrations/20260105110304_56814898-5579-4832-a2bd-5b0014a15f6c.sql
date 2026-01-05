-- Allow service role to insert cached guides
CREATE POLICY "Service role can insert cached hero guides"
ON public.hero_guides_cache
FOR INSERT
WITH CHECK (true);