import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { heroes, Hero } from "@/data/heroes";

interface EnemyPickerModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (hero: Hero) => void;
  selectedEnemies: string[];
}

const EnemyPickerModal = ({
  open,
  onClose,
  onSelect,
  selectedEnemies
}: EnemyPickerModalProps) => {
  const [search, setSearch] = useState("");

  const filteredHeroes = useMemo(() => {
    return heroes.filter(hero =>
      hero.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground">
            انتخاب هیروی دشمن
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

        <div className="overflow-y-auto max-h-[55vh] px-1">
          <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-9 gap-2">
            {filteredHeroes.map(hero => {
              const isSelected = selectedEnemies.includes(hero.name);
              return (
                <button
                  key={hero.name}
                  onClick={() => onSelect(hero)}
                  disabled={isSelected}
                  className={`
                    relative flex flex-col items-center p-1 rounded-lg transition-all duration-200
                    ${isSelected
                      ? "opacity-30 cursor-not-allowed ring-1 ring-red-500"
                      : "hover:bg-red-500/20 cursor-pointer"
                    }
                  `}
                >
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-lg overflow-hidden">
                    <img
                      src={hero.image}
                      alt={hero.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <span className="text-[9px] md:text-[10px] text-foreground text-center mt-1 line-clamp-1 w-full">
                    {hero.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnemyPickerModal;
