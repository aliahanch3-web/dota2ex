import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Hero, heroes } from "@/data/heroes";
import { positions, PositionKey, getSuggestedHeroes, teamCompositions } from "@/data/teamCompositions";
import HeroSlot from "@/components/HeroSlot";
import HeroPickerModal from "@/components/HeroPickerModal";
import EnemyPickerModal from "@/components/EnemyPickerModal";
import TeamAnalysisCard from "@/components/TeamAnalysisCard";
import CounterPickSection, { TeamSuggestion } from "@/components/CounterPickSection";
import { Button } from "@/components/ui/button";
import { useAISuggestions } from "@/hooks/useAISuggestions";
import { HeroGuideModal } from "@/components/HeroGuideModal";

const TeamBuilder = () => {
  const [selectedHeroes, setSelectedHeroes] = useState<Record<PositionKey, Hero | null>>({
    pos1: null,
    pos2: null,
    pos3: null,
    pos4: null,
    pos5: null
  });

  const [activeSlot, setActiveSlot] = useState<PositionKey | null>(null);
  const [enemyHeroes, setEnemyHeroes] = useState<string[]>([]);
  const [isEnemyPickerOpen, setIsEnemyPickerOpen] = useState(false);
  const [selectedHeroForGuide, setSelectedHeroForGuide] = useState<Hero | null>(null);

  const { 
    aiSuggestions, 
    isLoadingAI, 
    getAISuggestions, 
    clearAISuggestions,
    teamAnalysis,
    isAnalyzing,
    analyzeTeam,
    clearTeamAnalysis,
    counterSuggestions,
    teamSuggestions,
    isLoadingCounters,
    getCounterSuggestions,
    clearCounterSuggestions
  } = useAISuggestions();

  // Fetch AI suggestions when slot changes
  useEffect(() => {
    if (activeSlot) {
      getAISuggestions(selectedHeroes, activeSlot);
    } else {
      clearAISuggestions();
    }
  }, [activeSlot, selectedHeroes, getAISuggestions, clearAISuggestions]);

  // Analyze team when all heroes are selected
  useEffect(() => {
    const allSelected = Object.values(selectedHeroes).every(h => h !== null);
    if (allSelected) {
      analyzeTeam(selectedHeroes);
    } else {
      clearTeamAnalysis();
    }
  }, [selectedHeroes, analyzeTeam, clearTeamAnalysis]);

  // Get counter suggestions when enemy heroes change
  useEffect(() => {
    if (enemyHeroes.length > 0) {
      getCounterSuggestions(enemyHeroes);
    } else {
      clearCounterSuggestions();
    }
  }, [enemyHeroes, getCounterSuggestions, clearCounterSuggestions]);

  const selectedHeroNames = useMemo(() => {
    const result: Record<PositionKey, string | null> = {
      pos1: null,
      pos2: null,
      pos3: null,
      pos4: null,
      pos5: null
    };
    for (const [key, hero] of Object.entries(selectedHeroes)) {
      result[key as PositionKey] = hero?.name || null;
    }
    return result;
  }, [selectedHeroes]);

  // Filter compositions based on selected heroes
  const filteredCompositions = useMemo(() => {
    const selectedNames = Object.values(selectedHeroes)
      .filter((h): h is Hero => h !== null)
      .map(h => h.name);
    
    if (selectedNames.length === 0) return teamCompositions;
    
    return teamCompositions.filter(comp => {
      const compHeroes = [comp.pos1, comp.pos2, comp.pos3, comp.pos4, comp.pos5];
      return selectedNames.every(name => compHeroes.includes(name));
    });
  }, [selectedHeroes]);

  const suggestedHeroes = useMemo(() => {
    if (!activeSlot) return [];
    return getSuggestedHeroes(selectedHeroNames, activeSlot);
  }, [selectedHeroNames, activeSlot]);

  const disabledHeroes = useMemo(() => {
    return Object.values(selectedHeroes)
      .filter((h): h is Hero => h !== null)
      .map(h => h.name);
  }, [selectedHeroes]);

  const matchedComposition = useMemo(() => {
    const allSelected = Object.values(selectedHeroes).every(h => h !== null);
    if (!allSelected) return null;

    return teamCompositions.find(comp => 
      comp.pos1 === selectedHeroes.pos1?.name &&
      comp.pos2 === selectedHeroes.pos2?.name &&
      comp.pos3 === selectedHeroes.pos3?.name &&
      comp.pos4 === selectedHeroes.pos4?.name &&
      comp.pos5 === selectedHeroes.pos5?.name
    ) || null;
  }, [selectedHeroes]);

  const allHeroesSelected = useMemo(() => {
    return Object.values(selectedHeroes).every(h => h !== null);
  }, [selectedHeroes]);

  const handleSelectHero = (hero: Hero) => {
    if (activeSlot) {
      setSelectedHeroes(prev => ({ ...prev, [activeSlot]: hero }));
      setActiveSlot(null);
    }
  };

  const handleClearHero = (position: PositionKey) => {
    setSelectedHeroes(prev => ({ ...prev, [position]: null }));
  };

  const handleReset = () => {
    setSelectedHeroes({
      pos1: null,
      pos2: null,
      pos3: null,
      pos4: null,
      pos5: null
    });
    setEnemyHeroes([]);
  };

  const handleAddEnemy = (hero: Hero) => {
    if (enemyHeroes.length < 5 && !enemyHeroes.includes(hero.name)) {
      setEnemyHeroes(prev => [...prev, hero.name]);
    }
    setIsEnemyPickerOpen(false);
  };

  const handleRemoveEnemy = (heroName: string) => {
    setEnemyHeroes(prev => prev.filter(h => h !== heroName));
  };

  const handleSelectCounter = (hero: Hero) => {
    // Find first empty slot and add the counter hero there
    const emptySlot = positions.find(pos => !selectedHeroes[pos.key]);
    if (emptySlot) {
      setSelectedHeroes(prev => ({ ...prev, [emptySlot.key]: hero }));
    }
  };

  const handleSelectTeam = (team: TeamSuggestion) => {
    const newSelection: Record<PositionKey, Hero | null> = {
      pos1: heroes.find(h => h.name.toLowerCase() === team.pos1.toLowerCase()) || null,
      pos2: heroes.find(h => h.name.toLowerCase() === team.pos2.toLowerCase()) || null,
      pos3: heroes.find(h => h.name.toLowerCase() === team.pos3.toLowerCase()) || null,
      pos4: heroes.find(h => h.name.toLowerCase() === team.pos4.toLowerCase()) || null,
      pos5: heroes.find(h => h.name.toLowerCase() === team.pos5.toLowerCase()) || null,
    };
    setSelectedHeroes(newSelection);
  };

  const getSlotSuggested = (posKey: PositionKey): boolean => {
    if (selectedHeroes[posKey]) return false;
    const suggestions = getSuggestedHeroes(selectedHeroNames, posKey);
    return suggestions.length > 0;
  };

  const handleSelectComposition = (comp: typeof teamCompositions[0]) => {
    const newSelection: Record<PositionKey, Hero | null> = {
      pos1: heroes.find(h => h.name === comp.pos1) || null,
      pos2: heroes.find(h => h.name === comp.pos2) || null,
      pos3: heroes.find(h => h.name === comp.pos3) || null,
      pos4: heroes.find(h => h.name === comp.pos4) || null,
      pos5: heroes.find(h => h.name === comp.pos5) || null,
    };
    setSelectedHeroes(newSelection);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowRight className="w-5 h-5" />
              </Link>
              <h1 className="text-xl md:text-2xl font-bold text-foreground">
                تیم <span className="text-primary">ساز</span>
              </h1>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              ریست
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Instructions */}
        <div className="text-center mb-8">
          <p className="text-muted-foreground">
            روی هر جای خالی کلیک کنید و هیروی مورد نظر را انتخاب کنید.
            <br />
            <span className="text-primary text-sm">پیشنهادات بر اساس ترکیب‌های حرفه‌ای نمایش داده می‌شوند.</span>
          </p>
        </div>

        {/* Hero Slots */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
          {positions.map(pos => (
            <HeroSlot
              key={pos.key}
              position={pos.label}
              role={pos.role}
              hero={selectedHeroes[pos.key]}
              onClick={() => {
                if (selectedHeroes[pos.key]) {
                  setSelectedHeroForGuide(selectedHeroes[pos.key]);
                } else {
                  setActiveSlot(pos.key);
                }
              }}
              onClear={() => handleClearHero(pos.key)}
              suggested={getSlotSuggested(pos.key)}
            />
          ))}
        </div>

        {/* Counter Pick Section */}
        <div className="max-w-2xl mx-auto mb-8">
          <CounterPickSection
            enemyHeroes={enemyHeroes}
            onAddEnemy={() => setIsEnemyPickerOpen(true)}
            onRemoveEnemy={handleRemoveEnemy}
            counterSuggestions={counterSuggestions}
            teamSuggestions={teamSuggestions}
            isLoading={isLoadingCounters}
            onSelectCounter={handleSelectCounter}
            onSelectTeam={handleSelectTeam}
          />
        </div>

        {/* AI Team Analysis */}
        {(allHeroesSelected || isAnalyzing) && !matchedComposition && (
          <div className="mb-8">
            <TeamAnalysisCard 
              analysis={teamAnalysis} 
              isLoading={isAnalyzing}
              onReplaceHero={(position, heroName) => {
                const hero = heroes.find(h => h.name.toLowerCase() === heroName.toLowerCase());
                if (hero) {
                  setSelectedHeroes(prev => ({ ...prev, [position]: hero }));
                }
              }}
            />
          </div>
        )}

        {/* Matched Composition */}
        {matchedComposition && (
          <div className="mb-8">
            <div className="max-w-2xl mx-auto bg-primary/10 border border-primary/30 rounded-xl p-6 text-center animate-fade-in">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-primary">{matchedComposition.name}</h3>
              </div>
              <p className="text-foreground/80">{matchedComposition.playstyle}</p>
            </div>
            
            {/* Also show AI analysis below matched composition */}
            {(teamAnalysis || isAnalyzing) && (
              <div className="mt-4">
                <TeamAnalysisCard 
                  analysis={teamAnalysis} 
                  isLoading={isAnalyzing}
                  onReplaceHero={(position, heroName) => {
                    const hero = heroes.find(h => h.name.toLowerCase() === heroName.toLowerCase());
                    if (hero) {
                      setSelectedHeroes(prev => ({ ...prev, [position]: hero }));
                    }
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Available Compositions */}
        <div className="mt-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <h2 className="text-lg font-bold text-foreground">ترکیب‌های پیشنهادی</h2>
            {filteredCompositions.length !== teamCompositions.length && (
              <span className="text-sm text-muted-foreground">
                ({filteredCompositions.length} از {teamCompositions.length})
              </span>
            )}
          </div>
          
          {filteredCompositions.length === 0 ? (
            <p className="text-center text-muted-foreground">
              هیچ ترکیبی با هیروهای انتخاب شده یافت نشد.
            </p>
          ) : (
            <div className="grid gap-4 max-w-4xl mx-auto">
              {filteredCompositions.map((comp, idx) => {
                const selectedNames = Object.values(selectedHeroes)
                  .filter((h): h is Hero => h !== null)
                  .map(h => h.name);
                
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectComposition(comp)}
                    className="bg-card border border-border rounded-xl p-4 hover:border-primary/50 hover:bg-primary/5 transition-all text-right group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        کلیک برای انتخاب
                      </span>
                      <h3 className="font-bold text-foreground">{comp.name}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3 justify-end">
                      {[comp.pos1, comp.pos2, comp.pos3, comp.pos4, comp.pos5].map((heroName, i) => {
                        const hero = heroes.find(h => h.name === heroName);
                        const isSelected = selectedNames.includes(heroName);
                        return (
                          <div 
                            key={i} 
                            className={`flex items-center gap-1 rounded-lg px-2 py-1 ${
                              isSelected 
                                ? 'bg-primary/20 ring-1 ring-primary/50' 
                                : 'bg-background/50'
                            }`}
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
                            <span className={`text-xs ${isSelected ? 'text-primary font-medium' : 'text-foreground'}`}>
                              {heroName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground">{comp.playstyle}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Hero Picker Modal */}
      {activeSlot && (
        <HeroPickerModal
          open={!!activeSlot}
          onClose={() => setActiveSlot(null)}
          onSelect={handleSelectHero}
          suggestedHeroes={suggestedHeroes}
          aiSuggestedHeroes={aiSuggestions}
          isLoadingAI={isLoadingAI}
          disabledHeroes={disabledHeroes}
          position={positions.find(p => p.key === activeSlot)?.label || ""}
          role={positions.find(p => p.key === activeSlot)?.role || ""}
        />
      )}

      {/* Enemy Picker Modal */}
      <EnemyPickerModal
        open={isEnemyPickerOpen}
        onClose={() => setIsEnemyPickerOpen(false)}
        onSelect={handleAddEnemy}
        selectedEnemies={enemyHeroes}
      />

      {/* Hero Guide Modal */}
      <HeroGuideModal
        hero={selectedHeroForGuide}
        isOpen={!!selectedHeroForGuide}
        onClose={() => setSelectedHeroForGuide(null)}
      />
    </div>
  );
};

export default TeamBuilder;
