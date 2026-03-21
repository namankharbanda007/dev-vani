import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { ChatMessage, DbUser, HoroscopePayload, Personality } from "../models/types";

const DEFAULT_PERSONALITY_ID = "a1c073e6-653d-40cf-acc1-891331689409";
const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash-latest"];
const SITE_ORIGIN = "https://www.smartmurti.com";
const IMAGE_URL_PATTERN = /^https?:\/\/\S+/i;

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
  personality: PersonalityDetails
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
- Preferred language: ${dbUser?.language_code || "en-IN"}

Rules:
- Never mention demo limits, trial time, guest mode, or test mode.
- Stay fully in character as the selected guide from Supabase.
- Give devotional, astrological, or ritual guidance in the tone of this guide.
- Use Hindi, English, or Hinglish depending on the user's tone.
- Keep chat replies to 1-4 short spoken-friendly sentences unless the user explicitly asks for depth.
`.trim();
}

function getGuideOpeningLine(personality: PersonalityDetails) {
  return (
    personality.first_message_prompt?.trim() ||
    `Namaste. I am ${personality.title}. Ask anything about your spiritual path, rituals, or guidance.`
  );
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

  const dbUser = await ensureDbUser(user);

  return {
    authUser: user,
    dbUser,
  };
}

export async function fetchFaithPersonalities() {
  const client = requireSupabase();
  const authUser = await getAuthUser();

  const { data: premadeData, error: premadeError } = await client
    .from("personalities")
    .select(
      "personality_id,title,subtitle,short_description,provider,creator_id,key,oai_voice,character_prompt,voice_prompt,first_message_prompt"
    )
    .is("creator_id", null)
    .order("created_at", { ascending: false });

  if (premadeError) {
    throw new Error(premadeError.message);
  }

  let customData: Personality[] = [];
  if (authUser?.id) {
    const { data, error } = await client
      .from("personalities")
      .select(
        "personality_id,title,subtitle,short_description,provider,creator_id,key,oai_voice,character_prompt,voice_prompt,first_message_prompt"
      )
      .eq("creator_id", authUser.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Could not load custom guides", error.message);
    } else {
      customData = (data as Personality[]) ?? [];
    }
  }

  const mergedCatalog = [...customData, ...((premadeData as Personality[]) ?? []).filter(
    (item) => !HIDDEN_PERSONALITIES.has(item.title)
  )];

  const deduped = mergedCatalog.filter(
    (guide, index, list) =>
      list.findIndex((candidate) => candidate.personality_id === guide.personality_id) === index
  );

  return sortGuideCatalog(deduped);
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
  const client = requireSupabase();
  const authUser = await getAuthUser();

  if (!authUser) {
    throw new Error("Unauthorized");
  }

  const existing = await ensureDbUser(authUser);
  const existingMetadata = getUserMetadata(existing);

  const nextMetadata = {
    ...existingMetadata,
    birth_place: values.birth_place || "",
    birth_date: values.birth_date || "",
    birth_time: values.birth_time || "",
    rashi: values.rashi || "",
  };

  const { error } = await client
    .from("users")
    .update({
      supervisee_name: values.supervisee_name.trim(),
      supervisee_age: values.supervisee_age,
      supervisee_persona: values.supervisee_persona?.trim() || "",
      language_code: values.language_code || existing?.language_code || "en-US",
      user_info: {
        user_type: "user",
        user_metadata: nextMetadata,
      },
    })
    .eq("user_id", authUser.id);

  if (error) {
    throw new Error(error.message);
  }

  return fetchCurrentUserBundle();
}

export async function fetchHoroscope(sign: string, date: "Yesterday" | "Today" | "Tomorrow") {
  try {
    const authUser = await getAuthUser();
    if (!authUser) {
      throw new Error("Unauthorized");
    }

    const dbUser = await ensureDbUser(authUser);
    const metadata = getUserMetadata(dbUser);
    const prompt = `
You are an expert Vedic astrologer for Smart Murti.
Generate a daily horoscope for ${sign} for ${date} (${getDateLabel(date)}).

User context:
- Name: ${getDisplayName(authUser, dbUser)}
- Birth date: ${metadata.birth_date || "Unknown"}
- Birth time: ${metadata.birth_time || "Unknown"}
- Birth place: ${metadata.birth_place || "Unknown"}
- Rashi: ${metadata.rashi || "Unknown"}

