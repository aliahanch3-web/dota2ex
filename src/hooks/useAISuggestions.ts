import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Hero, heroes } from "@/data/heroes";
import { PositionKey, positions } from "@/data/teamCompositions";
import { toast } from "@/hooks/use-toast";
import { CounterSuggestion } from "@/components/CounterPickSection";

export interface AISuggestion {
  hero: string;
  reason: string;
}

export interface TeamAnalysis {
  playstyle: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  timing: string;
}

export const useAISuggestions = () => {
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [teamAnalysis, setTeamAnalysis] = useState<TeamAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [counterSuggestions, setCounterSuggestions] = useState<CounterSuggestion[]>([]);
  const [isLoadingCounters, setIsLoadingCounters] = useState(false);

  const getAISuggestions = useCallback(
    async (selectedHeroes: Record<PositionKey, Hero | null>, targetPosition: PositionKey) => {
      setIsLoadingAI(true);
      setAiSuggestions([]);

      try {
        const position = positions.find((p) => p.key === targetPosition);
        const selectedHeroesData = Object.fromEntries(
          Object.entries(selectedHeroes).map(([key, hero]) => [
            key,
            hero ? { name: hero.name, role: hero.role } : null,
          ])
        );

        const { data, error } = await supabase.functions.invoke("suggest-heroes", {
          body: {
            type: "suggest",
            selectedHeroes: selectedHeroesData,
            targetPosition: position?.label || targetPosition,
            heroesData: heroes.map((h) => ({ name: h.name, role: h.role })),
          },
        });

        if (error) throw error;

        if (data?.error) {
          toast({
            title: "خطا",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        if (data?.suggestions && Array.isArray(data.suggestions)) {
          const validSuggestions = data.suggestions.filter((s: AISuggestion) =>
            heroes.some((h) => h.name.toLowerCase() === s.hero.toLowerCase())
          );
          setAiSuggestions(validSuggestions);
        }
      } catch (error) {
        console.error("AI suggestion error:", error);
        toast({
          title: "خطا در دریافت پیشنهادات هوشمند",
          description: "لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingAI(false);
      }
    },
    []
  );

  const analyzeTeam = useCallback(
    async (selectedHeroes: Record<PositionKey, Hero | null>) => {
      const allSelected = Object.values(selectedHeroes).every((h) => h !== null);
      if (!allSelected) return;

      setIsAnalyzing(true);
      setTeamAnalysis(null);

      try {
        const selectedHeroesData = Object.fromEntries(
          Object.entries(selectedHeroes).map(([key, hero]) => [
            key,
            hero ? { name: hero.name, role: hero.role } : null,
          ])
        );

        const { data, error } = await supabase.functions.invoke("suggest-heroes", {
          body: {
            type: "analyze",
            selectedHeroes: selectedHeroesData,
          },
        });

        if (error) throw error;

        if (data?.error) {
          toast({
            title: "خطا",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        if (data?.analysis) {
          setTeamAnalysis(data.analysis);
        }
      } catch (error) {
        console.error("Team analysis error:", error);
        toast({
          title: "خطا در تحلیل تیم",
          description: "لطفاً دوباره تلاش کنید.",
          variant: "destructive",
        });
      } finally {
        setIsAnalyzing(false);
      }
    },
    []
  );

  const getCounterSuggestions = useCallback(async (enemyHeroes: string[]) => {
    if (enemyHeroes.length === 0) {
      setCounterSuggestions([]);
      return;
    }

    setIsLoadingCounters(true);
    setCounterSuggestions([]);

    try {
      const { data, error } = await supabase.functions.invoke("suggest-heroes", {
        body: {
          type: "counter",
          enemyHeroes,
          heroesData: heroes.map((h) => ({ name: h.name, role: h.role })),
        },
      });

      if (error) throw error;

      if (data?.error) {
        toast({
          title: "خطا",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      if (data?.counters && Array.isArray(data.counters)) {
        const validCounters = data.counters.filter((c: CounterSuggestion) =>
          heroes.some((h) => h.name.toLowerCase() === c.hero.toLowerCase())
        );
        setCounterSuggestions(validCounters);
      }
    } catch (error) {
      console.error("Counter suggestion error:", error);
      toast({
        title: "خطا در دریافت کانترها",
        description: "لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingCounters(false);
    }
  }, []);

  const clearAISuggestions = useCallback(() => {
    setAiSuggestions([]);
  }, []);

  const clearTeamAnalysis = useCallback(() => {
    setTeamAnalysis(null);
  }, []);

  const clearCounterSuggestions = useCallback(() => {
    setCounterSuggestions([]);
  }, []);

  return {
    aiSuggestions,
    isLoadingAI,
    getAISuggestions,
    clearAISuggestions,
    teamAnalysis,
    isAnalyzing,
    analyzeTeam,
    clearTeamAnalysis,
    counterSuggestions,
    isLoadingCounters,
    getCounterSuggestions,
    clearCounterSuggestions,
  };
};
