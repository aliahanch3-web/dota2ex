import { useState, useMemo } from "react";
import { heroes, Hero, Role } from "@/data/heroes";
import { HeroCard } from "@/components/HeroCard";
import { HeroModal } from "@/components/HeroModal";
import { RoleFilter } from "@/components/RoleFilter";
import { SearchBar } from "@/components/SearchBar";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRole, setActiveRole] = useState<Role>("All");
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);

  const filteredHeroes = useMemo(() => {
    return heroes.filter((hero) => {
      const matchesSearch = hero.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = activeRole === "All" || hero.primaryRole === activeRole;
      return matchesSearch && matchesRole;
    });
  }, [searchQuery, activeRole]);

  const heroCount = useMemo(() => {
    const counts: Record<string, number> = { All: heroes.length };
    heroes.forEach((hero) => {
      counts[hero.primaryRole] = (counts[hero.primaryRole] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-gradient">Dota 2</span>{" "}
              <span className="text-foreground">Heroes</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              تمام ۱۲۷ هیروی دوتا ۲ با اطلاعات کامل
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Role Filter */}
          <RoleFilter
            activeRole={activeRole}
            onRoleChange={setActiveRole}
            heroCount={heroCount}
          />
        </div>
      </header>

      {/* Hero Grid */}
      <main className="container mx-auto px-4 py-8">
        {filteredHeroes.length > 0 ? (
          <>
            <p className="text-center text-muted-foreground mb-6">
              نمایش {filteredHeroes.length} هیرو
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredHeroes.map((hero) => (
                <HeroCard
                  key={hero.name}
                  hero={hero}
                  onClick={() => setSelectedHero(hero)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-2xl text-muted-foreground mb-2">هیرویی یافت نشد</p>
            <p className="text-muted-foreground">
              لطفاً عبارت دیگری را جستجو کنید
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            ساخته شده با ❤️ برای جامعه دوتا ۲
          </p>
        </div>
      </footer>

      {/* Hero Modal */}
      <HeroModal
        hero={selectedHero}
        isOpen={!!selectedHero}
        onClose={() => setSelectedHero(null)}
      />
    </div>
  );
};

export default Index;
