"use client";

import CharacterSection from "./CharacterSection";

const CHARACTER_CATEGORIES: Record<
  string,
  { title: string; emoji: string; characters: string[] }
> = {
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
  onPersonalityPicked: (personalityIdPicked: string) => Promise<void> | void;
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

  for (const [categoryKey, categoryData] of Object.entries(CHARACTER_CATEGORIES)) {
    for (const characterName of categoryData.characters) {
      const normalizedCharacterName = normalizeTitle(characterName);
      if (
        normalizedTitle.includes(normalizedCharacterName) ||
        normalizedCharacterName.includes(normalizedTitle) ||
        normalizedTitle === normalizedCharacterName
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
}) => {
  const premadePersonalities = allPersonalities.filter(
    (personality) => personality.creator_id === null
  );

  const categorizedPersonalities: Record<string, IPersonality[]> = {};

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
    const categoryCharacterOrder = CHARACTER_CATEGORIES[categoryKey].characters.map(
      (character) => normalizeTitle(character)
    );

    categorizedPersonalities[categoryKey].sort((a, b) => {
      const aIndex = categoryCharacterOrder.findIndex(
        (character) =>
          normalizeTitle(a.title).includes(character) ||
          character.includes(normalizeTitle(a.title))
      );
      const bIndex = categoryCharacterOrder.findIndex(
        (character) =>
          normalizeTitle(b.title).includes(character) ||
          character.includes(normalizeTitle(b.title))
      );

      return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
    });
  });

  return (
    <div className="flex w-full flex-col gap-8">
      {CATEGORY_ORDER.map((categoryKey) => {
        const personalities = categorizedPersonalities[categoryKey];
        if (!personalities?.length) return null;

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
            title={CHARACTER_CATEGORIES[categoryKey].title}
            disableButtons={disableButtons}
          />
        );
      })}
    </div>
  );
};

export default UserPersonalities;
