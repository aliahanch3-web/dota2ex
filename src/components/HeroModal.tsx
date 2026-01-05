import { Hero } from "@/data/heroes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

interface HeroModalProps {
  hero: Hero | null;
  isOpen: boolean;
  onClose: () => void;
}

const roleColorClass = {
  Carry: "bg-hero-carry/20 text-hero-carry border-hero-carry/30",
  Support: "bg-hero-support/20 text-hero-support border-hero-support/30",
  Offlane: "bg-hero-offlane/20 text-hero-offlane border-hero-offlane/30",
  Mid: "bg-hero-mid/20 text-hero-mid border-hero-mid/30",
};

export const HeroModal = ({ hero, isOpen, onClose }: HeroModalProps) => {
  const [imageError, setImageError] = useState(false);

  if (!hero) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4 text-foreground" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            {hero.name}
            <Badge className={`${roleColorClass[hero.primaryRole]} border`}>
              {hero.primaryRole}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Hero Image */}
          <div className="relative aspect-video rounded-lg overflow-hidden bg-secondary">
            {!imageError ? (
              <img
                src={hero.image}
                alt={hero.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground opacity-30">
                  {hero.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">نقش</p>
              <p className="font-semibold text-foreground">{hero.role}</p>
            </div>
            <div className="bg-secondary/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">نکته سریع</p>
              <p className="font-semibold text-foreground">{hero.quickTip}</p>
            </div>
          </div>

          {/* Key Items */}
          <div className="bg-secondary/50 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-2">آیتم‌های کلیدی</p>
            <div className="flex flex-wrap gap-2">
              {hero.keyItems.map((item, index) => (
                <Badge key={index} variant="outline" className="bg-primary/10 border-primary/30 text-foreground">
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Synergy & Counters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-hero-offlane/10 border border-hero-offlane/20 rounded-lg p-3">
              <p className="text-xs text-hero-offlane mb-1">هم‌افزایی</p>
              <p className="font-medium text-foreground">{hero.synergy}</p>
            </div>
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-xs text-destructive mb-1">کانتر</p>
              <p className="font-medium text-foreground">{hero.counters}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
