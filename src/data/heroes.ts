export interface Hero {
  name: string;
  role: string;
  primaryRole: 'Carry' | 'Support' | 'Offlane' | 'Mid';
  quickTip: string;
  keyItems: string[];
  synergy: string;
  counters: string;
  image: string;
}

const getHeroImage = (name: string): string => {
  const formattedName = name.toLowerCase().replace(/['\s]/g, '_').replace(/__/g, '_');
  return `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${formattedName}.png`;
};

const getPrimaryRole = (role: string): 'Carry' | 'Support' | 'Offlane' | 'Mid' => {
  // Prefer the FIRST role token (e.g. "Mid/Carry" => Mid)
  const first = role.split('/')[0]?.trim().toLowerCase() || "";
  if (first.includes('mid')) return 'Mid';
  if (first.includes('carry')) return 'Carry';
  if (first.includes('offlane')) return 'Offlane';
  return 'Support';
};

export const heroes: Hero[] = [
  { name: "Abaddon", role: "Support/Offlane", primaryRole: getPrimaryRole("Support/Offlane"), quickTip: "Save قوی", keyItems: ["Holy Locket", "Aghanim"], synergy: "PA,Slark", counters: "Ancient Apparition", image: getHeroImage("Abaddon") },
  { name: "Alchemist", role: "Carry/Mid", primaryRole: getPrimaryRole("Carry/Mid"), quickTip: "Farm سریع", keyItems: ["Radiance", "BKB"], synergy: "Oracle", counters: "AA", image: getHeroImage("Alchemist") },
  { name: "Ancient Apparition", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Anti-heal", keyItems: ["Aghanim", "Shard"], synergy: "Faceless Void", counters: "Abaddon", image: getHeroImage("Ancient Apparition") },
  { name: "Anti-Mage", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Split push", keyItems: ["BF", "Manta", "Abyssal"], synergy: "Lion", counters: "Legion Commander", image: getHeroImage("Antimage") },
  { name: "Arc Warden", role: "Carry/Mid", primaryRole: getPrimaryRole("Carry/Mid"), quickTip: "Micro", keyItems: ["Midas", "Maelstrom"], synergy: "Treant", counters: "Spectre", image: getHeroImage("Arc Warden") },
  { name: "Axe", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Initiate", keyItems: ["Blink", "Blade Mail"], synergy: "Skywrath", counters: "Drow Ranger", image: getHeroImage("Axe") },
  { name: "Bane", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Disable", keyItems: ["Aether Lens"], synergy: "Mirana", counters: "Abaddon", image: getHeroImage("Bane") },
  { name: "Batrider", role: "Mid/Offlane", primaryRole: getPrimaryRole("Mid/Offlane"), quickTip: "Pickoff", keyItems: ["Blink", "BKB"], synergy: "Invoker", counters: "Oracle", image: getHeroImage("Batrider") },
  { name: "Beastmaster", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Vision", keyItems: ["Helm", "Overlord"], synergy: "Shadow Shaman", counters: "Storm Spirit", image: getHeroImage("Beastmaster") },
  { name: "Bloodseeker", role: "Carry/Mid", primaryRole: getPrimaryRole("Carry/Mid"), quickTip: "Counter blink", keyItems: ["Maelstrom", "BKB"], synergy: "Rupture heroes", counters: "Pugna", image: getHeroImage("Bloodseeker") },
  { name: "Bounty Hunter", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Vision", keyItems: ["Solar Crest"], synergy: "Sniper", counters: "Spectre", image: getHeroImage("Bounty Hunter") },
  { name: "Brewmaster", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Teamfight", keyItems: ["Aghanim", "Blink"], synergy: "Invoker", counters: "Silencer", image: getHeroImage("Brewmaster") },
  { name: "Bristleback", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Tank", keyItems: ["Vanguard", "Heart"], synergy: "Io", counters: "Viper", image: getHeroImage("Bristleback") },
  { name: "Broodmother", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Lane bully", keyItems: ["Orchid", "BKB"], synergy: "Lycan", counters: "Axe", image: getHeroImage("Broodmother") },
  { name: "Centaur Warrunner", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Tank init", keyItems: ["Blink", "Crimson"], synergy: "Snapfire", counters: "Timbersaw", image: getHeroImage("Centaur Warrunner") },
  { name: "Chaos Knight", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Burst", keyItems: ["Armlet", "Heart"], synergy: "Io", counters: "Earthshaker", image: getHeroImage("Chaos Knight") },
  { name: "Chen", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Push", keyItems: ["Mek", "Shard"], synergy: "Lycan", counters: "Axe", image: getHeroImage("Chen") },
  { name: "Clinkz", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Pickoff", keyItems: ["Desolator", "BKB"], synergy: "Treant", counters: "Slardar", image: getHeroImage("Clinkz") },
  { name: "Clockwerk", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Catch", keyItems: ["Blade Mail", "Agh"], synergy: "Skywrath", counters: "Abaddon", image: getHeroImage("Rattletrap") },
  { name: "Crystal Maiden", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Mana", keyItems: ["Glimmer", "BKB"], synergy: "Jugger", counters: "Silencer", image: getHeroImage("Crystal Maiden") },
  { name: "Dark Seer", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Combo", keyItems: ["Blink", "Greaves"], synergy: "PL", counters: "Silencer", image: getHeroImage("Dark Seer") },
  { name: "Dazzle", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Holy Locket"], synergy: "Huskar", counters: "Axe", image: getHeroImage("Dazzle") },
  { name: "Death Prophet", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Push", keyItems: ["BKB", "Shiva"], synergy: "Tide", counters: "Silencer", image: getHeroImage("Death Prophet") },
  { name: "Disruptor", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Control", keyItems: ["Aghanim"], synergy: "Faceless", counters: "Abaddon", image: getHeroImage("Disruptor") },
  { name: "Doom", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Disable", keyItems: ["Blink", "BKB"], synergy: "Invoker", counters: "Oracle", image: getHeroImage("Doom Bringer") },
  { name: "Dragon Knight", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Tank", keyItems: ["Blink", "BKB"], synergy: "Snapfire", counters: "Viper", image: getHeroImage("Dragon Knight") },
  { name: "Drow Ranger", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Damage", keyItems: ["Dragon Lance", "BKB"], synergy: "Venge", counters: "Axe", image: getHeroImage("Drow Ranger") },
  { name: "Earthshaker", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "AoE", keyItems: ["Blink", "Aghanim"], synergy: "PL", counters: "Silencer", image: getHeroImage("Earthshaker") },
  { name: "Ember Spirit", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Mobility", keyItems: ["Maelstrom", "BKB"], synergy: "Magnus", counters: "Bloodseeker", image: getHeroImage("Ember Spirit") },
  { name: "Enchantress", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Harass", keyItems: ["Dragon Lance"], synergy: "Chen", counters: "Axe", image: getHeroImage("Enchantress") },
  { name: "Enigma", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Teamfight", keyItems: ["Blink", "BKB"], synergy: "Invoker", counters: "Silencer", image: getHeroImage("Enigma") },
  { name: "Faceless Void", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Chrono", keyItems: ["Maelstrom", "BKB"], synergy: "Invoker", counters: "Viper", image: getHeroImage("Faceless Void") },
  { name: "Gyrocopter", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "AoE", keyItems: ["BKB", "Satanic"], synergy: "Io", counters: "AA", image: getHeroImage("Gyrocopter") },
  { name: "Hoodwink", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Burst", keyItems: ["Gleipnir", "Aghanim"], synergy: "Mars", counters: "BKB cores", image: getHeroImage("Hoodwink") },
  { name: "Huskar", role: "Mid/Carry", primaryRole: getPrimaryRole("Mid/Carry"), quickTip: "Low HP", keyItems: ["Armlet", "BKB"], synergy: "Dazzle", counters: "Viper", image: getHeroImage("Huskar") },
  { name: "Invoker", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Skill", keyItems: ["Aghanim", "BKB"], synergy: "Void", counters: "Brood", image: getHeroImage("Invoker") },
  { name: "Io", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Holy Locket", "Glimmer"], synergy: "Tiny", counters: "AA", image: getHeroImage("Wisp") },
  { name: "Jakiro", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Push", keyItems: ["Euls", "Aghanim"], synergy: "Faceless Void", counters: "Silencer", image: getHeroImage("Jakiro") },
  { name: "Juggernaut", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Safe", keyItems: ["Manta", "BKB"], synergy: "CM", counters: "Axe", image: getHeroImage("Juggernaut") },
  { name: "Keeper of the Light", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Mana", keyItems: ["Aghanim", "Force Staff"], synergy: "PL", counters: "Nyx", image: getHeroImage("Keeper of the Light") },
  { name: "Kunkka", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Combo", keyItems: ["Armlet", "Daedalus"], synergy: "Shadow Demon", counters: "Lifestealer", image: getHeroImage("Kunkka") },
  { name: "Legion Commander", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Duel", keyItems: ["Blink", "BKB"], synergy: "Skywrath", counters: "Oracle", image: getHeroImage("Legion Commander") },
  { name: "Leshrac", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "AoE", keyItems: ["Bloodstone", "BKB"], synergy: "ES", counters: "Nyx", image: getHeroImage("Leshrac") },
  { name: "Lich", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Slow", keyItems: ["Aghanim", "Glimmer"], synergy: "Faceless Void", counters: "Lifestealer", image: getHeroImage("Lich") },
  { name: "Lifestealer", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Anti tank", keyItems: ["Armlet", "BKB"], synergy: "Infest heroes", counters: "AA", image: getHeroImage("Life Stealer") },
  { name: "Lina", role: "Mid/Carry", primaryRole: getPrimaryRole("Mid/Carry"), quickTip: "Burst", keyItems: ["BKB", "Daedalus"], synergy: "LC", counters: "Storm", image: getHeroImage("Lina") },
  { name: "Lion", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Disable", keyItems: ["Blink", "Aghanim"], synergy: "AM", counters: "Nyx", image: getHeroImage("Lion") },
  { name: "Lone Druid", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Bear", keyItems: ["Mask of Madness", "Assault"], synergy: "Chen", counters: "LC", image: getHeroImage("Lone Druid") },
  { name: "Luna", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Push", keyItems: ["Manta", "BKB"], synergy: "Shadow Demon", counters: "Axe", image: getHeroImage("Luna") },
  { name: "Lycan", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Push", keyItems: ["Helm", "BKB"], synergy: "Beastmaster", counters: "Axe", image: getHeroImage("Lycan") },
  { name: "Magnus", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Buff", keyItems: ["Blink", "Agh"], synergy: "PA", counters: "Silencer", image: getHeroImage("Magnataur") },
  { name: "Marci", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Burst", keyItems: ["BKB", "Basher"], synergy: "Sniper", counters: "Axe", image: getHeroImage("Marci") },
  { name: "Mars", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Control", keyItems: ["Blink", "BKB"], synergy: "Snapfire", counters: "Ursa", image: getHeroImage("Mars") },
  { name: "Medusa", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Late game", keyItems: ["Skadi", "Manta"], synergy: "Tide", counters: "AM", image: getHeroImage("Medusa") },
  { name: "Meepo", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Micro", keyItems: ["Eblade", "Blink"], synergy: "Treant", counters: "Earthshaker", image: getHeroImage("Meepo") },
  { name: "Mirana", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Arrow", keyItems: ["Aghanim"], synergy: "Bane", counters: "Nyx", image: getHeroImage("Mirana") },
  { name: "Monkey King", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Lane bully", keyItems: ["Echo", "BKB"], synergy: "CM", counters: "Axe", image: getHeroImage("Monkey King") },
  { name: "Morphling", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Skill", keyItems: ["Eblade", "BKB"], synergy: "ES", counters: "AA", image: getHeroImage("Morphling") },
  { name: "Muerta", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Burst", keyItems: ["BKB", "Daedalus"], synergy: "Magnus", counters: "Nyx", image: getHeroImage("Muerta") },
  { name: "Naga Siren", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Illusion", keyItems: ["Manta", "Heart"], synergy: "Enigma", counters: "ES", image: getHeroImage("Naga Siren") },
  { name: "Nature's Prophet", role: "Carry/Support", primaryRole: getPrimaryRole("Carry/Support"), quickTip: "Global", keyItems: ["Orchid", "BKB"], synergy: "Treant", counters: "Storm", image: getHeroImage("Furion") },
  { name: "Necrophos", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Sustain", keyItems: ["Radiance", "Shard"], synergy: "Pugna", counters: "AA", image: getHeroImage("Necrolyte") },
  { name: "Night Stalker", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Vision", keyItems: ["Blink", "BKB"], synergy: "Silencer", counters: "Phoenix", image: getHeroImage("Night Stalker") },
  { name: "Nyx Assassin", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Counter int", keyItems: ["Dagon", "Agh"], synergy: "Leshrac", counters: "DK", image: getHeroImage("Nyx Assassin") },
  { name: "Ogre Magi", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Buff", keyItems: ["Aghanim"], synergy: "PA", counters: "Silencer", image: getHeroImage("Ogre Magi") },
  { name: "Omniknight", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Shard", "Agh"], synergy: "PA", counters: "AA", image: getHeroImage("Omniknight") },
  { name: "Oracle", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Aether Lens"], synergy: "Huskar", counters: "Silencer", image: getHeroImage("Oracle") },
  { name: "Outworld Destroyer", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Pure dmg", keyItems: ["Hurricane", "BKB"], synergy: "Invoker", counters: "Nyx", image: getHeroImage("Obsidian Destroyer") },
  { name: "Pangolier", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Disrupt", keyItems: ["Diffusal", "Agh"], synergy: "Void", counters: "Silencer", image: getHeroImage("Pangolier") },
  { name: "Phantom Assassin", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Crit", keyItems: ["Deso", "BKB"], synergy: "Magnus", counters: "Axe", image: getHeroImage("Phantom Assassin") },
  { name: "Phantom Lancer", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Illusion", keyItems: ["Diffusal", "Heart"], synergy: "DS", counters: "ES", image: getHeroImage("Phantom Lancer") },
  { name: "Phoenix", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Teamfight", keyItems: ["Aghanim"], synergy: "Void", counters: "Snapfire", image: getHeroImage("Phoenix") },
  { name: "Primal Beast", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Initiate", keyItems: ["BKB", "Blink"], synergy: "Skywrath", counters: "Lifestealer", image: getHeroImage("Primal Beast") },
  { name: "Puck", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Control", keyItems: ["Blink", "Witch Blade"], synergy: "CM", counters: "Silencer", image: getHeroImage("Puck") },
  { name: "Pudge", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Hook", keyItems: ["Blink", "Aghanim"], synergy: "Invoker", counters: "Lifestealer", image: getHeroImage("Pudge") },
  { name: "Pugna", role: "Mid/Support", primaryRole: getPrimaryRole("Mid/Support"), quickTip: "Anti phys", keyItems: ["Aether", "Blink"], synergy: "PA", counters: "Nyx", image: getHeroImage("Pugna") },
  { name: "Queen of Pain", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Burst", keyItems: ["Orchid", "BKB"], synergy: "LC", counters: "Silencer", image: getHeroImage("Queenofpain") },
  { name: "Razor", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Drain", keyItems: ["BKB", "Refresher"], synergy: "IO", counters: "Viper", image: getHeroImage("Razor") },
  { name: "Riki", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Pickoff", keyItems: ["Diffusal", "BKB"], synergy: "Dark Seer", counters: "Axe", image: getHeroImage("Riki") },
  { name: "Rubick", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Steal", keyItems: ["Aether Lens"], synergy: "Enigma", counters: "Nyx", image: getHeroImage("Rubick") },
  { name: "Sand King", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "AoE", keyItems: ["Blink", "Agh"], synergy: "PL", counters: "Silencer", image: getHeroImage("Sand King") },
  { name: "Shadow Demon", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Aghanim"], synergy: "Luna", counters: "Silencer", image: getHeroImage("Shadow Demon") },
  { name: "Shadow Fiend", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Damage", keyItems: ["BKB", "Daedalus"], synergy: "Dazzle", counters: "Storm", image: getHeroImage("Nevermore") },
  { name: "Shadow Shaman", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Push", keyItems: ["Blink", "Aghanim"], synergy: "DK", counters: "Axe", image: getHeroImage("Shadow Shaman") },
  { name: "Silencer", role: "Support/Mid", primaryRole: getPrimaryRole("Support/Mid"), quickTip: "Global", keyItems: ["Aghanim"], synergy: "Enigma", counters: "LC", image: getHeroImage("Silencer") },
  { name: "Skywrath Mage", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Burst", keyItems: ["Atos", "Agh"], synergy: "LC", counters: "BKB cores", image: getHeroImage("Skywrath Mage") },
  { name: "Slardar", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Minus armor", keyItems: ["Blink", "BKB"], synergy: "PA", counters: "Viper", image: getHeroImage("Slardar") },
  { name: "Slark", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Pickoff", keyItems: ["Diffusal", "BKB"], synergy: "Oracle", counters: "Axe", image: getHeroImage("Slark") },
  { name: "Snapfire", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "AoE", keyItems: ["Aghanim", "Blink"], synergy: "Mars", counters: "Lifestealer", image: getHeroImage("Snapfire") },
  { name: "Sniper", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Range", keyItems: ["Hurricane", "BKB"], synergy: "Treant", counters: "Clock", image: getHeroImage("Sniper") },
  { name: "Spectre", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Global", keyItems: ["Radiance", "Heart"], synergy: "Zeus", counters: "Necro", image: getHeroImage("Spectre") },
  { name: "Spirit Breaker", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Charge", keyItems: ["Shadow Blade"], synergy: "Inv", counters: "Slark", image: getHeroImage("Spirit Breaker") },
  { name: "Storm Spirit", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Mobility", keyItems: ["Orchid", "BKB"], synergy: "Lion", counters: "AM", image: getHeroImage("Storm Spirit") },
  { name: "Sven", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Cleave", keyItems: ["BKB", "Daedalus"], synergy: "Magnus", counters: "Viper", image: getHeroImage("Sven") },
  { name: "Techies", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Zone", keyItems: ["Aghanim"], synergy: "Turtle lineups", counters: "Zeus", image: getHeroImage("Techies") },
  { name: "Templar Assassin", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Burst", keyItems: ["Deso", "BKB"], synergy: "Venge", counters: "Viper", image: getHeroImage("Templar Assassin") },
  { name: "Terrorblade", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Illusion", keyItems: ["Manta", "Skadi"], synergy: "Oracle", counters: "Axe", image: getHeroImage("Terrorblade") },
  { name: "Tidehunter", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Teamfight", keyItems: ["Blink", "Shard"], synergy: "Medusa", counters: "Silencer", image: getHeroImage("Tidehunter") },
  { name: "Timbersaw", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Tank shred", keyItems: ["Bloodstone"], synergy: "Centaur", counters: "AA", image: getHeroImage("Shredder") },
  { name: "Tinker", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Spam", keyItems: ["Blink", "Agh"], synergy: "Frontline", counters: "Nyx", image: getHeroImage("Tinker") },
  { name: "Tiny", role: "Carry/Mid", primaryRole: getPrimaryRole("Carry/Mid"), quickTip: "Burst", keyItems: ["Echo", "BKB"], synergy: "Io", counters: "Viper", image: getHeroImage("Tiny") },
  { name: "Treant Protector", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Blink", "Shard"], synergy: "Sniper", counters: "Timber", image: getHeroImage("Treant") },
  { name: "Troll Warlord", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Duel", keyItems: ["BKB", "Satanic"], synergy: "Oracle", counters: "Axe", image: getHeroImage("Troll Warlord") },
  { name: "Tusk", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save/init", keyItems: ["Blink", "Shard"], synergy: "Drow", counters: "Phoenix", image: getHeroImage("Tusk") },
  { name: "Underlord", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Zone", keyItems: ["Pipe", "Greaves"], synergy: "Drow", counters: "Ursa", image: getHeroImage("Abyssal Underlord") },
  { name: "Undying", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Lane win", keyItems: ["Aghanim"], synergy: "Strength cores", counters: "AA", image: getHeroImage("Undying") },
  { name: "Ursa", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Roshan", keyItems: ["Blink", "BKB"], synergy: "Shaman", counters: "Viper", image: getHeroImage("Ursa") },
  { name: "Vengeful Spirit", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Swap", keyItems: ["Aghanim"], synergy: "Drow", counters: "Silencer", image: getHeroImage("Vengefulspirit") },
  { name: "Venomancer", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Zone", keyItems: ["Aghanim"], synergy: "Tank cores", counters: "Oracle", image: getHeroImage("Venomancer") },
  { name: "Viper", role: "Mid/Offlane", primaryRole: getPrimaryRole("Mid/Offlane"), quickTip: "Break", keyItems: ["Dragon Lance"], synergy: "PA", counters: "Sniper", image: getHeroImage("Viper") },
  { name: "Visage", role: "Offlane", primaryRole: getPrimaryRole("Offlane"), quickTip: "Push", keyItems: ["Aghanim"], synergy: "Chen", counters: "Snapfire", image: getHeroImage("Visage") },
  { name: "Void Spirit", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Burst", keyItems: ["Aghanim", "BKB"], synergy: "Mars", counters: "Silencer", image: getHeroImage("Void Spirit") },
  { name: "Warlock", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Teamfight", keyItems: ["Aghanim"], synergy: "FV", counters: "Silencer", image: getHeroImage("Warlock") },
  { name: "Weaver", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Elusive", keyItems: ["Linken", "Deso"], synergy: "Oracle", counters: "Axe", image: getHeroImage("Weaver") },
  { name: "Windranger", role: "Mid/Support", primaryRole: getPrimaryRole("Mid/Support"), quickTip: "Single target", keyItems: ["Maelstrom", "BKB"], synergy: "Shackle setups", counters: "Axe", image: getHeroImage("Windrunner") },
  { name: "Winter Wyvern", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Save", keyItems: ["Aghanim"], synergy: "TB", counters: "Silencer", image: getHeroImage("Winter Wyvern") },
  { name: "Witch Doctor", role: "Support", primaryRole: getPrimaryRole("Support"), quickTip: "Damage", keyItems: ["Aghanim"], synergy: "Chrono", counters: "Silencer", image: getHeroImage("Witch Doctor") },
  { name: "Wraith King", role: "Carry", primaryRole: getPrimaryRole("Carry"), quickTip: "Sustain", keyItems: ["Radiance", "BKB"], synergy: "CM", counters: "AA", image: getHeroImage("Skeleton King") },
  { name: "Zeus", role: "Mid", primaryRole: getPrimaryRole("Mid"), quickTip: "Global dmg", keyItems: ["Aghanim", "Refresher"], synergy: "Spectre", counters: "Storm", image: getHeroImage("Zuus") },
];

export const roles = ['All', 'Carry', 'Support', 'Offlane', 'Mid'] as const;
export type Role = typeof roles[number];
