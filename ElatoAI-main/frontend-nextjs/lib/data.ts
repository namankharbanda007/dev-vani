export const defaultToyId: string = "56224f7f-250d-4351-84ee-e4a13b881c7b";
export const defaultPersonalityId: string =
    "a1c073e6-653d-40cf-acc1-891331689409";

export const paymentLink = "https://buy.stripe.com/bIY0033Dc7LB28o9AJ";
export const devkitPaymentLink = "https://buy.stripe.com/fZefZ12z82rh3cseV5";

export const discordInviteLink = "https://discord.gg/KJWxDPBRUj";
export const tiktokLink = "https://www.tiktok.com/@elatoai";
export const githubPublicLink = "https://github.com/akdeb/ElatoAI";
export const businessDemoLink = "https://vimeo.com/1141098837";
export const feedbackFormLink = "https://forms.gle/2QmukEG2FXNwBdee7";
export const kickstarterLink = "https://www.kickstarter.com/projects/elatoai/elato-make-toys-talk-with-ai-voices";

export const r2Url = "https://pub-cd736d767add4fecafea55c239c28497.r2.dev";
export const r2UrlAudio = "https://pub-5fab8e2596c544cd8dc3e20812be2168.r2.dev";

export const videoSrc = `${r2Url}/IMG_1673.mov`;
export const videoSrc2 = `${r2Url}/IMG_1675.mov`;
export const videoSrc3 = `${r2Url}/IMG_1676.mov`;
export const videoSrc4 = `${r2Url}/IMG_1677.mov`;

export const voiceSampleUrl =
    "https://xygbupeczfhwamhqnucy.supabase.co/storage/v1/object/public/voices/";

export const userFormPersonaLabel =
    "Briefly describe yourself and your interests, personality, and learning style";
export const userFormPersonaPlaceholder =
    "Don't get me started on the guitar...I love to shred it like Hendrix. I also like a good challenge. Challenge me to be better and I'll rise to the occasion.";
export const userFormAgeLabel = "Your Age";
export const userFormAgeDescription =
    "Users under 13 years old must have a parent or guardian to setup Elato.";
export const userFormNameLabel = "Your Name";

export const INITIAL_CREDITS = 50;
export const SECONDS_PER_CREDIT = (30 * 60) / INITIAL_CREDITS; // 30 minutes equals 50 credits

export const DEVICE_COST = 55;
export const ORIGINAL_COST = 111;
export const SUBSCRIPTION_COST = 10;

export const openaiVoices: VoiceType[] = [
    {
        id: "alloy",
        name: "Alloy",
        description: "Neutral and balanced",
        color: "bg-gradient-to-br from-gray-300 via-gray-100 to-gray-400",
        provider: "openai",
    },
    {
        id: "echo",
        name: "Echo",
        description: "Warm and melodic",
        color: "bg-gradient-to-br from-blue-300 via-blue-100 to-blue-400",
        provider: "openai",
    },
    {
        id: "shimmer",
        name: "Shimmer",
        description: "Clear and bright",
        color: "bg-gradient-to-br from-rose-100 via-white to-sky-100",
        provider: "openai",
    },
    {
        id: "ash",
        name: "Ash",
        description: "Soft and thoughtful",
        color: "bg-gradient-to-br from-stone-400 via-stone-200 to-stone-500",
        provider: "openai",
    },
    {
        id: "ballad",
        name: "Ballad",
        description: "Melodic and emotive",
        color: "bg-gradient-to-br from-teal-400 via-teal-200 to-teal-600",
        provider: "openai",
    },
    {
        id: "coral",
        name: "Coral",
        description: "Warm and friendly",
        color: "bg-gradient-to-br from-rose-300 via-rose-100 to-rose-400",
        provider: "openai",
    },
    {
        id: "sage",
        name: "Sage",
        description: "Wise and measured",
        color: "bg-gradient-to-br from-emerald-300 via-emerald-100 to-emerald-400",
        provider: "openai",
    },
    {
        id: "verse",
        name: "Verse",
        description: "Poetic and expressive",
        color: "bg-gradient-to-br from-purple-400 via-purple-200 to-purple-600",
        provider: "openai",
    },
];

