import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Hero, heroes } from "@/data/heroes";
import { PositionKey, positions } from "@/data/teamCompositions";
import { toast } from "@/hooks/use-toast";

export const useAISuggestions = () => {
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

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
            selectedHeroes: selectedHeroesData,
            targetPosition: position?.label || targetPosition,
            heroesData: heroes.map((h) => ({ name: h.name, role: h.role })),
          },
        });

        if (error) {
          throw error;
        }

        if (data?.error) {
          toast({
            title: "خطا",
            description: data.error,
            variant: "destructive",
          });
          return;
        }

        if (data?.suggestions && Array.isArray(data.suggestions)) {
          // Filter suggestions to only include valid hero names
          const validSuggestions = data.suggestions.filter((name: string) =>
            heroes.some((h) => h.name.toLowerCase() === name.toLowerCase())
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

  const clearAISuggestions = useCallback(() => {
    setAiSuggestions([]);
  }, []);

  return {
    aiSuggestions,
    isLoadingAI,
    getAISuggestions,
    clearAISuggestions,
  };
};
