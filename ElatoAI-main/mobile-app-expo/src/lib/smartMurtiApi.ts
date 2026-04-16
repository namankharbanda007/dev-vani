import { Buffer } from "buffer";
import { User } from "@supabase/supabase-js";

import { supabase } from "./supabase";
import { ChatMessage, DbUser, HoroscopePayload, Personality } from "../models/types";

const DEFAULT_PERSONALITY_ID = "a1c073e6-653d-40cf-acc1-891331689409";
export const HOME_PANDIT_PERSONALITY_ID = "3bb38537-39a6-47c5-a7ae-04dd8ad10cd9";
export const LIVE_PUJA_PANDIT_PERSONALITY_ID = "8cfaa34a-e887-41cd-b880-c0b6169bf9cd";
export const HOME_ASTROLOGER_PERSONALITY_ID = "f8d80d91-fc28-459c-b5f6-5e98d4367ecc";
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash"] as const;
const SITE_ORIGIN = "https://www.smartmurti.com";
export const LIVEKIT_SERVER_URL =
  process.env.EXPO_PUBLIC_LIVEKIT_URL || "wss://smart-murti-u1cpnjeh.livekit.cloud";
const IMAGE_URL_PATTERN = /^https?:\/\/\S+/i;
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
const VIDEO_ENABLED_GUIDE_TITLES = new Set(["pandit ji", "the horoscope astrologer"]);
const HOME_GUIDE_PREFERRED_IDS: Partial<Record<(typeof WEBSITE_HOME_GUIDE_ORDER)[number], string>> = {
  "pandit ji": HOME_PANDIT_PERSONALITY_ID,
  "the horoscope astrologer": HOME_ASTROLOGER_PERSONALITY_ID,
};

const HIDDEN_PERSONALITIES = new Set([
  "Anya",
  "Lord Shri Ram",
  "Godess Laxmi",
  "Mata Parvati: The Divine Mother",
  "Santa Claus",
  "Qura",
  "Porous Pete",
  "Luna the Epilepsy Guardian",
  "Iron Man",
  "Gandalf",
  "Sherlock",
  "Art guru",
  "Fitness coach",
  "Eco champ",
  "Master chef",
  "Batman",
  "Geo guide",
  "Blood test pal",
  "Math wiz",
]);

export const LANGUAGE_OPTIONS = [
  { code: "en-US", label: "English" },
  { code: "hi-IN", label: "Hindi" },
  { code: "en-IN", label: "Hinglish" },
  { code: "te-IN", label: "Telugu" },
  { code: "ta-IN", label: "Tamil" },
  { code: "bn-IN", label: "Bengali" },
] as const;

type PersonalityDetails = Personality;

function requireSupabase() {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  return supabase;
}

function requireGeminiKey() {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API key is not configured for the mobile app.");
  }

  return GEMINI_API_KEY;
}

async function getAuthUser() {
  const client = requireSupabase();
  const {
    data: { user },
  } = await client.auth.getUser();

  return user;
}

async function getSession() {
  const client = requireSupabase();
  const {
    data: { session },
  } = await client.auth.getSession();

  return session;
}

async function getSiteAuthHeaders(extraHeaders?: Record<string, string>) {
  const session = await getSession();
  const token = session?.access_token;

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extraHeaders,
  };
}

async function fetchSiteJson<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = await getSiteAuthHeaders({
    ...(init?.body && !(init.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
    ...(init?.headers as Record<string, string> | undefined),
  });

  const response = await fetch(`${SITE_ORIGIN}${path}`, {
    ...init,
    headers,
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(
      payload?.error || payload?.message || `Request failed with status ${response.status}`
    );
  }

  return payload as T;
}

function extractGeminiText(payload: any) {
  const parts = payload?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) {
    return "";
  }

  return parts
    .map((part) => (typeof part?.text === "string" ? part.text : ""))
    .join("\n")
    .trim();
}

function stripCodeFence(value: string) {
  const trimmed = value.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1].trim() : trimmed;
}

function getGuidePriority(personality: Personality) {
  const title = personality.title.toLowerCase();

  if (personality.creator_id) {
    return 0;
  }

  if (title.includes("pandit") || title.includes("puja") || title.includes("havan")) {
    return 1;
  }

  if (title.includes("astrolog") || title.includes("horoscope") || title.includes("kundli")) {
    return 2;
  }

  return 3;
}

