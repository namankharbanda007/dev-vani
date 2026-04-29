export type SamagriIcon = "flame" | "flower" | "water" | "box";

export interface LivePujaRitual {
  id: string;
  personalityId: string;
  title: string;
  shortTitle: string;
  description: string;
  sankalpHint: string;
  durationLabel: string;
  aartiSrc?: string;
  samagriList: Array<{
    id: string;
    name: string;
    icon: SamagriIcon;
  }>;
}

export const DEFAULT_LIVE_PUJA_RITUAL_ID = "ganpati-havan";

export const LIVE_PUJA_RITUALS: LivePujaRitual[] = [
  {
    id: "ganpati-havan",
    personalityId: "5363b8f9-cf59-4c91-ba4e-c2433cc591cf",
    title: "Ganpati Havan",
    shortTitle: "Ganpati",
    description: "Begin new work, remove obstacles, and bring the family into one calm start.",
    sankalpHint: "For a new beginning, obstacle removal, or family blessing",
    durationLabel: "25-35 min",
    aartiSrc: "/audio/jai-ganesh-deva.mp3",
    samagriList: [
      { id: "g1", name: "Havan Kund", icon: "flame" },
      { id: "g2", name: "Aam Ki Lakdi", icon: "box" },
      { id: "g3", name: "Ghee", icon: "water" },
      { id: "g4", name: "Durva Grass", icon: "flower" },
      { id: "g5", name: "Gud (Jaggery)", icon: "box" },
    ],
  },
  {
    id: "sundarkand-path",
    personalityId: "2b5253c2-a23d-4762-8eac-e0b0788cb4f0",
    title: "Sundarkand Path",
    shortTitle: "Sundarkand",
    description: "For courage, protection, Hanuman bhakti, and strength during difficult phases.",
    sankalpHint: "For protection, strength, health, or peace at home",
    durationLabel: "35-45 min",
    aartiSrc: "/audio/hanuman-aarti.mp3",
    samagriList: [
      { id: "s1", name: "Chameli Tel Diya", icon: "flame" },
      { id: "s2", name: "Sindoor & Chola", icon: "box" },
      { id: "s3", name: "Tulsi Dal & Phool", icon: "flower" },
      { id: "s4", name: "Jal (Water)", icon: "water" },
      { id: "s5", name: "Besan Ladoo Prasad", icon: "box" },
    ],
  },
  {
    id: "satyanarayan-puja",
    personalityId: "5b7415d8-b68a-489f-bdc3-273a7cae9629",
    title: "Shri Satyanarayan Puja",
    shortTitle: "Satyanarayan",
    description: "For gratitude, prosperity, family harmony, and auspicious home occasions.",
    sankalpHint: "For gratitude, family prosperity, or a home ceremony",
    durationLabel: "30-40 min",
    aartiSrc: "/audio/om-jai-jagdish.mp3",
    samagriList: [
      { id: "sp1", name: "Chowki & Peela Vastra", icon: "box" },
      { id: "sp2", name: "Kalash, Nariyal, Aam Patte", icon: "water" },
      { id: "sp3", name: "Panchamrit", icon: "water" },
      { id: "sp4", name: "Panjiri Prasad", icon: "box" },
      { id: "sp5", name: "108 Tulsi Dal", icon: "flower" },
    ],
  },
  {
    id: "navagraha-shanti",
    personalityId: "8622d9e6-3271-45df-b3c0-0b9eba1b0301",
    title: "Navagraha Shanti Havan",
    shortTitle: "Navagraha",
    description: "For graha shanti, difficult transit periods, and astrology-backed remedies.",
    sankalpHint: "For graha shanti, career blocks, health, or relationship stability",
    durationLabel: "35-50 min",
    samagriList: [
      { id: "n1", name: "Havan Kund", icon: "flame" },
      { id: "n2", name: "Navagraha Samidha (Wood)", icon: "box" },
      { id: "n3", name: "Ghee", icon: "water" },
      { id: "n4", name: "Havan Samagri", icon: "box" },
      { id: "n5", name: "Jal, Akshat, Phool", icon: "flower" },
    ],
  },
];

export function isLivePujaRitualId(value: string | null | undefined): value is string {
  return Boolean(value && LIVE_PUJA_RITUALS.some((ritual) => ritual.id === value));
}

export function getLivePujaRitual(value: string | null | undefined) {
  return (
    LIVE_PUJA_RITUALS.find((ritual) => ritual.id === value) ||
    LIVE_PUJA_RITUALS.find((ritual) => ritual.id === DEFAULT_LIVE_PUJA_RITUAL_ID) ||
    LIVE_PUJA_RITUALS[0]
  );
}
