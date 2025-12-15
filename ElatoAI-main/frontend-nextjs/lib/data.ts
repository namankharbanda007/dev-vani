export const defaultToyId: string = "56224f7f-250d-4351-84ee-e4a13b881c7b";
export const defaultPersonalityId: string =
    "a1c073e6-653d-40cf-acc1-891331689409";

export const paymentLink = "https://buy.stripe.com/bIY0033Dc7LB28o9AJ";
export const devkitPaymentLink = "https://buy.stripe.com/fZefZ12z82rh3cseV5";

export const discordInviteLink = "https://discord.gg/KJWxDPBRUj";
export const tiktokLink = "https://www.tiktok.com/@Smartmurtiai";
export const githubPublicLink = "https://github.com/akdeb/SmartmurtiAI";
export const businessDemoLink = "https://vimeo.com/1141098837";
export const feedbackFormLink = "https://forms.gle/2QmukEG2FXNwBdee7";
export const kickstarterLink = "https://www.kickstarter.com/projects/Smartmurtiai/Smartmurti-make-toys-talk-with-ai-voices";

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
    "Users under 13 years old must have a parent or guardian to setup Smartmurti.";
export const userFormNameLabel = "Your Name";

export const SUBSCRIPTION_COST = 10;

export const openaiVoices: VoiceType[] = [
    {
        id: "alloy",
        name: "Alloy",
        description: "Neutral and balanced",
        color: "radial-gradient(circle at 50% 0%, #e2e8f0 0%, #94a3b8 50%, #475569 100%)", // Silver
        provider: "openai",
    },
    {
        id: "echo",
        name: "Echo",
        description: "Warm and melodic",
        color: "radial-gradient(circle at 50% 0%, #bae6fd 0%, #38bdf8 50%, #0369a1 100%)", // Blue Steel
        provider: "openai",
    },
    {
        id: "shimmer",
        name: "Shimmer",
        description: "Clear and bright",
        color: "radial-gradient(circle at 50% 0%, #fafafa 0%, #e2e8f0 50%, #94a3b8 100%)", // Pearl
        provider: "openai",
    },
    {
        id: "ash",
        name: "Ash",
        description: "Soft and thoughtful",
        color: "radial-gradient(circle at 50% 0%, #d6d3d1 0%, #a8a29e 50%, #57534e 100%)", // Ash Gray
        provider: "openai",
    },
    {
        id: "ballad",
        name: "Ballad",
        description: "Melodic and emotive",
        color: "radial-gradient(circle at 50% 0%, #5eead4 0%, #14b8a6 50%, #0f766e 100%)", // Teal
        provider: "openai",
    },
    {
        id: "coral",
        name: "Coral",
        description: "Warm and friendly",
        color: "radial-gradient(circle at 50% 0%, #fca5a5 0%, #f43f5e 50%, #be123c 100%)", // Coral Red
        provider: "openai",
    },
    {
        id: "sage",
        name: "Sage",
        description: "Wise and measured",
        color: "radial-gradient(circle at 50% 0%, #86efac 0%, #22c55e 50%, #15803d 100%)", // Sage Green
        provider: "openai",
    },
    {
        id: "verse",
        name: "Verse",
        description: "Poetic and expressive",
        color: "radial-gradient(circle at 50% 0%, #d8b4fe 0%, #a855f7 50%, #7e22ce 100%)", // Purple
        provider: "openai",
    },
];

