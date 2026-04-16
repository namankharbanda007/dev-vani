"use client";

import CharacterSection from "./CharacterSection";

const CHARACTER_CATEGORIES: {
  [key: string]: { title: string; emoji: string; characters: string[] };
} = {
  spiritual: {
    title: "🙏 Smart Pandit",
    emoji: "🙏",
    characters: [
      "pandit ji",
      "the spiritual guide",
      "ganpati havan by pandit ji",
      "sundarkand path",
      "navagraha shanti havan",
      "shri satyanarayan puja",
      "smart pandit ankshastri",
      "smart pandit margdarshak",
      "smart pandit vastu",
      "smart pandit lalit",
    ],
  },
  astrology: {
    title: "✨ Specialist Guidance",
    emoji: "✨",
    characters: [
      "the horoscope astrologer",
      "the relationship advisor",
      "the financial advisor",
      "the navigator of love stories",
      "the salaried employee",
      "the govt. job aspirant",
      "the career healer",
      "the business scaler",
      "the path decider",
      "the educational guide",
    ],
  },
};

const CATEGORY_ORDER = ["spiritual", "astrology"];

interface UserPersonalitiesProps {
  onPersonalityPicked: (personalityIdPicked: string) => void;
  onCallCharacter?: (personalityId: string) => void;
  onChatCharacter?: (personalityId: string) => void;
  allPersonalities: IPersonality[];
  personalityIdState: string;
  languageState: string;
  disableButtons: boolean;
  selectedFilters: PersonalityFilter[];
  myPersonalities: IPersonality[];
}

const normalizeTitle = (title: string): string => title.toLowerCase().trim();

const findCategory = (personality: IPersonality): string | null => {
  const normalizedTitle = normalizeTitle(personality.title);

  for (const [categoryKey, categoryData] of Object.entries(
    CHARACTER_CATEGORIES
  )) {
    for (const charName of categoryData.characters) {
      const normalizedCharName = normalizeTitle(charName);
      if (
        normalizedTitle.includes(normalizedCharName) ||
        normalizedCharName.includes(normalizedTitle) ||
        normalizedTitle === normalizedCharName
      ) {
        return categoryKey;
      }
    }
  }

  return null;
};

const UserPersonalities: React.FC<UserPersonalitiesProps> = ({
  onPersonalityPicked,
  onCallCharacter,
  onChatCharacter,
  allPersonalities,
  personalityIdState,
  languageState,
  disableButtons,
  selectedFilters,
  myPersonalities,
}) => {
  const premadePersonalities = allPersonalities.filter(
    (p) => p.creator_id === null
  );

  const categorizedPersonalities: { [key: string]: IPersonality[] } = {};

  premadePersonalities.forEach((personality) => {
    const category = findCategory(personality);
    if (!category) return;
    if (!categorizedPersonalities[category]) {
      categorizedPersonalities[category] = [];
    }
    categorizedPersonalities[category].push(personality);
  });

  CATEGORY_ORDER.forEach((categoryKey) => {
    if (!categorizedPersonalities[categoryKey]) return;
    const categoryCharOrder = CHARACTER_CATEGORIES[categoryKey].characters.map(
      (c) => normalizeTitle(c)
    );
    categorizedPersonalities[categoryKey].sort((a, b) => {
      const aIndex = categoryCharOrder.findIndex(
        (c) =>
          normalizeTitle(a.title).includes(c) ||
          c.includes(normalizeTitle(a.title))
      );
      const bIndex = categoryCharOrder.findIndex(
        (c) =>
          normalizeTitle(b.title).includes(c) ||
          c.includes(normalizeTitle(b.title))
      );
      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  });

  return (
    <div className="flex w-full flex-col gap-8">
      {CATEGORY_ORDER.map((categoryKey) => {
        const personalities = categorizedPersonalities[categoryKey];
        if (!personalities?.length) return null;

        const categoryInfo = CHARACTER_CATEGORIES[categoryKey];

        return (
          <CharacterSection
            key={categoryKey}
            selectedFilters={selectedFilters}
            allPersonalities={personalities}
            languageState={languageState}
            personalityIdState={personalityIdState}
            onPersonalityPicked={onPersonalityPicked}
            onCallCharacter={onCallCharacter}
            onChatCharacter={onChatCharacter}
            title={categoryInfo.title}
            disableButtons={disableButtons}
          />
        );
      })}
    </div>
  );
};

export default UserPersonalities;