function sortGuideCatalog(personalities: Personality[]) {
  return [...personalities].sort((left, right) => {
    const priorityDiff = getGuidePriority(left) - getGuidePriority(right);
    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return left.title.localeCompare(right.title);
  });
}

function isLikelyImageUrl(value?: string | null) {
  if (!value) {
    return false;
  }

  return IMAGE_URL_PATTERN.test(value.trim());
}

function isLikelyRelativeAssetPath(value?: string | null) {
  if (!value) {
    return false;
  }

  const trimmed = value.trim();
  return trimmed.startsWith("/assets/") || trimmed.startsWith("/storage/");
}

function isGuideImageValue(value?: string | null) {
  return isLikelyImageUrl(value) || isLikelyRelativeAssetPath(value);
}

function resolveGuideImageValue(value?: string | null) {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (isLikelyImageUrl(trimmed)) {
    return trimmed;
  }

  if (isLikelyRelativeAssetPath(trimmed)) {
    return getRemoteAsset(trimmed);
  }

  return null;
}

function normalizeGuideTitle(title: string) {
  return title.toLowerCase().trim();
}

function findWebsiteHomeGuideMatch(title: string) {
  const normalizedTitle = normalizeGuideTitle(title);
  return WEBSITE_HOME_GUIDE_ORDER.find(
    (candidate) =>
      normalizedTitle === candidate ||
      normalizedTitle.includes(candidate) ||
      candidate.includes(normalizedTitle)
  );
}

function resolveGeminiLiveVoice(personality: PersonalityDetails) {
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

function inferFileExtension(uri: string, mimeType?: string | null) {
  if (mimeType?.includes("/")) {
    return mimeType.split("/")[1].replace("jpeg", "jpg");
  }

  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  return match?.[1]?.toLowerCase() || "jpg";
}

async function geminiGenerate({
  systemInstruction,
  message,
  history = [],
  responseMimeType,
}: {
  systemInstruction: string;
  message: string;
  history?: ChatMessage[];
  responseMimeType?: "application/json";
}) {
  const apiKey = requireGeminiKey();
  let lastError = "Gemini request failed";

  for (const modelName of GEMINI_MODELS) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }],
          },
          generationConfig: responseMimeType ? { responseMimeType } : undefined,
          contents: [
            ...history.map((entry) => ({
              role: entry.role === "assistant" ? "model" : "user",
              parts: [{ text: entry.content }],
            })),
            {
              role: "user",
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      lastError =
        payload?.error?.message ||
        payload?.error ||
        payload?.message ||
        `${modelName} request failed`;
      continue;
    }

    const text = extractGeminiText(payload);
    if (text) {
      return stripCodeFence(text);
    }

    lastError = `${modelName} returned an empty response.`;
  }

  throw new Error(lastError);
}

export function getUserMetadata(dbUser: DbUser | null) {
  return ((dbUser?.user_info as Record<string, unknown> | null)?.user_metadata ||
    {}) as Record<string, string | undefined>;
}

function getDisplayName(authUser: User, dbUser: DbUser | null) {
  return (
    dbUser?.supervisee_name ||
    dbUser?.supervisor_name ||
    (authUser.user_metadata?.name as string | undefined) ||
    authUser.email?.split("@")[0] ||
    "Devotee"
  );
}

async function fetchPersonalityDetails(personalityId: string): Promise<PersonalityDetails> {
  const client = requireSupabase();
  const { data, error } = await client
    .from("personalities")
    .select(
      "personality_id,title,subtitle,short_description,provider,creator_id,key,character_prompt,voice_prompt,oai_voice,first_message_prompt"
    )
    .eq("personality_id", personalityId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Guide not found.");
  }

  return data as PersonalityDetails;
}

