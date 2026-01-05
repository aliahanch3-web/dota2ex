-- Allow service role to delete cached hero guides for refresh
CREATE POLICY "Service role can delete cached hero guides"
ON public.hero_guides_cache
FOR DELETE
USING (true);