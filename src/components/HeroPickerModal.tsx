import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Loader2 } from "lucide-react";
import { heroes, Hero } from "@/data/heroes";

interface HeroPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (hero: Hero) => void;
  suggestedHeroes: string[];
  aiSuggestedHeroes?: string[];
  isLoadingAI?: boolean;
  disabledHeroes: string[];
  position: string;
  role: string;
}

const HeroPickerModal = ({
  open,
  onClose,
  onSelect,
  suggestedHeroes,
  aiSuggestedHeroes = [],
  isLoadingAI = false,
  disabledHeroes,
  position,
  role
}: HeroPickerModalProps) => {
  const [search, setSearch] = useState("");

  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero =>
      hero.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const suggested = useMemo(() => {
    return filteredHeroes.filter(h => suggestedHeroes.includes(h.name));
  }, [filteredHeroes, suggestedHeroes]);

  const aiSuggested = useMemo(() => {
    return filteredHeroes.filter(h => 
      aiSuggestedHeroes.includes(h.name) && !suggestedHeroes.includes(h.name)
    );
  }, [filteredHeroes, aiSuggestedHeroes, suggestedHeroes]);

  const allSuggestedNames = useMemo(() => {
    return [...suggestedHeroes, ...aiSuggestedHeroes];
  }, [suggestedHeroes, aiSuggestedHeroes]);

  const others = useMemo(() => {
    return filteredHeroes.filter(h => !allSuggestedNames.includes(h.name));
  }, [filteredHeroes, allSuggestedNames]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            انتخاب هیرو برای {position} ({role})
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="جستجوی هیرو..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pr-10 bg-background border-border text-foreground"
          />
        </div>

        <div className="overflow-y-auto max-h-[55vh] space-y-4 px-1">
          {/* AI Suggestions Section */}
          {(isLoadingAI || aiSuggested.length > 0) && (
            <div>
              <h3 className="text-sm font-semibold text-yellow-500 mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                پیشنهاد هوش مصنوعی
                {isLoadingAI && <Loader2 className="w-4 h-4 animate-spin" />}
              </h3>
              {isLoadingAI ? (
                <div className="flex items-center justify-center py-4">
                  <p className="text-sm text-muted-foreground">در حال تحلیل ترکیب تیم...</p>
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                  {aiSuggested.map(hero => (
                    <HeroItem
                      key={hero.name}
                      hero={hero}
                      onSelect={onSelect}
                      disabled={disabledHeroes.includes(hero.name)}
                      aiSuggested
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Composition Suggestions Section */}
          {suggested.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                پیشنهادی بر اساس ترکیب
              </h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {suggested.map(hero => (
                  <HeroItem
                    key={hero.name}
                    hero={hero}
                    onSelect={onSelect}
                    disabled={disabledHeroes.includes(hero.name)}
                    suggested
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">همه هیروها</h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {others.map(hero => (
                <HeroItem
                  key={hero.name}
                  hero={hero}
                  onSelect={onSelect}
                  disabled={disabledHeroes.includes(hero.name)}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface HeroItemProps {
  hero: Hero;
  onSelect: (hero: Hero) => void;
  disabled: boolean;
  suggested?: boolean;
  aiSuggested?: boolean;
}

const HeroItem = ({ hero, onSelect, disabled, suggested, aiSuggested }: HeroItemProps) => {
  return (
    <button
      onClick={() => !disabled && onSelect(hero)}
      disabled={disabled}
      className={`
        relative group flex flex-col items-center p-1 rounded-lg transition-all duration-200
        ${disabled 
          ? "opacity-30 cursor-not-allowed" 
          : aiSuggested
            ? "bg-yellow-500/20 hover:bg-yellow-500/30 ring-1 ring-yellow-500"
            : suggested
              ? "bg-primary/20 hover:bg-primary/30 ring-1 ring-primary"
              : "hover:bg-accent cursor-pointer"
        }
      `}
    >
      <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg overflow-hidden">
        <img
          src={hero.image}
          alt={hero.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.svg";
          }}
        />
      </div>
      <span className="text-[10px] md:text-xs text-foreground text-center mt-1 line-clamp-1 w-full">
        {hero.name}
      </span>
    </button>
  );
};

export default HeroPickerModal;