Return valid JSON with this exact structure:
{
  "mood": "single emoji",
  "content": "2-3 sentence horoscope",
  "lucky_number": "string",
  "lucky_color": "string",
  "lucky_time": "string",
  "love": { "text": "string", "percentage": 0 },
  "career": { "text": "string", "percentage": 0 },
  "money": { "text": "string", "percentage": 0 },
  "health": { "text": "string", "percentage": 0 },
  "travel": { "text": "string", "percentage": 0 }
}
Keep it warm, specific, and practical.
`;

    const raw = await geminiGenerate({
      systemInstruction: "You create clean, accurate horoscope JSON for Smart Murti users.",
      message: prompt,
      responseMimeType: "application/json",
    });

    const parsed = JSON.parse(raw) as Omit<HoroscopePayload, "date" | "sign">;

    return {
      date: getDateLabel(date),
      sign,
      ...parsed,
    } as HoroscopePayload;
  } catch (error) {
    console.warn("Horoscope fallback used", error);
    return fallbackHoroscope(sign, date);
  }
}

export async function rechargeWallet(amount: number) {
  const client = requireSupabase();
  const authUser = await getAuthUser();

  if (!authUser) {
    throw new Error("Unauthorized");
  }

  await ensureDbUser(authUser);

  const { data: existing, error: fetchError } = await client
    .from("users")
    .select("wallet_balance")
    .eq("user_id", authUser.id)
    .single();

  if (fetchError || !existing) {
    throw new Error(fetchError?.message || "Unable to load wallet balance.");
  }

  const newBalance = Number(existing.wallet_balance ?? 0) + amount;

  const { error: updateError } = await client
    .from("users")
    .update({ wallet_balance: newBalance })
    .eq("user_id", authUser.id);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const { error: transactionError } = await client.from("wallet_transactions").insert({
    user_id: authUser.id,
    type: "credit",
    amount,
    service_name: "Wallet Recharge",
    status: "completed",
  });

  if (transactionError) {
    console.warn("Wallet transaction log insert failed", transactionError.message);
  }

  return { success: true, newBalance };
}

export async function sendGuideMessage(message: string, messages: ChatMessage[], personalityId: string) {
  const authUser = await getAuthUser();
  if (!authUser) {
    throw new Error("Unauthorized");
  }

  const dbUser = await ensureDbUser(authUser);
  const personality = await fetchPersonalityDetails(personalityId);
  const history =
    messages[messages.length - 1]?.role === "user" &&
    messages[messages.length - 1]?.content.trim() === message.trim()
      ? messages.slice(0, -1)
      : messages;

  const systemInstruction = buildGuideSystemInstruction(authUser, dbUser, personality);

  const response = await geminiGenerate({
    systemInstruction,
    history,
    message,
  });

  return { response };
}

export async function getGuideSessionConfig(personalityId: string) {
  const authUser = await getAuthUser();
  if (!authUser) {
    throw new Error("Unauthorized");
  }

  const dbUser = await ensureDbUser(authUser);
  const personality = await fetchPersonalityDetails(personalityId);

  return {
    dbUser,
    personality,
    voiceName: personality.oai_voice?.trim() || "Fenrir",
    openingLine: getGuideOpeningLine(personality),
    systemInstruction: buildGuideSystemInstruction(authUser, dbUser, personality),
  };
}

export function getRemoteAsset(path: string) {
  return `${SITE_ORIGIN}${path}`;
}

export function getGuideDisplaySubtitle(personality: Personality) {
  const primary = !isLikelyImageUrl(personality.short_description) ? personality.short_description?.trim() : "";
  if (primary) {
    return primary;
  }

  const secondary = !isLikelyImageUrl(personality.subtitle) ? personality.subtitle?.trim() : "";
  if (secondary) {
    return secondary;
  }

  return "";
}

export function getGuideImageAsset(
  guideOrTitle: Personality | string,
  subtitle?: string | null,
  shortDescription?: string | null
) {
  const title = typeof guideOrTitle === "string" ? guideOrTitle : guideOrTitle.title;
  const imageOverride =
    typeof guideOrTitle === "string"
      ? [subtitle, shortDescription].find((value) => isLikelyImageUrl(value))
      : [guideOrTitle.subtitle, guideOrTitle.short_description].find((value) => isLikelyImageUrl(value));

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
