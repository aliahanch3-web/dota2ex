export interface TeamComposition {
  name: string;
  pos1: string;
  pos2: string;
  pos3: string;
  pos4: string;
  pos5: string;
  playstyle: string;
}

export const teamCompositions: TeamComposition[] = [
  {
    name: "گنبد مرگ (The Chrono Combo)",
    pos1: "Faceless Void",
    pos2: "Skywrath Mage",
    pos3: "Mars",
    pos4: "Phoenix",
    pos5: "Witch Doctor",
    playstyle: "تیمی (Teamfight): تمام اسپل‌ها را داخل گنبد Void خالی کنید."
  },
  {
    name: "فشار سریع (Death Prophet Push)",
    pos1: "Luna",
    pos2: "Death Prophet",
    pos3: "Underlord",
    pos4: "Shadow Shaman",
    pos5: "Jakiro",
    playstyle: "پوش (Push): قبل از دقیقه ۳۰، با استفاده از احضارها و جادوها تمام تاورها را بیندازید."
  },
  {
    name: "شکارچیان جهانی (Global Gank)",
    pos1: "Spectre",
    pos2: "Zeus",
    pos3: "Spirit Breaker",
    pos4: "Bounty Hunter",
    pos5: "Ancient Apparition",
    playstyle: "شکار (Gank): دشمن را با BH پیدا کنید و همزمان از سراسر نقشه روی سرش خراب شوید."
  },
  {
    name: "دیوار دفاعی (Protect the Sniper)",
    pos1: "Sniper",
    pos2: "Necrophos",
    pos3: "Tidehunter",
    pos4: "Earthshaker",
    pos5: "Omniknight",
    playstyle: "دفاعی (Turtle): همه دور اسنایپر دیوار می‌چینند تا او از دور همه را بکشد."
  },
  {
    name: "جابه‌جایی سریع (High Mobility)",
    pos1: "Anti-Mage",
    pos2: "Puck",
    pos3: "Centaur Warrunner",
    pos4: "Tiny",
    pos5: "Io",
    playstyle: "سرعتی (Tempo): با سرعت بالا در مپ جابه‌جا شوید و اجازه ندهید دشمن روی شما تمرکز کند."
  }
];

export const positions = [
  { key: "pos1", label: "Pos 1", role: "Carry" },
  { key: "pos2", label: "Pos 2", role: "Mid" },
  { key: "pos3", label: "Pos 3", role: "Offlane" },
  { key: "pos4", label: "Pos 4", role: "Soft Support" },
  { key: "pos5", label: "Pos 5", role: "Hard Support" }
] as const;

export type PositionKey = "pos1" | "pos2" | "pos3" | "pos4" | "pos5";

export function getSuggestedHeroes(selectedHeroes: Record<PositionKey, string | null>, targetPosition: PositionKey): string[] {
  const suggestions: string[] = [];
  
  teamCompositions.forEach(comp => {
    let matches = true;
    
    // Check if all selected heroes match this composition
    for (const [pos, hero] of Object.entries(selectedHeroes)) {
      if (hero && comp[pos as PositionKey] !== hero) {
        matches = false;
        break;
      }
    }
    
    if (matches && !selectedHeroes[targetPosition]) {
      const suggestedHero = comp[targetPosition];
      if (!suggestions.includes(suggestedHero)) {
        suggestions.push(suggestedHero);
      }
    }
  });
  
  return suggestions;
}
