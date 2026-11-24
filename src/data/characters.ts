import reaperAsset from "@/assets/reaper.jpg.asset.json";
import damnedAsset from "@/assets/damned.jpg.asset.json";
import valkyrieAsset from "@/assets/valkyrie.jpg.asset.json";

export type FighterId = "reaper" | "damned" | "valkyrie";

export interface FighterProfile {
  id: FighterId;
  code: string;
  name: string;
  archetype: string;
  description: string;
  signatureAttack: string;
  weapon: string;
  portraitUrl: string;
  auraColor: string;
  trailHex: string;
  objectPosition: string;
}

export const FIGHTERS: FighterProfile[] = [
  {
    id: "reaper",
    code: "01",
    name: "THE REAPER",
    archetype: "Agile Executioner",
    description:
      "A hooded executioner wielding a massive serrated runic broadsword, shrouded in ethereal mist and spectral energy.",
    signatureAttack: "Spectral Severance",
    weapon: "Chained Runic Broadsword",
    portraitUrl: reaperAsset.url,
    auraColor: "rgba(125, 165, 255, 0.55)",
    trailHex: "#7DA5FF",
    objectPosition: "50% 22%",
  },
  {
    id: "damned",
    code: "02",
    name: "THE DAMNED",
    archetype: "Demonic Berserker",
    description:
      "A heavy berserker encased in spiky black armor with glowing crimson sigils, curved horns, and twin flame blades.",
    signatureAttack: "Hellfire Cleave",
    weapon: "Twin Crimson Flame Blades",
    portraitUrl: damnedAsset.url,
    auraColor: "rgba(240, 100, 36, 0.6)",
    trailHex: "#F06424",
    objectPosition: "50% 18%",
  },
  {
    id: "valkyrie",
    code: "03",
    name: "DARK VALKYRIE",
    archetype: "Armored Sentinel",
    description:
      "An obsidian-clad sentinel with a horned helm and cold glacial eyes, punishing every reckless strike with lethal precision.",
    signatureAttack: "Glacial Judgment",
    weapon: "Frostbound Halberd",
    portraitUrl: valkyrieAsset.url,
    auraColor: "rgba(72, 188, 255, 0.58)",
    trailHex: "#48BCFF",
    objectPosition: "50% 16%",
  },
];

export function getFighter(id: FighterId): FighterProfile {
  return FIGHTERS.find((f) => f.id === id) ?? FIGHTERS[0]!;
}