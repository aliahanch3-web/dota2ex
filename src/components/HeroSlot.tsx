import { Plus, X, Lock, Unlock } from "lucide-react";
import { Hero } from "@/data/heroes";

interface HeroSlotProps {
  position: string;
  role: string;
  hero: Hero | null;
  onClick: () => void;
  onClear: () => void;
  suggested?: boolean;
  locked?: boolean;
  onToggleLock?: () => void;
}

const HeroSlot = ({ position, role, hero, onClick, onClear, suggested, locked, onToggleLock }: HeroSlotProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">{position}</span>
      <span className="text-xs text-primary/70">{role}</span>
      
      <div
        onClick={hero ? undefined : locked ? undefined : onClick}
        className={`
          relative w-24 h-24 md:w-32 md:h-32 rounded-xl border-2 
          flex items-center justify-center transition-all duration-300
          ${locked 
            ? "border-amber-500/70 bg-amber-500/10 cursor-not-allowed" 
            : hero 
              ? "border-primary/50 bg-card cursor-default border-dashed" 
              : suggested 
                ? "border-primary bg-primary/10 cursor-pointer hover:bg-primary/20 animate-pulse border-dashed" 
                : "border-border/50 bg-card/30 cursor-pointer hover:border-primary/50 hover:bg-card/50 border-dashed"
          }
        `}
      >
        {hero ? (
          <>
            <img
              src={hero.image}
              alt={hero.name}
              className={`w-full h-full object-cover rounded-lg ${locked ? "opacity-80" : ""}`}
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder.svg";
              }}
            />
            {/* Clear button - only show if not locked */}
            {!locked && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full flex items-center justify-center hover:bg-destructive/80 transition-colors"
              >
                <X className="w-4 h-4 text-destructive-foreground" />
              </button>
            )}
            {/* Lock toggle button */}
            {onToggleLock && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLock();
                }}
                className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  locked 
                    ? "bg-amber-500 hover:bg-amber-600" 
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {locked ? (
                  <Lock className="w-3 h-3 text-white" />
                ) : (
                  <Unlock className="w-3 h-3 text-muted-foreground" />
                )}
              </button>
            )}
            {/* Lock overlay icon */}
            {locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-amber-500/20 rounded-lg">
                <Lock className="w-6 h-6 text-amber-500" />
              </div>
            )}
          </>
        ) : (
          <Plus className={`w-8 h-8 ${suggested ? "text-primary" : "text-muted-foreground"}`} />
        )}
      </div>
      
      {hero && (
        <span className={`text-sm font-medium text-center max-w-[100px] truncate ${locked ? "text-amber-500" : "text-foreground"}`}>
          {hero.name}
        </span>
      )}
    </div>
  );
};

export default HeroSlot;
