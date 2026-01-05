import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, RotateCcw, Sparkles } from "lucide-react";
import { Hero, heroes } from "@/data/heroes";
import { positions, PositionKey, getSuggestedHeroes, teamCompositions } from "@/data/teamCompositions";
import HeroSlot from "@/components/HeroSlot";
import HeroPickerModal from "@/components/HeroPickerModal";
import { Button } from "@/components/ui/button";

const TeamBuilder = () => {
  const [selectedHeroes, setSelectedHeroes] = useState<Record<PositionKey, Hero | null>>({
    pos1: null,
    pos2: null,
    pos3: null,
    pos4: null,
    pos5: null
  });

  const [lockedSlots, setLockedSlots] = useState<Record<PositionKey, boolean>>({
    pos1: false,
    pos2: false,
    pos3: false,
    pos4: false,
    pos5: false
  });

  const [activeSlot, setActiveSlot] = useState<PositionKey | null>(null);

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
    // Don't show suggestions for locked slots
    if (lockedSlots[activeSlot]) return [];
    return getSuggestedHeroes(selectedHeroNames, activeSlot);
  }, [selectedHeroNames, activeSlot, lockedSlots]);

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

  const handleSelectHero = (hero: Hero) => {
    setSelectedHeroes(prev => {
      // Resolve the "correct" slot for the hero's role based on the CURRENT state
      // but ONLY consider unlocked slots
      const resolveTargetPosition = (role: Hero["primaryRole"], state: typeof prev): PositionKey => {
        switch (role) {
          case "Carry":
            // If pos1 is locked, fall back to activeSlot or first unlocked
            if (lockedSlots.pos1) return activeSlot || "pos1";
            return "pos1";
          case "Mid":
            if (lockedSlots.pos2) return activeSlot || "pos2";
            return "pos2";
          case "Offlane":
            if (lockedSlots.pos3) return activeSlot || "pos3";
            return "pos3";
          case "Support":
            // Supports can be pos4 or pos5 — prefer an empty unlocked pos4, then pos5
            if (!lockedSlots.pos4 && !state.pos4) return "pos4";
            if (!lockedSlots.pos5 && !state.pos5) return "pos5";
            if (!lockedSlots.pos4) return "pos4";
            if (!lockedSlots.pos5) return "pos5";
            return activeSlot || "pos4";
          default:
            return activeSlot || "pos4";
        }
      };

      const next: typeof prev = { ...prev };

      // If this hero already exists in the lineup, remove it first (prevents duplicates)
      // but NOT from locked slots
      for (const key of Object.keys(next) as PositionKey[]) {
        if (next[key]?.name === hero.name && !lockedSlots[key]) {
          next[key] = null;
        }
      }

      // If user picked from a specific slot, use swap behavior when the hero belongs elsewhere.
      // For Supports, if they clicked pos4/pos5, keep it there (both are valid support slots).
      let targetPosition: PositionKey = activeSlot
        ? hero.primaryRole === "Support" && (activeSlot === "pos4" || activeSlot === "pos5")
          ? activeSlot
          : resolveTargetPosition(hero.primaryRole, next)
        : resolveTargetPosition(hero.primaryRole, next);

      // Don't place in locked slots
      if (lockedSlots[targetPosition]) {
        // Use the activeSlot instead if it's not locked
        if (activeSlot && !lockedSlots[activeSlot]) {
          targetPosition = activeSlot;
        } else {
          // Find first unlocked empty slot
          const unlockedEmpty = (Object.keys(next) as PositionKey[]).find(
            key => !lockedSlots[key] && !next[key]
          );
          if (unlockedEmpty) targetPosition = unlockedEmpty;
          else return prev; // Can't place anywhere
        }
      }

      const displaced = next[targetPosition];
      next[targetPosition] = hero;

      // If they were selecting for a different slot, move the displaced hero back into the clicked slot
      // but only if the clicked slot is not locked
      if (activeSlot && activeSlot !== targetPosition && !lockedSlots[activeSlot]) {
        next[activeSlot] = displaced ?? null;
      }

      return next;
    });

    setActiveSlot(null);
  };

  const handleClearHero = (position: PositionKey) => {
    if (lockedSlots[position]) return;
    setSelectedHeroes(prev => ({ ...prev, [position]: null }));
  };

  const handleToggleLock = (position: PositionKey) => {
    setLockedSlots(prev => ({ ...prev, [position]: !prev[position] }));
  };

  const handleReset = () => {
    setSelectedHeroes({
      pos1: null,
      pos2: null,
      pos3: null,
      pos4: null,
      pos5: null
    });
    setLockedSlots({
      pos1: false,
      pos2: false,
      pos3: false,
      pos4: false,
      pos5: false
    });
  };

  const getSlotSuggested = (posKey: PositionKey): boolean => {
    if (selectedHeroes[posKey]) return false;
    if (lockedSlots[posKey]) return false; // No suggestions for locked slots
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
            <span className="text-primary text-sm">هیروها بر اساس نقش خودشان در جایگاه درست قرار می‌گیرند.</span>
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
              locked={lockedSlots[pos.key]}
              onToggleLock={() => handleToggleLock(pos.key)}
            />
          ))}
        </div>

        {/* Matched Composition */}
        {matchedComposition && (
          <div className="max-w-2xl mx-auto bg-primary/10 border border-primary/30 rounded-xl p-6 text-center animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-primary">{matchedComposition.name}</h3>
            </div>
            <p className="text-foreground/80">{matchedComposition.playstyle}</p>
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
          disabledHeroes={disabledHeroes}
          position={positions.find(p => p.key === activeSlot)?.label || ""}
          role={positions.find(p => p.key === activeSlot)?.role || ""}
        />
      )}
    </div>
  );
};

export default TeamBuilder;