export const geminiVoices: VoiceType[] = [
    {
        id: "priya",
        name: "priya",
        description: "Bright",
        color: "radial-gradient(circle at 50% 0%, #fef08a 0%, #eab308 50%, #854d0e 100%)", // Yellow/Gold
        provider: "gemini",
    },
    {
        id: "Bunty",
        name: "Bunty",
        description: "Upbeat",
        color: "radial-gradient(circle at 50% 0%, #fdba74 0%, #f97316 50%, #9a3412 100%)", // Orange
        provider: "gemini",
    },
    {
        id: "Tau ji",
        name: "Tau ji",
        description: "Informative",
        color: "radial-gradient(circle at 50% 0%, #d6d3d1 0%, #78716c 50%, #44403c 100%)", // Bronze
        provider: "gemini",
    },
    {
        id: "daddi maa",
        name: "daddi maa",
        description: "Firm",
        color: "radial-gradient(circle at 50% 0%, #fca5a5 0%, #ef4444 50%, #991b1b 100%)", // Deep Red
        provider: "gemini",
    },
    {
        id: "shera",
        name: "shera",
        description: "Excitable",
        color: "radial-gradient(circle at 50% 0%, #fde047 0%, #eab308 50%, #a16207 100%)", // Rich Gold
        provider: "gemini",
    },
    {
        id: "anjali",
        name: "anjali",
        description: "Youthful",
        color: "radial-gradient(circle at 50% 0%, #f5d0fe 0%, #d946ef 50%, #86198f 100%)", // Magenta
        provider: "gemini",
    },
    {
        id: "viram",
        name: "viram",
        description: "Firm",
        color: "radial-gradient(circle at 50% 0%, #7dd3fc 0%, #2563eb 50%, #1e3a8a 100%)", // Deep Blue
        provider: "gemini",
    },
    {
        id: "Priyanka",
        name: "Priyanka",
        description: "Breezy",
        color: "radial-gradient(circle at 50% 0%, #bae6fd 0%, #38bdf8 50%, #0369a1 100%)", // Sky Blue
        provider: "gemini",
    },
    {
        id: "simran",
        name: "simran",
        description: "Easy-going",
        color: "radial-gradient(circle at 50% 0%, #86efac 0%, #22c55e 50%, #15803d 100%)", // Green
        provider: "gemini",
    },
    {
        id: "Mrs. Kulkarni (The Strict Teacher)",
        name: "Mrs. Kulkarni (The Strict Teacher)",
        description: "Bright",
        color: "radial-gradient(circle at 50% 0%, #fcd34d 0%, #f59e0b 50%, #b45309 100%)", // Amber
        provider: "gemini",
    },
    {
        id: "rocky",
        name: "rocky",
        description: "Breathy",
        color: "radial-gradient(circle at 50% 0%, #67e8f9 0%, #06b6d4 50%, #155e75 100%)", // Cyan
        provider: "gemini",
    },
    {
        id: "dj lucky",
        name: "dj lucky",
        description: "Clear",
        color: "radial-gradient(circle at 50% 0%, #f3f4f6 0%, #9ca3af 50%, #4b5563 100%)", // Gray
        provider: "gemini",
    },
    {
        id: "baba anteryami",
        name: "baba anteryami",
        description: "Easy-going",
        color: "radial-gradient(circle at 50% 0%, #6ee7b7 0%, #10b981 50%, #047857 100%)", // Emerald
        provider: "gemini",
    },
    {
        id: "Advocate Mehta",
        name: "Advocate Mehta",
        description: "Smooth",
        color: "radial-gradient(circle at 50% 0%, #c4b5fd 0%, #8b5cf6 50%, #5b21b6 100%)", // Violet
        provider: "gemini",
    },
    {
        id: "chutki the cute kid",
        name: "chutki the cute kid",
        description: "Smooth",
        color: "radial-gradient(circle at 50% 0%, #d8b4fe 0%, #a855f7 50%, #7e22ce 100%)", // Purple
        provider: "gemini",
    },
    {
        id: "Sweta -The News Reporter",
        name: "Sweta -The News Reporter",
        description: "Clear",
        color: "radial-gradient(circle at 50% 0%, #e5e5e5 0%, #a3a3a3 50%, #525252 100%)", // Neutral
        provider: "gemini",
    },
    {
        id: "prakash",
        name: "prakash",
        description: "Gravelly",
        color: "radial-gradient(circle at 50% 0%, #d6d3d1 0%, #78716c 50%, #44403c 100%)", // Stone
        provider: "gemini",
    },
    {
        id: "Dada ji",
        name: "Dada ji",
        description: "Informative",
        color: "radial-gradient(circle at 50% 0%, #a5b4fc 0%, #6366f1 50%, #312e81 100%)", // Indigo
        provider: "gemini",
    },
    {
        id: "Bhabhi ji",
        name: "Bhabhi ji",
        description: "Upbeat",
        color: "radial-gradient(circle at 50% 0%, #bef264 0%, #84cc16 50%, #3f6212 100%)", // Lime
        provider: "gemini",
    },
    {
        id: "kaal",
        name: "kaal",
        description: "Soft",
        color: "radial-gradient(circle at 50% 0%, #fda4af 0%, #f43f5e 50%, #be123c 100%)", // Rose
        provider: "gemini",
    },
    {
        id: "Robot chacha",
        name: "Robot chacha",
        description: "Firm",
        color: "radial-gradient(circle at 50% 0%, #e4e4e7 0%, #a1a1aa 50%, #52525b 100%)", // Zinc
        provider: "gemini",
    },
    {
        id: "Robotic inspector",
        name: "Robotic inspector",
        description: "Even",
        color: "radial-gradient(circle at 50% 0%, #5eead4 0%, #14b8a6 50%, #0f766e 100%)", // Teal
        provider: "gemini",
    },
    {
        id: "mr.patel",
        name: "mr.patel",
        description: "Even",
        color: "radial-gradient(circle at 50% 0%, #2dd4bf 0%, #0d9488 50%, #115e59 100%)", // Teal
        provider: "gemini",
    },
    {
        id: "Chandramukhi",
        name: "Chandramukhi",
        description: "Mature",
        color: "radial-gradient(circle at 50% 0%, #fdba74 0%, #f97316 50%, #9a3412 100%)", // Orange
        provider: "gemini",
    },
    {
        id: "shanaya-fashion artist",
        name: "shanaya-fashion artist",
        description: "Forward",
        color: "radial-gradient(circle at 50% 0%, #f0abfc 0%, #e879f9 50%, #a21caf 100%)", // Fuchsia
        provider: "gemini",
    },
    {
        id: "aarav",
        name: "aarav",
        description: "Friendly",
        color: "radial-gradient(circle at 50% 0%, #fde047 0%, #eab308 50%, #854d0e 100%)", // Yellow
        provider: "gemini",
    },
    {
        id: "jugaad laal- salesman",
        name: "jugaad laal- salesman",
        description: "Casual",
        color: "radial-gradient(circle at 50% 0%, #fdba74 0%, #f97316 50%, #c2410c 100%)", // Orange
        provider: "gemini",
    },
    {
        id: "Warden Madam (The Hostel Warden)",
        name: "Warden Madam (The Hostel Warden)",
        description: "Gentle",
        color: "radial-gradient(circle at 50% 0%, #86efac 0%, #22c55e 50%, #14532d 100%)", // Green
        provider: "gemini",
    },
    {
        id: "Rooh (The Mystery)",
        name: "Rooh (The Mystery)",
        description: "Lively",
        color: "radial-gradient(circle at 50% 0%, #fca5a5 0%, #f87171 50%, #991b1b 100%)", // Red
        provider: "gemini",
    },
    {
        id: "Guddu comedian comentater",
        name: "Guddu comedian comentater",
        description: "Knowledgeable",
        color: "radial-gradient(circle at 50% 0%, #93c5fd 0%, #3b82f6 50%, #1e3a8a 100%)", // Blue
        provider: "gemini",
    },
    {
        id: "sustram",
        name: "sustram",
        description: "Warm",
        color: "radial-gradient(circle at 50% 0%, #fdba74 0%, #f97316 50%, #9a3412 100%)", // Orange
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
