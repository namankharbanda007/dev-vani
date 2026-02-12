"use client";

import CharacterSection from "./CharacterSection";

// Define character categories with their display order and character names
const CHARACTER_CATEGORIES: { [key: string]: { title: string; emoji: string; characters: string[] } } = {
    spiritual: {
        title: "🙏 Spiritual",
        emoji: "🙏",
        characters: [
            "pandit ji",
            "the spiritual guide",
            "ganpati havan by pandit ji",
            "sundarkand path",
            "navagraha shanti havan",
            "shri satyanarayan puja",
        ]
    },
    astrology: {
        title: "✨ Astrology",
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
        ]
    },
    seniors: {
        title: "👴 Seniors",
        emoji: "👴",
        characters: [
            "old age friend",
            "old days friend",
            "the tech translator",
        ]
    },
    adult: {
        title: "👨 Adults",
        emoji: "👨",
        characters: [
            "the advocate",
            "the travel guide",
            "sports commentator",
            "the chef's assistant",
            "chef's assistant",
            "the gift guru",
            "the interviewer",
            "the fitness coach",
        ]
    },
    students: {
        title: "🎓 Students",
        emoji: "🎓",
        characters: [
            "the exam coach",
            "the language exchange",
            "the debate partner",
            "the career counselor",
        ]
    },
    children: {
        title: "👶 Children",
        emoji: "👶",
        characters: [
            "the phonics parrot",
            "the dino-historians",
            "bedtime stories by grandma",
            "the time traveler from 3025",
            "buddy",
        ]
    },
};

// Order of categories to display
const CATEGORY_ORDER = ["spiritual", "astrology", "seniors", "adult", "students", "children"];

interface UserPersonalitiesProps {
    onPersonalityPicked: (personalityIdPicked: string) => void;
    allPersonalities: IPersonality[];
    personalityIdState: string;
    languageState: string;
    disableButtons: boolean;
    selectedFilters: PersonalityFilter[];
    myPersonalities: IPersonality[];
}

// Helper function to normalize character names for matching
const normalizeTitle = (title: string): string => {
    return title.toLowerCase().trim();
};

// Find which category a personality belongs to
const findCategory = (personality: IPersonality): string | null => {
    const normalizedTitle = normalizeTitle(personality.title);

    for (const [categoryKey, categoryData] of Object.entries(CHARACTER_CATEGORIES)) {
        for (const charName of categoryData.characters) {
            // Check if the personality title contains or matches the character name
            const normalizedCharName = normalizeTitle(charName);
            if (normalizedTitle.includes(normalizedCharName) ||
                normalizedCharName.includes(normalizedTitle) ||
                normalizedTitle === normalizedCharName) {
                return categoryKey;
            }
        }
    }
    return null;
};

const UserPersonalities: React.FC<UserPersonalitiesProps> = ({
    onPersonalityPicked,
    allPersonalities,
    personalityIdState,
    languageState,
    disableButtons,
    selectedFilters,
    myPersonalities,
}) => {
    // Separate premade personalities (creator_id is null) from user-created ones
    const premadePersonalities = allPersonalities.filter(p => p.creator_id === null);
    const userCreatedPersonalities = allPersonalities.filter(p => p.creator_id !== null);

    // Group premade personalities by category
    const categorizedPersonalities: { [key: string]: IPersonality[] } = {};
    const uncategorizedPersonalities: IPersonality[] = [];

    premadePersonalities.forEach(personality => {
        const category = findCategory(personality);
        if (category) {
            if (!categorizedPersonalities[category]) {
                categorizedPersonalities[category] = [];
            }
            categorizedPersonalities[category].push(personality);
        } else {
            uncategorizedPersonalities.push(personality);
        }
    });

    // Sort characters within each category based on the order in CHARACTER_CATEGORIES
    CATEGORY_ORDER.forEach(categoryKey => {
        if (categorizedPersonalities[categoryKey]) {
            const categoryCharOrder = CHARACTER_CATEGORIES[categoryKey].characters.map(c => normalizeTitle(c));
            categorizedPersonalities[categoryKey].sort((a, b) => {
                const aIndex = categoryCharOrder.findIndex(c => normalizeTitle(a.title).includes(c) || c.includes(normalizeTitle(a.title)));
                const bIndex = categoryCharOrder.findIndex(c => normalizeTitle(b.title).includes(c) || c.includes(normalizeTitle(b.title)));
                return (aIndex === -1 ? 999 : aIndex) - (bIndex === -1 ? 999 : bIndex);
            });
        }
    });

    return (
        <div className="flex flex-col gap-8 w-full">
            {/* My Characters Section */}
            {myPersonalities.length > 0 && (
                <CharacterSection
                    selectedFilters={selectedFilters}
                    allPersonalities={myPersonalities}
                    languageState={languageState}
                    personalityIdState={personalityIdState}
                    onPersonalityPicked={onPersonalityPicked}
                    title={"My Characters"}
                    disableButtons={disableButtons}
                />
            )}

            {/* User Created Characters (if any separate from "My Characters") */}
            {userCreatedPersonalities.length > 0 && (
                <CharacterSection
                    selectedFilters={selectedFilters}
                    allPersonalities={userCreatedPersonalities}
                    languageState={languageState}
                    personalityIdState={personalityIdState}
                    onPersonalityPicked={onPersonalityPicked}
                    title={"Community Characters"}
                    disableButtons={disableButtons}
                />
            )}

            {/* Categorized Premade Characters - Netflix Style */}
            {CATEGORY_ORDER.map(categoryKey => {
                const personalities = categorizedPersonalities[categoryKey];
                if (!personalities || personalities.length === 0) return null;

                const categoryInfo = CHARACTER_CATEGORIES[categoryKey];

                return (
                    <CharacterSection
                        key={categoryKey}
                        selectedFilters={selectedFilters}
                        allPersonalities={personalities}
                        languageState={languageState}
                        personalityIdState={personalityIdState}
                        onPersonalityPicked={onPersonalityPicked}
                        title={categoryInfo.title}
                        disableButtons={disableButtons}
                    />
                );
            })}

            {/* Uncategorized Characters (fallback) */}
            {uncategorizedPersonalities.length > 0 && (
                <CharacterSection
                    selectedFilters={selectedFilters}
                    allPersonalities={uncategorizedPersonalities}
                    languageState={languageState}
                    personalityIdState={personalityIdState}
                    onPersonalityPicked={onPersonalityPicked}
                    title={"Other Characters"}
                    disableButtons={disableButtons}
                />
            )}
        </div>
    );
};

export default UserPersonalities;
