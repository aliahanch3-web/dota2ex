import { Swords, Loader2, X, Plus } from "lucide-react";
import { Hero, heroes } from "@/data/heroes";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export interface CounterSuggestion {
  hero: string;
  reason: string;
  countersAgainst: string[];
}

interface CounterPickSectionProps {
  enemyHeroes: string[];
  onAddEnemy: () => void;
  onRemoveEnemy: (heroName: string) => void;
  counterSuggestions: CounterSuggestion[];
  isLoading: boolean;
  onSelectCounter: (hero: Hero) => void;
}

const CounterPickSection = ({
  enemyHeroes,
  onAddEnemy,
  onRemoveEnemy,
  counterSuggestions,
  isLoading,
  onSelectCounter
}: CounterPickSectionProps) => {
  return (
    <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-500" />
          <h3 className="font-bold text-foreground">پیشنهاد کانتر</h3>
        </div>
        <span className="text-xs text-muted-foreground">هیروهای دشمن رو اضافه کن</span>
      </div>

      {/* Enemy Heroes */}
      <div className="flex flex-wrap gap-2 mb-4">
        {enemyHeroes.map(heroName => {
          const hero = heroes.find(h => h.name === heroName);
          return (
            <div
              key={heroName}
              className="relative group flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-2 py-1"
            >
              {hero && (
                <img
                  src={hero.image}
                  alt={heroName}
                  className="w-6 h-6 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              )}
              <span className="text-sm text-foreground">{heroName}</span>
              <button
                onClick={() => onRemoveEnemy(heroName)}
                className="p-0.5 rounded-full bg-red-500/50 hover:bg-red-500 transition-colors"
              >
                <X className="w-3 h-3 text-white" />
              </button>
            </div>
          );
        })}
        
        {enemyHeroes.length < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onAddEnemy}
            className="gap-1 border-dashed border-red-500/50 text-red-500 hover:bg-red-500/10"
          >
            <Plus className="w-4 h-4" />
            اضافه کردن دشمن
          </Button>
        )}
      </div>

      {/* Counter Suggestions */}
      {enemyHeroes.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3">
            هیروهای پیشنهادی برای کانتر:
          </h4>

          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="w-5 h-5 text-red-500 animate-spin mr-2" />
              <span className="text-sm text-muted-foreground">در حال تحلیل پیک دشمن...</span>
            </div>
          ) : counterSuggestions.length > 0 ? (
            <TooltipProvider delayDuration={200}>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {counterSuggestions.map(suggestion => {
                  const hero = heroes.find(h => h.name.toLowerCase() === suggestion.hero.toLowerCase());
                  if (!hero) return null;

                  return (
                    <Tooltip key={suggestion.hero}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => onSelectCounter(hero)}
                          className="flex flex-col items-center p-1 rounded-lg bg-red-500/20 hover:bg-red-500/30 ring-1 ring-red-500 transition-all duration-200"
                        >
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={hero.image}
                              alt={hero.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/placeholder.svg";
                              }}
                            />
                          </div>
                          <span className="text-[10px] text-foreground text-center mt-1 line-clamp-1 w-full">
                            {hero.name}
                          </span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="bg-red-500/90 text-white font-medium max-w-[250px]">
                        <p className="mb-1">{suggestion.reason}</p>
                        {suggestion.countersAgainst?.length > 0 && (
                          <p className="text-xs opacity-80">
                            کانتر: {suggestion.countersAgainst.join(", ")}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </div>
            </TooltipProvider>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              پیشنهادی یافت نشد
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CounterPickSection;
