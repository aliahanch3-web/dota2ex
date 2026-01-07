const normalize = (name: string) =>
  name
    .toLowerCase()
    .replace(/\+|\'|\.|,/g, "")
    .replace(/&/g, "and")
    .replace(/\s+/g, "_")
    .replace(/__/g, "_")
    .trim();

const ITEM_MAP: Record<string, string> = {
  // common canonical mappings and aliases
  bkb: "black_king_bar",
  "black king bar": "black_king_bar",
  blink: "blink_dagger",
  "blink dagger": "blink_dagger",
  aghanim: "aghanims_scepter",
  "aghanim scepter": "aghanims_scepter",
  shard: "aghanims_shard",
  "aghanim shard": "aghanims_shard",
  radiance: "radiance",
  manta: "manta_style",
  "manta style": "manta_style",
  bf: "battle_fury",
  "battle fury": "battle_fury",
  maelstrom: "maelstrom",
  abyssal: "abyssal_blade",
  midas: "hand_of_midas",
  "hand of midas": "hand_of_midas",
  "aether lens": "aether_lens",
  helm: "helm_of_the_dominator",
  helm_of_dominator: "helm_of_the_dominator",
  overlord: "helm_of_the_dominator",
  "solar crest": "solar_crest",
  vanguard: "vanguard",
  heart: "heart",
  orchid: "orchid_malevolence",
  crimson: "crimson_guard",
  armlet: "armlet",
  mek: "mekansm",
  desolator: "desolator",
  glimmer: "glimmer_cape",
  greaves: "guardian_greaves",
  shiva: "shivas_guard",
  euls: "cyclone",
  "force staff": "force_staff",
  "sange and yasha": "sange_and_yasha",
  daedalus: "daedalus",
  bloodstone: "bloodstone",
  "mask of madness": "mask_of_madness",
  assault: "assault",
  skadi: "skadi",
  eblade: "ethereal_blade",
  echo: "echo_sabre",
  gleipnir: "gleipnir",
  basher: "basher",
  diffusal: "diffusal_blade",
  deso: "desolator",
  linken: "linkens_sphere",
  refresher: "refresher",
  satanic: "satanic",
  pipe: "pipe",
  "shadow blade": "shadow_blade",
  hurricane: "hurricane_pike",
  "dragon lance": "dragon_lance",
  "witch blade": "silver_edge",
  blade_mail: "blade_mail",
  crimson_guard: "crimson_guard",
};

const STEAM_ITEM_BASE = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/items";

export const getItemImage = (name: string): string | null => {
  if (!name) return null;
  const n = normalize(name);
  // direct map
  const mapped = ITEM_MAP[n] || ITEM_MAP[name.toLowerCase()];
  const fileName = mapped || n;

  // try to build a likely CDN URL
  const url = `${STEAM_ITEM_BASE}/${fileName}.png`;

  return url;
};

export default getItemImage;