function buildGuideSystemInstruction(
  authUser: User,
  dbUser: DbUser | null,
  personality: PersonalityDetails,
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

function getGuideOpeningLine(personality: PersonalityDetails) {
  return (
    personality.first_message_prompt?.trim() ||
    `Namaste. I am ${personality.title}. Ask anything about your spiritual path, rituals, or guidance.`
  );
}

export function buildLiveOpeningTurn(
  openingLine: string | null | undefined,
  participantName: string,
  mode: "call" | "puja" = "call"
) {
  const normalizedName = participantName.trim() || "devotee";
  const personalizedLine = (openingLine || "")
    .replace(/\[(name|user)\]/gi, normalizedName)
    .replace(/\{name\}/gi, normalizedName)
    .trim();

  if (personalizedLine) {
    return mode === "puja"
      ? `Begin the live puja now. Greet ${normalizedName} warmly and naturally. Use this opening style: "${personalizedLine}"`
      : `Begin the live call now. Greet ${normalizedName} warmly and naturally. Use this opening style: "${personalizedLine}"`;
  }

  return mode === "puja"
    ? `Begin the live puja now. Offer a short devotional welcome to ${normalizedName} and invite them to ask their question.`
    : `Begin the live call now. Offer a short devotional welcome to ${normalizedName} and invite them to speak.`;
}

async function ensureDbUser(authUser: User): Promise<DbUser | null> {
  const client = requireSupabase();

  const { data: existing } = await client
    .from("users")
    .select("*, personality:personality_id(*)")
    .eq("user_id", authUser.id)
    .maybeSingle();

  if (existing) {
    return existing as DbUser;
  }

  const identifier =
    authUser.email ?? (authUser.phone ? `${authUser.phone}@phone.com` : `${authUser.id}@smartmurti.com`);

  const insertPayload = {
    user_id: authUser.id,
    email: identifier,
    supervisor_name: (authUser.user_metadata?.name as string) || authUser.email?.split("@")[0] || "Devotee",
    supervisee_name: "",
    supervisee_persona: "",
    supervisee_age: 0,
    personality_id: DEFAULT_PERSONALITY_ID,
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
  };

  const { error } = await client.from("users").insert(insertPayload);

  if (error) {
    console.warn("Could not auto-create mobile user profile", error.message);
    return null;
  }

  const { data: created } = await client
    .from("users")
    .select("*, personality:personality_id(*)")
    .eq("user_id", authUser.id)
    .maybeSingle();

  return (created as DbUser | null) ?? null;
}

function getDateLabel(date: "Yesterday" | "Today" | "Tomorrow") {
  const target = new Date();
  if (date === "Yesterday") target.setDate(target.getDate() - 1);
  if (date === "Tomorrow") target.setDate(target.getDate() + 1);
  return target.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function numericSeed(input: string) {
  return Array.from(input).reduce((sum, char, index) => sum + char.charCodeAt(0) * (index + 1), 0);
}

function fallbackHoroscope(sign: string, date: "Yesterday" | "Today" | "Tomorrow"): HoroscopePayload {
  const seed = numericSeed(`${sign}-${date}`);
  const luckyNumber = ((seed % 9) + 1).toString();
  const luckyColors = ["Gold", "Saffron", "Coral", "Sky Blue", "Emerald", "Rose"];
  const luckyTimes = ["6:15 AM", "8:40 AM", "11:11 AM", "2:20 PM", "5:45 PM", "7:30 PM"];
  const luckyColor = luckyColors[seed % luckyColors.length];
  const luckyTime = luckyTimes[seed % luckyTimes.length];

  return {
    date: getDateLabel(date),
    sign,
    mood: "✨",
    content: `${sign} energy is steady today. Trust your intuition, stay disciplined, and focus on meaningful action over noise.`,
    lucky_number: luckyNumber,
    lucky_color: luckyColor,
    lucky_time: luckyTime,
    love: { text: "Open, honest communication improves emotional harmony today.", percentage: 62 + (seed % 20) },
    career: { text: "A calm, methodical approach gives better results than rushing.", percentage: 58 + (seed % 25) },
    money: { text: "Spend carefully and prioritize practical financial choices.", percentage: 55 + (seed % 20) },
    health: { text: "Protect your energy and avoid overstimulation where possible.", percentage: 70 + (seed % 15) },
    travel: { text: "Short and purposeful travel is favored more than spontaneous plans.", percentage: 42 + (seed % 20) },
  };
}

export async function fetchCurrentUserBundle() {
  const client = requireSupabase();
  const {
    data: { user },
  } = await client.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const payload = await fetchSiteJson<{ dbUser: DbUser | null }>("/api/mobile/bootstrap");

  return {
    authUser: user,
    dbUser: payload.dbUser,
  };
}

export async function fetchMobileBootstrap() {
  const payload = await fetchSiteJson<{ dbUser: DbUser | null; personalities: Personality[] }>(
    "/api/mobile/bootstrap"
  );

  return payload;
}

export async function fetchFaithPersonalities() {
  const payload = await fetchMobileBootstrap();
  return sortGuideCatalog(payload.personalities ?? []);
}

export async function updateCurrentUserProfile(values: {
  supervisee_name: string;
  supervisee_age: number;
  supervisee_persona?: string;
  birth_place?: string;
  birth_date?: string;
  birth_time?: string;
  rashi?: string;
  language_code?: string;
}) {
  await fetchSiteJson("/api/mobile/profile", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return fetchCurrentUserBundle();
}

export async function updateCurrentUserLanguage(languageCode: string) {
  await fetchSiteJson("/api/mobile/profile", {
    method: "POST",
    body: JSON.stringify({ language_code: languageCode }),
  });

  return fetchCurrentUserBundle();
}

export async function uploadCurrentUserAvatar(uri: string, mimeType?: string | null) {
  const extension = inferFileExtension(uri, mimeType);
  const resolvedMimeType = mimeType || `image/${extension}`;
  const formData = new FormData();
  formData.append("file", {
    uri,
    name: `avatar.${extension}`,
    type: resolvedMimeType,
  } as any);

  const payload = await fetchSiteJson<{ avatarUrl: string }>("/api/mobile/avatar", {
    method: "POST",
    body: formData,
  });

  return payload.avatarUrl;
}

export async function fetchHoroscope(sign: string, date: "Yesterday" | "Today" | "Tomorrow") {
  try {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Calcutta";
    return await fetchSiteJson<HoroscopePayload>(
      `/api/horoscope/daily?sign=${encodeURIComponent(sign)}&date=${encodeURIComponent(
        date
      )}&timezone=${encodeURIComponent(timezone)}`
    );
  } catch (error) {
    console.warn("Horoscope fallback used", error);
    return fallbackHoroscope(sign, date);
  }
}

export async function rechargeWallet(amount: number) {
  return await fetchSiteJson<{ success: boolean; newBalance: number }>(
    "/api/mobile/wallet/recharge",
    {
      method: "POST",
      body: JSON.stringify({ amount }),
    }
  );
}

export async function sendGuideMessage(message: string, messages: ChatMessage[], personalityId: string) {
  const history =
    messages[messages.length - 1]?.role === "user" &&
    messages[messages.length - 1]?.content.trim() === message.trim()
      ? messages.slice(0, -1)
      : messages;

  return await fetchSiteJson<{ response: string }>("/api/chat", {
    method: "POST",
    body: JSON.stringify({
      message,
      messages: history.slice(-12),
      personalityId,
    }),
  });
}

export async function getGuideSessionConfig(
  personalityId: string,
  languageCodeOverride?: string | null
) {
  const sessionConfig = await fetchSiteJson<{
    provider: string;
    system_prompt: string;
    voice?: string | null;
    live_voice?: string | null;
    opening_line?: string | null;
    live_model?: string | null;
  }>(
    `/api/session?personalityId=${encodeURIComponent(personalityId)}${
      languageCodeOverride ? `&languageCode=${encodeURIComponent(languageCodeOverride)}` : ""
    }`
  );

  const personality = await fetchPersonalityDetails(personalityId);
  let geminiApiKey: string | undefined;
  if (sessionConfig.provider === "gemini") {
    const keyPayload = await fetchSiteJson<{ gemini_api_key: string }>("/api/voice/get-gemini-key", {
      method: "POST",
      body: JSON.stringify({ source: "mobile-app" }),
    });
    geminiApiKey = keyPayload.gemini_api_key;
  }

  return {
    personality,
    voiceName: sessionConfig.live_voice || resolveGeminiLiveVoice(personality),
    provider: sessionConfig.provider?.trim() || personality.provider?.trim() || "gemini",
    openingLine: sessionConfig.opening_line || getGuideOpeningLine(personality),
    systemInstruction: sessionConfig.system_prompt,
    liveModel: sessionConfig.live_model,
    geminiApiKey,
  };
}

export function getRemoteAsset(path: string) {
  return `${SITE_ORIGIN}${path}`;
}

export function buildLivePujaInviteLink(roomId: string) {
  return `${SITE_ORIGIN}/pandit?room=${encodeURIComponent(roomId)}`;
}

export async function fetchLiveKitRoomToken(roomId: string, participantName: string) {
  const response = await fetch(
    `${SITE_ORIGIN}/api/livekit-token?room=${encodeURIComponent(roomId)}&name=${encodeURIComponent(
      participantName
    )}`
  );
  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.token) {
    throw new Error(
      payload?.error ||
        payload?.message ||
        "Unable to open the live room right now."
    );
  }

  return {
    token: String(payload.token),
    serverUrl: LIVEKIT_SERVER_URL,
  };
}

export function getGuideDisplaySubtitle(personality: Personality) {
  const primary = !isGuideImageValue(personality.short_description) ? personality.short_description?.trim() : "";
  if (primary) {
    return primary;
  }

  const secondary = !isGuideImageValue(personality.subtitle) ? personality.subtitle?.trim() : "";
  if (secondary) {
    return secondary;
  }

  return "";
}

export function getGuideShortTitle(personality: Personality | string) {
  const title = typeof personality === "string" ? personality : personality.title;
  const matchedTitle = findWebsiteHomeGuideMatch(title);

  if (matchedTitle === "pandit ji") {
    return "Pandit Ji";
  }

  if (matchedTitle === "the horoscope astrologer") {
    return "Astrologer";
  }

  return title;
}

export function canGuideUseVideo(personality: Personality | string) {
  if (
    typeof personality !== "string" &&
    [HOME_PANDIT_PERSONALITY_ID, LIVE_PUJA_PANDIT_PERSONALITY_ID, HOME_ASTROLOGER_PERSONALITY_ID].includes(
      personality.personality_id
    )
  ) {
    return true;
  }

  const matchedTitle = findWebsiteHomeGuideMatch(
    typeof personality === "string" ? personality : personality.title
  );
  return matchedTitle ? VIDEO_ENABLED_GUIDE_TITLES.has(matchedTitle) : false;
}

export function isHomeGuide(personality: Personality) {
  return !personality.creator_id && Boolean(findWebsiteHomeGuideMatch(personality.title));
}

export function filterHomeGuides(personalities: Personality[]) {
  const bySlot = personalities
    .filter((guide) => !guide.creator_id)
    .filter((guide) => !HIDDEN_PERSONALITIES.has(guide.title))
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
      }

      return catalog;
    }, new Map<string, Personality>());

  return WEBSITE_HOME_GUIDE_ORDER.map((slot) => bySlot.get(slot)).filter(Boolean) as Personality[];
}

export function getGuideImageAsset(
  guideOrTitle: Personality | string,
  subtitle?: string | null,
  shortDescription?: string | null
) {
  const title = typeof guideOrTitle === "string" ? guideOrTitle : guideOrTitle.title;
  const imageOverride =
    typeof guideOrTitle === "string"
      ? [subtitle, shortDescription].map(resolveGuideImageValue).find(Boolean)
      : [guideOrTitle.subtitle, guideOrTitle.short_description].map(resolveGuideImageValue).find(Boolean);

  if (imageOverride) {
    return imageOverride.trim();
  }

  const lowerTitle = title.toLowerCase();

  if (lowerTitle.includes("astrolog")) {
    return getRemoteAsset("/assets/Cartoon Astrologer.jpg");
  }

  if (lowerTitle.includes("palm")) {
    return getRemoteAsset("/assets/Cartoon Palm Reader.jpg");
  }

  if (lowerTitle.includes("face")) {
    return getRemoteAsset("/assets/Cartoon Face Reader.jpg");
  }

  return getRemoteAsset("/assets/Pandit Performing Aarti.jpg");
}

export async function getCurrentSessionToken() {
  const session = await getSession();
  return session?.access_token ?? null;
}
