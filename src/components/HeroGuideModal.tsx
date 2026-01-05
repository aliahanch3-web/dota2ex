import { useEffect, useState } from "react";
import { Hero } from "@/data/heroes";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Sword, Package, TrendingUp, Sparkles, X, Gem, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHeroGuide } from "@/hooks/useHeroGuide";
import getItemImage from "@/data/items";

interface HeroGuideModalProps {
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

export const HeroGuideModal = ({ hero, isOpen, onClose }: HeroGuideModalProps) => {
  const [imageError, setImageError] = useState(false);
  const { guide, isLoading, isRefreshing, error, getHeroGuide, refreshGuide, clearGuide } = useHeroGuide();

  useEffect(() => {
    if (isOpen && hero) {
      getHeroGuide(hero.name);
      setImageError(false);
    } else {
      clearGuide();
    }
  }, [isOpen, hero, getHeroGuide, clearGuide]);

  if (!hero) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] bg-card border-border/50 p-0 overflow-hidden">
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          <X className="h-4 w-4 text-foreground" />
          <span className="sr-only">Close</span>
        </button>

        {/* Header with Hero Image */}
        <div className="relative h-32 bg-gradient-to-b from-primary/20 to-transparent">
          <div className="absolute -bottom-8 right-6 flex items-end gap-4">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-secondary border-2 border-border shadow-lg">
              {!imageError ? (
                <img
                  src={hero.image}
                  alt={hero.name}
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground">
                    {hero.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>
            <div className="pb-2">
              <DialogHeader className="p-0">
                <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                  {hero.name}
                  <Badge className={`${roleColorClass[hero.primaryRole]} border text-xs`}>
                    {hero.primaryRole}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-2">
                <p className="text-sm text-muted-foreground">{hero.role}</p>
                {guide && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => refreshGuide(hero.name)}
                    disabled={isRefreshing}
                    className="h-6 w-6 p-0"
                    title="بروزرسانی راهنما"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-12 px-6 pb-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground text-sm">در حال دریافت راهنما از هوش مصنوعی...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-destructive">{error}</p>
              <button
                onClick={() => getHeroGuide(hero.name)}
                className="mt-4 text-primary hover:underline text-sm"
              >
                تلاش مجدد
              </button>
            </div>
          ) : guide ? (
            <Tabs defaultValue="abilities" dir="rtl" className="w-full">
              <TabsList className="grid w-full grid-cols-5 mb-4">
                <TabsTrigger value="abilities" className="text-xs gap-1">
                  <Sword className="w-3 h-3" />
                  اسکیل‌ها
                </TabsTrigger>
                <TabsTrigger value="facets" className="text-xs gap-1">
                  <Gem className="w-3 h-3" />
                  فست‌ها
                </TabsTrigger>
                <TabsTrigger value="items" className="text-xs gap-1">
                  <Package className="w-3 h-3" />
                  آیتم‌ها
                </TabsTrigger>
                <TabsTrigger value="skillbuild" className="text-xs gap-1">
                  <TrendingUp className="w-3 h-3" />
                  لول‌گیری
                </TabsTrigger>
                <TabsTrigger value="playstyle" className="text-xs gap-1">
                  <Sparkles className="w-3 h-3" />
                  سبک بازی
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="h-[350px] pr-4">
                {/* Abilities Tab */}
                <TabsContent value="abilities" className="space-y-3 mt-0">
                  {guide.abilities.map((ability, idx) => (
                    <div key={idx} className="bg-secondary/50 rounded-lg p-3">
                      <h4 className="font-bold text-foreground mb-1">{ability.name}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{ability.description}</p>
                      {ability.tips && ability.tips.length > 0 && (
                        <div className="space-y-1">
                          {ability.tips.map((tip, tipIdx) => (
                            <p key={tipIdx} className="text-xs text-primary/80 flex items-start gap-1">
                              <span className="text-primary">•</span>
                              {tip}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </TabsContent>

                {/* Facets Tab */}
                <TabsContent value="facets" className="space-y-3 mt-0">
                  {guide.facets && guide.facets.length > 0 ? (
                    guide.facets.map((facet, idx) => (
                      <div key={idx} className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                        <h4 className="font-bold text-accent mb-1">{facet.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{facet.description}</p>
                        <div className="bg-background/50 rounded p-2">
                          <p className="text-xs text-primary">
                            <span className="font-medium">پیشنهاد: </span>
                            {facet.recommendation}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">اطلاعات فست موجود نیست</p>
                  )}
                </TabsContent>

                {/* Items Tab */}
                <TabsContent value="items" className="space-y-4 mt-0">
                  <div className="space-y-3">
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <h4 className="font-medium text-foreground text-sm mb-2">آیتم‌های شروع</h4>
                      <div className="flex flex-wrap gap-2">
                        {guide.items.starting.map((item, idx) => {
                          const src = getItemImage(item);
                          return (
                            <Badge key={idx} variant="outline" className="bg-background/50 flex items-center gap-2">
                              {src ? (
                                <img
                                  src={src}
                                  alt={item}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                  className="w-6 h-6 object-contain rounded-sm"
                                />
                              ) : null}
                              {item}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-3">
                      <h4 className="font-medium text-foreground text-sm mb-2">اوایل بازی</h4>
                      <div className="flex flex-wrap gap-2">
                        {guide.items.early.map((item, idx) => {
                          const src = getItemImage(item);
                          return (
                            <Badge key={idx} variant="outline" className="bg-background/50 flex items-center gap-2">
                              {src ? (
                                <img
                                  src={src}
                                  alt={item}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                  className="w-6 h-6 object-contain rounded-sm"
                                />
                              ) : null}
                              {item}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                      <h4 className="font-medium text-primary text-sm mb-2">آیتم‌های اصلی</h4>
                      <div className="flex flex-wrap gap-2">
                        {guide.items.core.map((item, idx) => {
                          const src = getItemImage(item);
                          return (
                            <Badge key={idx} className="bg-primary/20 border-primary/30 text-foreground flex items-center gap-2">
                              {src ? (
                                <img
                                  src={src}
                                  alt={item}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                  className="w-6 h-6 object-contain rounded-sm"
                                />
                              ) : null}
                              {item}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-secondary/50 rounded-lg p-3">
                      <h4 className="font-medium text-foreground text-sm mb-2">آیتم‌های لوکس</h4>
                      <div className="flex flex-wrap gap-2">
                        {guide.items.luxury.map((item, idx) => {
                          const src = getItemImage(item);
                          return (
                            <Badge key={idx} variant="outline" className="bg-background/50 flex items-center gap-2">
                              {src ? (
                                <img
                                  src={src}
                                  alt={item}
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                  className="w-6 h-6 object-contain rounded-sm"
                                />
                              ) : null}
                              {item}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Skill Build Tab */}
                <TabsContent value="skillbuild" className="space-y-3 mt-0">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-medium text-foreground text-sm mb-2">ترتیب اوایل بازی (لول ۱-۶)</h4>
                    <p className="text-sm text-muted-foreground">{guide.skillBuild.early}</p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <h4 className="font-medium text-primary text-sm mb-2">اولویت اسکیل</h4>
                    <p className="text-sm text-foreground">{guide.skillBuild.priority}</p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-medium text-foreground text-sm mb-2">اولتیمیت</h4>
                    <p className="text-sm text-muted-foreground">{guide.skillBuild.ultimate}</p>
                  </div>
                </TabsContent>

                {/* Playstyle Tab */}
                <TabsContent value="playstyle" className="space-y-3 mt-0">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-medium text-foreground text-sm mb-2">مرحله لین</h4>
                    <p className="text-sm text-muted-foreground">{guide.playstyle.laning}</p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-medium text-foreground text-sm mb-2">میدگیم</h4>
                    <p className="text-sm text-muted-foreground">{guide.playstyle.midGame}</p>
                  </div>

                  <div className="bg-secondary/50 rounded-lg p-3">
                    <h4 className="font-medium text-foreground text-sm mb-2">لیت‌گیم</h4>
                    <p className="text-sm text-muted-foreground">{guide.playstyle.lateGame}</p>
                  </div>

                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
                    <h4 className="font-medium text-primary text-sm mb-2">نکات کلیدی</h4>
                    <ul className="space-y-1">
                      {guide.playstyle.tips.map((tip, idx) => (
                        <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                          <span className="text-primary">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};
