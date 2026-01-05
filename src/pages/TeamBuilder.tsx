import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Hero, heroes } from "@/data/heroes";
import { positions, PositionKey, getSuggestedHeroes, teamCompositions } from "@/data/teamCompositions";
import HeroSlot from "@/components/HeroSlot";
import HeroPickerModal from "@/components/HeroPickerModal";
import EnemyPickerModal from "@/components/EnemyPickerModal";
import TeamAnalysisCard from "@/components/TeamAnalysisCard";
import CounterPickSection from "@/components/CounterPickSection";
import { Button } from "@/components/ui/button";
import { useAISuggestions } from "@/hooks/useAISuggestions";

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

  const getSlotSuggested = (posKey: PositionKey): boolean => {
    if (selectedHeroes[posKey]) return false;
    const suggestions = getSuggestedHeroes(selectedHeroNames, posKey);
    return suggestions.length > 0;
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
              onClick={() => setActiveSlot(pos.key)}
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
            isLoading={isLoadingCounters}
            onSelectCounter={handleSelectCounter}
          />
        </div>

        {/* AI Team Analysis */}
        {(allHeroesSelected || isAnalyzing) && !matchedComposition && (
          <div className="mb-8">
            <TeamAnalysisCard analysis={teamAnalysis} isLoading={isAnalyzing} />
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
                <TeamAnalysisCard analysis={teamAnalysis} isLoading={isAnalyzing} />
              </div>
            )}
          </div>
        )}

        {/* Available Compositions */}
        <div className="mt-12">
          <h2 className="text-lg font-bold text-foreground mb-4 text-center">ترکیب‌های پیشنهادی</h2>
          <div className="grid gap-4 max-w-4xl mx-auto">
            {teamCompositions.map((comp, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors"
              >
                <h3 className="font-bold text-foreground mb-2">{comp.name}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {[comp.pos1, comp.pos2, comp.pos3, comp.pos4, comp.pos5].map((heroName, i) => {
                    const hero = heroes.find(h => h.name === heroName);
                    return (
                      <div key={i} className="flex items-center gap-1 bg-background/50 rounded-lg px-2 py-1">
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
                        <span className="text-xs text-foreground">{heroName}</span>
                      </div>
                    );
                  })}
                </div>
                <p className="text-sm text-muted-foreground">{comp.playstyle}</p>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default TeamBuilder;
