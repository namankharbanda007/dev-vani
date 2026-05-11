import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { getAllPersonalities, getMyPersonalities, getPersonalityById } from "@/db/personalities";
import { getUserById } from "@/db/users";
import { HIDDEN_PERSONALITIES, defaultPersonalityId } from "@/lib/data";
import { resolveUserDisplayName } from "@/app/lib/userProfileName";

export const LIVE_PUJA_PANDIT_PERSONALITY_ID = "8cfaa34a-e887-41cd-b880-c0b6169bf9cd";
export const GEMINI_LIVE_MODEL = "models/gemini-2.5-flash-native-audio-preview-12-2025";
export const HOME_PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";
export const HOME_ASTROLOGER_PERSONALITY_ID = "f8d80d91-fc28-459c-b5f6-5e98d4367ecc";

const WEBSITE_HOME_GUIDE_SECTIONS = {
    spiritual: [
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
    astrology: [
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
} as const;

const WEBSITE_HOME_GUIDE_ORDER = [
    ...WEBSITE_HOME_GUIDE_SECTIONS.spiritual,
    ...WEBSITE_HOME_GUIDE_SECTIONS.astrology,
];

const HOME_GUIDE_PREFERRED_IDS: Partial<Record<(typeof WEBSITE_HOME_GUIDE_ORDER)[number], string>> = {
    "pandit ji": HOME_PANDIT_PERSONALITY_ID,
    "the horoscope astrologer": HOME_ASTROLOGER_PERSONALITY_ID,
};

const SUPPORTED_GEMINI_LIVE_VOICES = new Set([
    "Achird",
    "Aoede",
    "Charon",
    "Enceladus",
    "Fenrir",
    "Iapetus",
    "Kore",
    "Leda",
    "Orus",
    "Puck",
    "Umbriel",
    "Zephyr",
]);

export function normalizeGuideTitle(title: string) {
    return title.toLowerCase().trim();
}

export function findWebsiteHomeGuideMatch(title: string) {
    const normalizedTitle = normalizeGuideTitle(title);
    return WEBSITE_HOME_GUIDE_ORDER.find(
        (candidate) =>
            normalizedTitle === candidate ||
            normalizedTitle.includes(candidate) ||
            candidate.includes(normalizedTitle)
    );
}

export function resolveGeminiLiveVoice(personality: IPersonality) {
    const configuredVoice = personality.oai_voice?.trim();
    if (configuredVoice && SUPPORTED_GEMINI_LIVE_VOICES.has(configuredVoice)) {
        return configuredVoice;
    }

    const normalizedTitle = normalizeGuideTitle(personality.title);

    if (normalizedTitle.includes("astrolog")) {
        return "Achird";
    }

    if (
        normalizedTitle.includes("relationship") ||
        normalizedTitle.includes("love") ||
        normalizedTitle.includes("financial")
    ) {
        return "Aoede";
    }

    return "Enceladus";
}

export function getUserMetadata(dbUser: IUser | null | undefined) {
    return ((dbUser?.user_info as Record<string, unknown> | null)?.user_metadata ||
        {}) as Record<string, string | undefined>;
}

export function getDisplayName(authUser: User, dbUser: IUser | null | undefined) {
    return resolveUserDisplayName({ dbUser, authUser });
}

export function getGuideOpeningLine(personality: IPersonality) {
    return (
        personality.first_message_prompt?.trim() ||
        `Namaste. I am ${personality.title}. Ask anything about your spiritual path, rituals, or guidance.`
    );
}

export function buildGuideSystemInstruction(
    authUser: User,
    dbUser: IUser | null,
    personality: IPersonality,
    languageCodeOverride?: string | null
) {
    const metadata = getUserMetadata(dbUser);
    const userName = getDisplayName(authUser, dbUser);

    return `
${personality.character_prompt || ""}

VOICE STYLE:
${personality.voice_prompt || "Warm, grounded, spiritually reassuring, and concise."}

You are ${personality.title} inside the Smart Murti app.
You are speaking with ${userName}.

Known user details:
- Birth date: ${metadata.birth_date || "Unknown"}
- Birth time: ${metadata.birth_time || "Unknown"}
- Birth place: ${metadata.birth_place || "Unknown"}
- Rashi: ${metadata.rashi || "Unknown"}
- Preferred language: ${languageCodeOverride || dbUser?.language_code || "en-IN"}

Rules:
- Never mention demo limits, trial time, guest mode, or test mode.
- Stay fully in character as the selected guide from Supabase.
- Give devotional, astrological, or ritual guidance in the tone of this guide.
- Match the devotee's preferred language naturally unless they switch on their own.
- Keep chat replies to 1-4 short spoken-friendly sentences unless the user explicitly asks for depth.
`.trim();
}

export async function ensureMobileUser(supabase: SupabaseClient, authUser: User) {
    let dbUser = await getUserById(supabase, authUser.id);
    if (dbUser) {
        return dbUser;
    }

    const identifier =
        authUser.email ?? (authUser.phone ? `${authUser.phone}@phone.com` : `${authUser.id}@smartmurti.com`);

    await supabase.from("users").insert({
        user_id: authUser.id,
        email: identifier,
        supervisor_name: (authUser.user_metadata?.name as string) || authUser.email?.split("@")[0] || "Devotee",
        supervisee_name: "",
        supervisee_persona: "",
        supervisee_age: 0,
        personality_id: (authUser.user_metadata?.personality_id as string | undefined) || defaultPersonalityId,
        language_code: "en-US",
        session_time: 0,
        last_session_reset: null,
        is_premium: false,
        wallet_balance: 0,
        device_id: null,
        user_info: {
            user_type: "user",
            user_metadata: authUser.user_metadata || {},
        },
        avatar_url:
            (authUser.user_metadata?.avatar_url as string) ||
            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                authUser.email?.split("@")[0] || "devotee"
            )}`,
    });

    dbUser = await getUserById(supabase, authUser.id);
    return dbUser ?? null;
}

export async function getMobileGuideCatalog(supabase: SupabaseClient, userId: string) {
    const [premadePersonalities, customPersonalities] = await Promise.all([
        getAllPersonalities(supabase),
        getMyPersonalities(supabase, userId),
    ]);

    const deduped = [...customPersonalities, ...premadePersonalities]
        .filter((guide) => !HIDDEN_PERSONALITIES.includes(guide.title))
        .filter(
            (guide, index, list) =>
                list.findIndex((candidate) => candidate.personality_id === guide.personality_id) === index
        );

    const websiteHomeGuides = deduped
        .filter((guide) => !guide.creator_id)
        .filter((guide) => Boolean(findWebsiteHomeGuideMatch(guide.title)))
        .reduce((catalog, guide) => {
            const match = findWebsiteHomeGuideMatch(guide.title);
            if (!match) {
                return catalog;
            }

            const existing = catalog.get(match);
            if (!existing) {
                catalog.set(match, guide);
                return catalog;
            }

            const preferredId = HOME_GUIDE_PREFERRED_IDS[match];
            const existingPreferred = preferredId ? existing.personality_id === preferredId : false;
            const guidePreferred = preferredId ? guide.personality_id === preferredId : false;

            if (guidePreferred && !existingPreferred) {
                catalog.set(match, guide);
                return catalog;
            }

            if (existingPreferred && !guidePreferred) {
                return catalog;
            }

            if (guide.provider === "gemini" && existing.provider !== "gemini") {
                catalog.set(match, guide);
                return catalog;
            }

            return catalog;
        }, new Map<string, IPersonality>());

    return WEBSITE_HOME_GUIDE_ORDER
        .map((slot) => websiteHomeGuides.get(slot))
        .filter(Boolean) as IPersonality[];
}

export async function getPersonalityForSession(
    supabase: SupabaseClient,
    dbUser: IUser,
    personalityId?: string | null
) {
    if (!personalityId || personalityId === dbUser.personality_id) {
        return (dbUser.personality as IPersonality | undefined) ?? (await getPersonalityById(supabase, dbUser.personality_id));
    }

    return await getPersonalityById(supabase, personalityId);
}
