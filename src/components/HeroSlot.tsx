import { Plus, X } from "lucide-react";
import { Hero } from "@/data/heroes";

interface HeroSlotProps {
  position: string;
  role: string;
  hero: Hero | null;
  onClick: () => void;
  onClear: () => void;
  suggested?: boolean;
}

const HeroSlot = ({ position, role, hero, onClick, onClear, suggested }: HeroSlotProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{position}</span>
      <span className="text-xs text-primary/70">{role}</span>
      
      <div
        onClick={hero ? undefined : onClick}
        className={`
          relative w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 border-dashed 
          flex items-center justify-center transition-all duration-300
          ${hero 
            ? "border-primary/50 bg-card cursor-default" 
            : suggested 
              ? "border-primary bg-primary/10 cursor-pointer hover:bg-primary/20 animate-pulse" 
              : "border-border/50 bg-card/30 cursor-pointer hover:border-primary/50 hover:bg-card/50"
          }
        `}
      >
        {hero ? (
          <>
            <img
              src={hero.image}
              alt={hero.name}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClear();
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
            >
              <X className="w-4 h-4 text-destructive-foreground" />
            </button>
          </>
        ) : (
          <Plus className={`w-8 h-8 ${suggested ? "text-primary" : "text-muted-foreground"}`} />
        )}
      </div>
      
      {hero && (
        <span className="text-sm font-medium text-foreground text-center max-w-[100px] truncate">
          {hero.name}
        </span>
      )}
    </div>
  );
};

export default HeroSlot;