export const geminiVoices: VoiceType[] = [
    {
        id: "priya",
        name: "priya",
        description: "Bright",
        color: "bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-500",
        provider: "gemini",
    },
    {
        id: "Bunty",
        name: "Bunty",
        description: "Upbeat",
        color: "bg-gradient-to-br from-orange-300 via-orange-100 to-orange-500",
        provider: "gemini",
    },
    {
        id: "Tau ji",
        name: "Tau ji",
        description: "Informative",
        color: "bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500",
        provider: "gemini",
    },
    {
        id: "daddi maa",
        name: "daddi maa",
        description: "Firm",
        color: "bg-gradient-to-br from-zinc-400 via-zinc-200 to-zinc-500",
        provider: "gemini",
    },
    {
        id: "shera",
        name: "shera",
        description: "Excitable",
        color: "bg-gradient-to-br from-red-400 via-red-200 to-red-600",
        provider: "gemini",
    },
    {
        id: "anjali",
        name: "anjali",
        description: "Youthful",
        color: "bg-gradient-to-br from-pink-300 via-pink-100 to-pink-400",
        provider: "gemini",
    },
    {
        id: "viram",
        name: "viram",
        description: "Firm",
        color: "bg-gradient-to-br from-gray-500 via-gray-300 to-gray-600",
        provider: "gemini",
    },
    {
        id: "Priyanka",
        name: "Priyanka",
        description: "Breezy",
        color: "bg-gradient-to-br from-sky-300 via-sky-100 to-sky-400",
        provider: "gemini",
    },
    {
        id: "simran",
        name: "simran",
        description: "Easy-going",
        color: "bg-gradient-to-br from-green-300 via-green-100 to-green-400",
        provider: "gemini",
    },
    {
        id: "Mrs. Kulkarni (The Strict Teacher)",
        name: "Mrs. Kulkarni (The Strict Teacher)",
        description: "Bright",
        color: "bg-gradient-to-br from-amber-300 via-amber-100 to-amber-500",
        provider: "gemini",
    },
    {
        id: "rocky",
        name: "rocky",
        description: "Breathy",
        color: "bg-gradient-to-br from-cyan-300 via-cyan-100 to-cyan-500",
        provider: "gemini",
    },
    {
        id: "dj lucky",
        name: "dj lucky",
        description: "Clear",
        color: "bg-gradient-to-br from-gray-100 via-white to-gray-200",
        provider: "gemini",
    },
    {
        id: "baba anteryami",
        name: "baba anteryami",
        description: "Easy-going",
        color: "bg-gradient-to-br from-emerald-300 via-emerald-100 to-emerald-400",
        provider: "gemini",
    },
    {
        id: "Advocate Mehta",
        name: "Advocate Mehta",
        description: "Smooth",
        color: "bg-gradient-to-br from-violet-300 via-violet-100 to-violet-400",
        provider: "gemini",
    },
    {
        id: "chutki the cute kid",
        name: "chutki the cute kid",
        description: "Smooth",
        color: "bg-gradient-to-br from-purple-300 via-purple-100 to-purple-400",
        provider: "gemini",
    },
    {
        id: "Sweta -The News Reporter",
        name: "Sweta -The News Reporter",
        description: "Clear",
        color: "bg-gradient-to-br from-neutral-300 via-neutral-100 to-neutral-400",
        provider: "gemini",
    },
    {
        id: "prakash",
        name: "prakash",
        description: "Gravelly",
        color: "bg-gradient-to-br from-stone-400 via-stone-200 to-stone-500",
        provider: "gemini",
    },
    {
        id: "Dada ji",
        name: "Dada ji",
        description: "Informative",
        color: "bg-gradient-to-br from-indigo-300 via-indigo-100 to-indigo-400",
        provider: "gemini",
    },
    {
        id: "Bhabhi ji",
        name: "Bhabhi ji",
        description: "Upbeat",
        color: "bg-gradient-to-br from-lime-300 via-lime-100 to-lime-400",
        provider: "gemini",
    },
    {
        id: "kaal",
        name: "kaal",
        description: "Soft",
        color: "bg-gradient-to-br from-rose-300 via-rose-100 to-rose-400",
        provider: "gemini",
    },
    {
        id: "Robot chacha",
        name: "Robot chacha",
        description: "Firm",
        color: "bg-gradient-to-br from-zinc-400 via-zinc-200 to-zinc-500",
        provider: "gemini",
    },
    {
        id: "Robotic inspector",
        name: "Robotic inspector",
        description: "Even",
        color: "bg-gradient-to-br from-teal-400 via-teal-200 to-teal-500",
        provider: "gemini",
    },
    {
        id: "mr.patel",
        name: "mr.patel",
        description: "Even",
        color: "bg-gradient-to-br from-teal-400 via-teal-200 to-teal-500",
        provider: "gemini",
    },
    {
        id: "Chandramukhi",
        name: "Chandramukhi",
        description: "Mature",
        color: "bg-gradient-to-br from-orange-400 via-orange-200 to-amber-500",
        provider: "gemini",
    },
    {
        id: "shanaya-fashion artist",
        name: "shanaya-fashion artist",
        description: "Forward",
        color: "bg-gradient-to-br from-fuchsia-300 via-fuchsia-100 to-fuchsia-400",
        provider: "gemini",
    },
    {
        id: "aarav",
        name: "aarav",
        description: "Friendly",
        color: "bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-500",
        provider: "gemini",
    },
    {
        id: "jugaad laal- salesman",
        name: "jugaad laal- salesman",
        description: "Casual",
        color: "bg-gradient-to-br from-orange-300 via-orange-100 to-orange-500",
        provider: "gemini",
    },
    {
        id: "Warden Madam (The Hostel Warden)",
        name: "Warden Madam (The Hostel Warden)",
        description: "Gentle",
        color: "bg-gradient-to-br from-green-300 via-green-100 to-green-400",
        provider: "gemini",
    },
    {
        id: "Rooh (The Mystery)",
        name: "Rooh (The Mystery)",
        description: "Lively",
        color: "bg-gradient-to-br from-red-300 via-red-100 to-red-400",
        provider: "gemini",
    },
    {
        id: "Guddu comedian comentater",
        name: "Guddu comedian comentater",
        description: "Knowledgeable",
        color: "bg-gradient-to-br from-blue-300 via-blue-100 to-blue-400",
        provider: "gemini",
    },
    {
        id: "sustram",
        name: "sustram",
        description: "Warm",
        color: "bg-gradient-to-br from-orange-300 via-orange-100 to-orange-400",
        provider: "gemini",
    },
];

export const emotionOptions = [
    { value: "neutral", label: "Neutral", icon: "😐", color: "bg-red-100" },
    {
        value: "cheerful",
        label: "Cheerful",
        icon: "😊",
        color: "bg-yellow-100",
    },
    { value: "serious", label: "Serious", icon: "🧐", color: "bg-blue-100" },
    { value: "calm", label: "Calm", icon: "😌", color: "bg-teal-100" },
    { value: "excited", label: "Excited", icon: "😃", color: "bg-orange-100" },
    {
        value: "professional",
        label: "Professional",
        icon: "👔",
        color: "bg-green-100",
    },
];
