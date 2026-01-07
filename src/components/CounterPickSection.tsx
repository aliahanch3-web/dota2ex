import { Swords, Loader2, X, Plus, Users } from "lucide-react";
import { Hero, heroes } from "@/data/heroes";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface CounterSuggestion {
  hero: string;
  reason: string;
  countersAgainst: string[];
}

export interface TeamSuggestion {
  name: string;
  description: string;
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  pos5: string;
}

interface CounterPickSectionProps {
  enemyHeroes: string[];
  onAddEnemy: () => void;
  onRemoveEnemy: (heroName: string) => void;
  counterSuggestions: CounterSuggestion[];
  teamSuggestions: TeamSuggestion[];
  isLoading: boolean;
  onSelectCounter: (hero: Hero) => void;
  onSelectTeam: (team: TeamSuggestion) => void;
}

const CounterPickSection = ({
  enemyHeroes,
  onAddEnemy,
  onRemoveEnemy,
  counterSuggestions,
  teamSuggestions,
  isLoading,
  onSelectCounter,
  onSelectTeam
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
        <div className="mt-4 space-y-6">
          {/* Individual Hero Suggestions */}
          <div>
            <h4 className="text-sm font-semibold text-muted-foreground mb-3">
              هیروهای پیشنهادی برای کانتر:
            </h4>

            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-red-500 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">در حال تحلیل پیک دشمن...</span>
              </div>
            ) : counterSuggestions.length > 0 ? (
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {counterSuggestions.map(suggestion => {
                  const hero = heroes.find(h => h.name.toLowerCase() === suggestion.hero.toLowerCase());
                  if (!hero) return null;

                  return (
                    <Popover key={suggestion.hero}>
                      <PopoverTrigger asChild>
                        <button
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
                      </PopoverTrigger>
                      <PopoverContent side="top" className="bg-red-500/90 text-white font-medium max-w-[250px] p-3">
                        <p className="mb-2">{suggestion.reason}</p>
                        {suggestion.countersAgainst?.length > 0 && (
                          <p className="text-xs opacity-80 mb-3">
                            کانتر: {suggestion.countersAgainst.join(", ")}
                          </p>
                        )}
                        <Button 
                          size="sm" 
                          onClick={() => onSelectCounter(hero)}
                          className="w-full bg-white/20 hover:bg-white/30 text-white"
                        >
                          انتخاب این هیرو
                        </Button>
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </div>
            ) : !isLoading && (
              <p className="text-sm text-muted-foreground text-center py-4">
                پیشنهادی یافت نشد
              </p>
            )}
          </div>

          {/* Team Suggestions */}
          {!isLoading && teamSuggestions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-orange-500" />
                <h4 className="text-sm font-semibold text-muted-foreground">
                  تیم‌های پیشنهادی برای کانتر:
                </h4>
              </div>

              <div className="space-y-3">
                {teamSuggestions.map((team, idx) => {
                  const teamHeroes = [team.pos1, team.pos2, team.pos3, team.pos4, team.pos5];
                  
                  return (
                    <button
                      key={idx}
                      onClick={() => onSelectTeam(team)}
                      className="w-full bg-orange-500/10 border border-orange-500/30 rounded-lg p-3 hover:bg-orange-500/20 transition-all text-right group"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                          کلیک برای انتخاب تیم
                        </span>
                        <h5 className="font-bold text-foreground text-sm">{team.name}</h5>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-2 justify-end">
                        {teamHeroes.map((heroName, i) => {
                          const hero = heroes.find(h => h.name.toLowerCase() === heroName.toLowerCase());
                          return (
                            <div 
                              key={i}
                              className="flex items-center gap-1 bg-background/50 rounded-lg px-2 py-1"
                            >
                              {hero && (
                                <img
                                  src={hero.image}
                                  alt={heroName}
                                  className="w-5 h-5 rounded"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                                  }}
                                />
                              )}
                              <span className="text-xs text-foreground">{heroName}</span>
                            </div>
                          );
                        })}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">{team.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CounterPickSection;
