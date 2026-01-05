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
  // Original compositions
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
  },
  // New compositions
  {
    name: "سونامی جادویی (Magic Burst)",
    pos1: "Gyrocopter",
    pos2: "Leshrac",
    pos3: "Enigma",
    pos4: "Dark Willow",
    pos5: "Crystal Maiden",
    playstyle: "تیمی (Teamfight): Black Hole + ترکیب جادوهای AoE برای نابودی کامل دشمن."
  },
  {
    name: "ارتش احضارها (Summon Army)",
    pos1: "Terrorblade",
    pos2: "Visage",
    pos3: "Beastmaster",
    pos4: "Enigma",
    pos5: "Chen",
    playstyle: "پوش (Push): با ارتش احضارها تاورها و روشن را سریع نابود کنید."
  },
  {
    name: "ضربه و فرار (Hit & Run)",
    pos1: "Weaver",
    pos2: "Queen of Pain",
    pos3: "Batrider",
    pos4: "Earth Spirit",
    pos5: "Vengeful Spirit",
    playstyle: "شکار (Gank): پیک کردن هیروهای تنها و فرار سریع قبل از واکنش دشمن."
  },
  {
    name: "اژدهای آتشین (Dragon Knight Deathball)",
    pos1: "Drow Ranger",
    pos2: "Dragon Knight",
    pos3: "Lycan",
    pos4: "Shadow Shaman",
    pos5: "Ogre Magi",
    playstyle: "پوش (Push): با اورا Drow و تبدیل‌های قوی، تاورها را زود بیندازید."
  },
  {
    name: "نگهبانان Late Game",
    pos1: "Medusa",
    pos2: "Invoker",
    pos3: "Tidehunter",
    pos4: "Rubick",
    pos5: "Oracle",
    playstyle: "دفاعی (Turtle): بازی را کش دهید تا Medusa و Invoker آیتم بگیرند."
  },
  {
    name: "سواران روح (Spirit Brothers)",
    pos1: "Juggernaut",
    pos2: "Storm Spirit",
    pos3: "Mars",
    pos4: "Earth Spirit",
    pos5: "Lich",
    playstyle: "سرعتی (Tempo): با تحرک بالا و اسکیل‌شات، میدفایت‌ها را ببرید."
  },
  {
    name: "شب‌پره‌ها (Night Stalkers)",
    pos1: "Slark",
    pos2: "Night Stalker",
    pos3: "Dark Seer",
    pos4: "Nyx Assassin",
    pos5: "Bane",
    playstyle: "شکار (Gank): در شب حمله کنید و با ویژن برتر دشمن را شکار کنید."
  },
  {
    name: "دیوار فیزیکی (Physical Wall)",
    pos1: "Phantom Assassin",
    pos2: "Templar Assassin",
    pos3: "Slardar",
    pos4: "Vengeful Spirit",
    pos5: "Dazzle",
    playstyle: "تیمی (Teamfight): آرمور دشمن را کاهش دهید و با ضربات فیزیکی نابود کنید."
  },
  {
    name: "کنترل کامل (Lockdown)",
    pos1: "Wraith King",
    pos2: "Outworld Destroyer",
    pos3: "Legion Commander",
    pos4: "Spirit Breaker",
    pos5: "Shadow Shaman",
    playstyle: "شکار (Gank): با استان‌های پشت سر هم، دشمن حتی نمی‌تواند حرکت کند."
  },
  {
    name: "ایمورتال (Undying Team)",
    pos1: "Lifestealer",
    pos2: "Necrophos",
    pos3: "Underlord",
    pos4: "Undying",
    pos5: "Abaddon",
    playstyle: "تیمی (Teamfight): با ساستین و هیل بالا، هیچ‌وقت نمی‌میرید."
  },
  {
    name: "اسپلیت پوش (Rat Dota)",
    pos1: "Naga Siren",
    pos2: "Tinker",
    pos3: "Nature's Prophet",
    pos4: "Keeper of the Light",
    pos5: "Shadow Demon",
    playstyle: "پوش (Push): همیشه لین‌ها را فشار دهید و هیچ‌وقت تیم‌فایت نکنید."
  },
  {
    name: "آتش و یخ (Fire & Ice)",
    pos1: "Morphling",
    pos2: "Lina",
    pos3: "Phoenix",
    pos4: "Grimstroke",
    pos5: "Crystal Maiden",
    playstyle: "تیمی (Teamfight): ترکیب المنت‌ها برای دمیج ماکسیمم."
  },
  {
    name: "بمباران هوایی (Air Strike)",
    pos1: "Gyrocopter",
    pos2: "Windranger",
    pos3: "Batrider",
    pos4: "Phoenix",
    pos5: "Winter Wyvern",
    playstyle: "تیمی (Teamfight): از هوا حمله کنید و با اولتی‌های AoE نابود کنید."
  },
  {
    name: "ربات‌های جنگی (Tinker Stack)",
    pos1: "Arc Warden",
    pos2: "Tinker",
    pos3: "Clockwerk",
    pos4: "Techies",
    pos5: "Disruptor",
    playstyle: "دفاعی (Turtle): با ماین و کنترل، دشمن را از نزدیک شدن بترسانید."
  },
  {
    name: "نینجاهای سایه (Shadow Assassins)",
    pos1: "Phantom Assassin",
    pos2: "Shadow Fiend",
    pos3: "Pangolier",
    pos4: "Nyx Assassin",
    pos5: "Shadow Demon",
    playstyle: "شکار (Gank): از سایه‌ها ظاهر شوید و سریع بکشید."
  },
  {
    name: "دیوانه‌ها (Berserkers)",
    pos1: "Ursa",
    pos2: "Huskar",
    pos3: "Axe",
    pos4: "Tusk",
    pos5: "Warlock",
    playstyle: "تیمی (Teamfight): با تهاجم شدید اوایل بازی، دشمن را له کنید."
  },
  {
    name: "هیل ماشین (Heal Machine)",
    pos1: "Alchemist",
    pos2: "Necrophos",
    pos3: "Abaddon",
    pos4: "Undying",
    pos5: "Oracle",
    playstyle: "دفاعی (Turtle): با هیل و ساستین بی‌پایان، هیچ‌کس نمی‌میرد."
  },
  {
    name: "سرعت نور (Lightning Fast)",
    pos1: "Bloodseeker",
    pos2: "Storm Spirit",
    pos3: "Primal Beast",
    pos4: "Spirit Breaker",
    pos5: "Io",
    playstyle: "سرعتی (Tempo): با سرعت حرکت بالا، همه جا حضور داشته باشید."
  },
  {
    name: "وحشت شب (Night Terror)",
    pos1: "Phantom Lancer",
    pos2: "Night Stalker",
    pos3: "Broodmother",
    pos4: "Nyx Assassin",
    pos5: "Bane",
    playstyle: "شکار (Gank): در شب با ویژن برتر شکار کنید."
  },
  {
    name: "سیل سبز (Nature's Wrath)",
    pos1: "Naga Siren",
    pos2: "Meepo",
    pos3: "Nature's Prophet",
    pos4: "Treant Protector",
    pos5: "Enchantress",
    playstyle: "پوش (Push): با کریپ‌های جنگل و ایلوژن‌ها نقشه را بگیرید."
  },
  // From Excel File 1
  {
    name: "نفرین مرگبار",
    pos1: "Muerta",
    pos2: "Lina",
    pos3: "Axe",
    pos4: "Grimstroke",
    pos5: "Lich",
    playstyle: "ترکیب جادوی Grimstroke با اولتی‌های تک‌هدف."
  },
  {
    name: "زره منفی",
    pos1: "Slardar",
    pos2: "Templar Assassin",
    pos3: "Tidehunter",
    pos4: "Vengeful Spirit",
    pos5: "Dazzle",
    playstyle: "رساندن زره دشمن به زیر صفر و وان‌شات کردن."
  },
  {
    name: "استان بی‌پایان",
    pos1: "Sven",
    pos2: "Kunkka",
    pos3: "Centaur Warrunner",
    pos4: "Tiny",
    pos5: "Lion",
    playstyle: "قفل کردن دشمن (Lockdown) تا لحظه مرگ."
  },
  {
    name: "تاریکی مطلق",
    pos1: "Spectre",
    pos2: "Night Stalker",
    pos3: "Lycan",
    pos4: "Bounty Hunter",
    pos5: "Keeper of the Light",
    playstyle: "از بین بردن ویژن دشمن و حمله در شب."
  },
  {
    name: "احضار کنندگان",
    pos1: "Wraith King",
    pos2: "Broodmother",
    pos3: "Beastmaster",
    pos4: "Enigma",
    pos5: "Chen",
    playstyle: "پر کردن مپ با یونیت‌ها و تمام کردن بازی زیر ۲۰ دقیقه."
  },
  {
    name: "ضدِ فیزیکی",
    pos1: "Terrorblade",
    pos2: "Necrophos",
    pos3: "Underlord",
    pos4: "Winter Wyvern",
    pos5: "Omniknight",
    playstyle: "مقابله با تیم‌هایی که فقط دمیج فیزیکی دارند."
  },
  {
    name: "ضدِ جادو",
    pos1: "Anti-Mage",
    pos2: "Huskar",
    pos3: "Doom",
    pos4: "Nyx Assassin",
    pos5: "Silencer",
    playstyle: "فلج کردن هیروهای جادوگر و اینتلیجنس."
  },
  {
    name: "کشش و رانش",
    pos1: "Ursa",
    pos2: "Puck",
    pos3: "Magnus",
    pos4: "Dark Seer",
    pos5: "Disruptor",
    playstyle: "جمع کردن دشمن در یک نقطه (Vacuum) و بستن راه."
  },
  {
    name: "بمب متحرک",
    pos1: "Lifestealer",
    pos2: "Storm Spirit",
    pos3: "Spirit Breaker",
    pos4: "Earth Spirit",
    pos5: "Io",
    playstyle: "ورود ناگهانی به قلب دشمن با سرعت بسیار بالا."
  },
  {
    name: "هیلِ بی‌نهایت",
    pos1: "Morphling",
    pos2: "Leshrac",
    pos3: "Bristleback",
    pos4: "Warlock",
    pos5: "Oracle",
    playstyle: "غیرممکن کردن مرگ یاران با هیل و زنده ماندن."
  },
  {
    name: "کمین از غیب",
    pos1: "Phantom Assassin",
    pos2: "Tiny",
    pos3: "Slardar",
    pos4: "Mirana",
    pos5: "Treant Protector",
    playstyle: "حمله دسته‌جمعی در حالت Invisible (نامرئی)."
  },
  {
    name: "کنترلِ زمین",
    pos1: "Monkey King",
    pos2: "Ember Spirit",
    pos3: "Mars",
    pos4: "Clockwerk",
    pos5: "Snapfire",
    playstyle: "استفاده از دیواره‌ها و موانع برای گیر انداختن حریف."
  },
  // From Excel File 2
  {
    name: "سلاخ‌خانه (Pure Damage)",
    pos1: "Spectre",
    pos2: "Timbersaw",
    pos3: "Centaur Warrunner",
    pos4: "Enchantress",
    pos5: "Silencer",
    playstyle: "تمرکز روی دمیج Pure که از زره و مقاومت جادویی رد می‌شود."
  },
  {
    name: "تله‌ی یخی (Freeze & Burn)",
    pos1: "Drow Ranger",
    pos2: "Ancient Apparition",
    pos3: "Tusk",
    pos4: "Jakiro",
    pos5: "Crystal Maiden",
    playstyle: "کم کردن شدید سرعت حرکت و اتک دشمن و منجمد کردن آن‌ها."
  },
  {
    name: "ضد حمله (The Rebound)",
    pos1: "Terrorblade",
    pos2: "Razor",
    pos3: "Tidehunter",
    pos4: "Earthshaker",
    pos5: "Abaddon",
    playstyle: "اجازه دهید دشمن حمله کند، سپس با آلتیمیت‌های دفاعی ورق را برگردانید."
  },
  {
    name: "مانا سوزی (Mana Burn)",
    pos1: "Anti-Mage",
    pos2: "Invoker",
    pos3: "Nyx Assassin",
    pos4: "Lion",
    pos5: "Keeper of the Light",
    playstyle: "خالی کردن مانای کل تیم حریف در ۵ ثانیه اول فایت."
  },
  {
    name: "بمباران هوایی ۲",
    pos1: "Gyrocopter",
    pos2: "Zeus",
    pos3: "Dawnbreaker",
    pos4: "Skywrath Mage",
    pos5: "Snapfire",
    playstyle: "استفاده از اسپل‌هایی که از آسمان روی سر دشمن می‌بارد (AOE Global)."
  },
  {
    name: "پادشاهان تانک",
    pos1: "Medusa",
    pos2: "Dragon Knight",
    pos3: "Pudge",
    pos4: "Ogre Magi",
    pos5: "Undying",
    playstyle: "تیمی که به هیچ وجه در درگیری‌های طولانی نمیرد (High HP/EHP)."
  },
  {
    name: "تفرقه بینداز و حکومت کن",
    pos1: "Naga Siren",
    pos2: "Lone Druid",
    pos3: "Beastmaster",
    pos4: "Nature's Prophet",
    pos5: "Pugna",
    playstyle: "فشار همزمان به ۳ لاین (Split Push)؛ دشمن نمی‌داند کجا را دفاع کند."
  },
  {
    name: "کمبوی چرخشی (The Vortex)",
    pos1: "Faceless Void",
    pos2: "Enigma",
    pos3: "Dark Seer",
    pos4: "Phoenix",
    pos5: "Warlock",
    playstyle: "کشیدن همه به مرکز (Vacuum) و زدن سیاهچاله و گنبد همزمان."
  },
  {
    name: "ترور از دور (Snipe Squad)",
    pos1: "Sniper",
    pos2: "Windranger",
    pos3: "Viper",
    pos4: "Hoodwink",
    pos5: "Marci",
    playstyle: "کشتن هیروهای حریف قبل از اینکه حتی بتوانند شما را روی مانیتور ببینند."
  },
  {
    name: "ضدِ فیزیکی سنگین",
    pos1: "Troll Warlord",
    pos2: "Pangolier",
    pos3: "Brewmaster",
    pos4: "Keeper of the Light",
    pos5: "Winter Wyvern",
    playstyle: "استفاده از Blind و Disarm برای اینکه دشمن نتواند حتی یک ضربه فیزیکی بزند."
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
