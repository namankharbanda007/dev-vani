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
        color: "bg-blue-100",
        provider: "openai",
    },
    {
        id: "echo",
        name: "Echo",
        description: "Warm and melodic",
        color: "bg-purple-100",
        provider: "openai",
    },
    {
        id: "shimmer",
        name: "Shimmer",
        description: "Clear and bright",
        color: "bg-cyan-100",
        provider: "openai",
    },
    {
        id: "ash",
        name: "Ash",
        description: "Soft and thoughtful",
        color: "bg-gray-100",
        provider: "openai",
    },
    {
        id: "ballad",
        name: "Ballad",
        description: "Melodic and emotive",
        color: "bg-indigo-100",
        provider: "openai",
    },
    {
        id: "coral",
        name: "Coral",
        description: "Warm and friendly",
        color: "bg-orange-100",
        provider: "openai",
    },
    {
        id: "sage",
        name: "Sage",
        description: "Wise and measured",
        color: "bg-green-100",
        provider: "openai",
    },
    {
        id: "verse",
        name: "Verse",
        description: "Poetic and expressive",
        color: "bg-rose-100",
        provider: "openai",
    },
];

export const geminiVoices: VoiceType[] = [
    {
        id: "priya",
        name: "priya",
        description: "Bright",
        color: "bg-yellow-100",
        provider: "gemini",
    },
    {
        id: "Bunty",
        name: "Bunty",
        description: "Upbeat",
        color: "bg-orange-100",
        provider: "gemini",
    },
    {
        id: "Tau ji",
        name: "Tau ji",
        description: "Informative",
        color: "bg-blue-100",
        provider: "gemini",
    },
    {
        id: "daddi maa",
        name: "daddi maa",
        description: "Firm",
        color: "bg-gray-100",
        provider: "gemini",
    },
    {
        id: "shera",
        name: "shera",
        description: "Excitable",
        color: "bg-red-100",
        provider: "gemini",
    },
    {
        id: "anjali",
        name: "anjali",
        description: "Youthful",
        color: "bg-pink-100",
        provider: "gemini",
    },
    {
        id: "viram",
        name: "viram",
        description: "Firm",
        color: "bg-slate-100",
        provider: "gemini",
    },
    {
        id: "Priyanka",
        name: "Priyanka",
        description: "Breezy",
        color: "bg-sky-100",
        provider: "gemini",
    },
    {
        id: "simran",
        name: "simran",
        description: "Easy-going",
        color: "bg-green-100",
        provider: "gemini",
    },
    {
        id: "Mrs. Kulkarni (The Strict Teacher)",
        name: "Mrs. Kulkarni (The Strict Teacher)",
        description: "Bright",
        color: "bg-amber-100",
        provider: "gemini",
    },
    {
        id: "rocky",
        name: "rocky",
        description: "Breathy",
        color: "bg-cyan-100",
        provider: "gemini",
    },
    {
        id: "dj lucky",
        name: "dj lucky",
        description: "Clear",
        color: "bg-white",
        provider: "gemini",
    },
    {
        id: "baba anteryami",
        name: "baba anteryami",
        description: "Easy-going",
        color: "bg-emerald-100",
        provider: "gemini",
    },
    {
        id: "Advocate Mehta",
        name: "Advocate Mehta",
        description: "Smooth",
        color: "bg-violet-100",
        provider: "gemini",
    },
    {
        id: "chutki the cute kid",
        name: "chutki the cute kid",
        description: "Smooth",
        color: "bg-purple-100",
        provider: "gemini",
    },
    {
        id: "Sweta -The News Reporter",
        name: "Sweta -The News Reporter",
        description: "Clear",
        color: "bg-neutral-100",
        provider: "gemini",
    },
    {
        id: "prakash",
        name: "prakash",
        description: "Gravelly",
        color: "bg-stone-100",
        provider: "gemini",
    },
    {
        id: "Dada ji",
        name: "Dada ji",
        description: "Informative",
        color: "bg-indigo-100",
        provider: "gemini",
    },
    {
        id: "Bhabhi ji",
        name: "Bhabhi ji",
        description: "Upbeat",
        color: "bg-lime-100",
        provider: "gemini",
    },
    {
        id: "kaal",
        name: "kaal",
        description: "Soft",
        color: "bg-rose-100",
        provider: "gemini",
    },
    {
        id: "Robot chacha",
        name: "Robot chacha",
        description: "Firm",
        color: "bg-zinc-100",
        provider: "gemini",
    },
    {
        id: "Robotic inspector",
        name: "Robotic inspector",
        description: "Even",
        color: "bg-teal-100",
        provider: "gemini",
    },
    {
        id: "mr.patel",
        name: "mr.patel",
        description: "Even",
        color: "bg-teal-100",
        provider: "gemini",
    },
    {
        id: "Chandramukhi",
        name: "Chandramukhi",
        description: "Mature",
        color: "bg-brown-100",
        provider: "gemini",
    },
    {
        id: "shanaya-fashion artist",
        name: "shanaya-fashion artist",
        description: "Forward",
        color: "bg-fuchsia-100",
        provider: "gemini",
    },
    {
        id: "aarav",
        name: "aarav",
        description: "Friendly",
        color: "bg-yellow-100",
        provider: "gemini",
    },
    {
        id: "jugaad laal- salesman",
        name: "jugaad laal- salesman",
        description: "Casual",
        color: "bg-orange-100",
        provider: "gemini",
    },
    {
        id: "Warden Madam (The Hostel Warden)",
        name: "Warden Madam (The Hostel Warden)",
        description: "Gentle",
        color: "bg-green-100",
        provider: "gemini",
    },
    {
        id: "Rooh (The Mystery)",
        name: "Rooh (The Mystery)",
        description: "Lively",
        color: "bg-red-100",
        provider: "gemini",
    },
    {
        id: "Guddu comedian comentater",
        name: "Guddu comedian comentater",
        description: "Knowledgeable",
        color: "bg-blue-100",
        provider: "gemini",
    },
    {
        id: "sustram",
        name: "sustram",
        description: "Warm",
        color: "bg-orange-100",
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
