import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface AbilityInfo {
  name: string;
  description: string;
  tips: string[];
}

export interface SkillBuild {
  early: string;
  priority: string;
  ultimate: string;
}

export interface ItemBuild {
  starting: string[];
  early: string[];
  core: string[];
  luxury: string[];
}

export interface Playstyle {
  laning: string;
  midGame: string;
  lateGame: string;
  tips: string[];
}

export interface FacetInfo {
  name: string;
  description: string;
  recommendation: string;
}

export interface HeroGuide {
  abilities: AbilityInfo[];
  skillBuild: SkillBuild;
  items: ItemBuild;
  playstyle: Playstyle;
  facets?: FacetInfo[];
}

export const useHeroGuide = () => {
  const [guide, setGuide] = useState<HeroGuide | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getHeroGuide = useCallback(async (heroName: string, forceRefresh = false) => {
    setIsLoading(true);
    setError(null);
    setGuide(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('hero-guide', {
        body: { heroName, forceRefresh }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.guide) {
        setGuide(data.guide);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error fetching hero guide:", err);
      setError(err instanceof Error ? err.message : "خطا در دریافت راهنمای هیرو");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refreshGuide = useCallback(async (heroName: string) => {
    setIsRefreshing(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('hero-guide', {
        body: { heroName, forceRefresh: true }
      });

      if (fnError) {
        throw new Error(fnError.message);
      }

      if (data?.guide) {
        setGuide(data.guide);
      } else if (data?.error) {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error("Error refreshing hero guide:", err);
      setError(err instanceof Error ? err.message : "خطا در بروزرسانی راهنما");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const clearGuide = useCallback(() => {
    setGuide(null);
    setError(null);
  }, []);

  return {
    guide,
    isLoading,
    isRefreshing,
    error,
    getHeroGuide,
    refreshGuide,
    clearGuide
  };
};
