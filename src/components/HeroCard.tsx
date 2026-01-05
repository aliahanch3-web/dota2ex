import { Hero } from "@/data/heroes";
import { useState } from "react";
import getItemImage from "@/data/items";

interface HeroCardProps {
  hero: Hero;
  onClick: () => void;
}

const roleColorClass = {
  Carry: "role-carry",
  Support: "role-support",
  Offlane: "role-offlane",
  Mid: "role-mid",
};

const roleBgClass = {
  Carry: "role-bg-carry",
  Support: "role-bg-support",
  Offlane: "role-bg-offlane",
  Mid: "role-bg-mid",
};

export const HeroCard = ({ hero, onClick }: HeroCardProps) => {
  const [imageError, setImageError] = useState(false);
  
  return (
    <div
      onClick={onClick}
      className="group relative bg-card rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:hero-card-glow border border-border/50 hover:border-primary/50"
    >
      {/* Hero Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {!imageError ? (
          <img
            src={hero.image}
            alt={hero.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-secondary">
            <span className="text-4xl font-bold text-muted-foreground opacity-50">
              {hero.name.charAt(0)}
            </span>
          </div>
        )}
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
      </div>

      {/* Hero Info */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm truncate mb-1">
          {hero.name}
        </h3>
        <span
          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium border ${roleBgClass[hero.primaryRole]} ${roleColorClass[hero.primaryRole]}`}
        >
          {hero.role}
        </span>
      </div>

      {/* Quick tip on hover */}
      <div className="absolute inset-0 bg-card/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-4">
        <h3 className="font-bold text-foreground text-lg mb-2">{hero.name}</h3>
        <p className={`text-sm font-medium mb-2 ${roleColorClass[hero.primaryRole]}`}>
          {hero.role}
        </p>
        <p className="text-xs text-muted-foreground mb-2">
          <span className="text-accent">نکته:</span> {hero.quickTip}
        </p>
        <div className="text-xs text-muted-foreground">
          <span className="text-accent">آیتم‌ها:</span>
          <div className="inline-flex items-center gap-2 mr-2">
            {hero.keyItems.map((item, i) => {
              const src = getItemImage(item);
              return (
                <div key={i} className="inline-flex items-center gap-2">
                  {src ? (
                    <img
                      src={src}
                      alt={item}
                      onError={(e) => {
                        // hide broken images, fallback to initial
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                      className="w-4 h-4 object-contain rounded-sm"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="text-xs">{item}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
