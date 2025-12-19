
export const CATEGORY_LABELS: Record<string, string> = {
    children: "For Children",
    students: "For Students",
    adults: "For Adults (Lifestyle)",
    seniors: "For Seniors",
    specialized: "Specialized & Fun",
    funny: "Funny & Entertainment",
};

export const DISPLAY_ORDER = ["children", "students", "adults", "seniors", "specialized", "funny"];

export const CATEGORY_MAP: Record<string, string[]> = {
    children: [
        "grandma_rose",
        "buddy_robot",
        "phonics_parrot",
        "dino_historian"
    ],
    students: [
        "career_counselor",
        "exam_coach",
        "language_exchange_pal",
        "debate_partner"
    ],
    adults: [
        "fitness_drill_sergeant",
        "chef_assistant",
        "travel_guide",
        "gift_guru",
        "sports_commentator"
    ],
    seniors: [
        "news_reader",
        "spiritual_guide",
        "nostalgia_companion",
        "daily_reminder",
        "tech_translator"
    ],
    specialized: [
        "astrologer",
        "interviewer",
        "advocate_advisor"
    ],
    funny: [
        "time_traveler_3025"
    ]
};
