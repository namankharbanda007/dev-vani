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
        color: "bg-[radial-gradient(circle_at_50%_0%,_#e2e8f0_0%,_#94a3b8_50%,_#475569_100%)]", // Silver
        provider: "openai",
    },
    {
        id: "echo",
        name: "Echo",
        description: "Warm and melodic",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#bae6fd_0%,_#38bdf8_50%,_#0369a1_100%)]", // Blue Steel
        provider: "openai",
    },
    {
        id: "shimmer",
        name: "Shimmer",
        description: "Clear and bright",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fafafa_0%,_#e2e8f0_50%,_#94a3b8_100%)]", // Pearl
        provider: "openai",
    },
    {
        id: "ash",
        name: "Ash",
        description: "Soft and thoughtful",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#d6d3d1_0%,_#a8a29e_50%,_#57534e_100%)]", // Ash Gray
        provider: "openai",
    },
    {
        id: "ballad",
        name: "Ballad",
        description: "Melodic and emotive",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#5eead4_0%,_#14b8a6_50%,_#0f766e_100%)]", // Teal
        provider: "openai",
    },
    {
        id: "coral",
        name: "Coral",
        description: "Warm and friendly",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fca5a5_0%,_#f43f5e_50%,_#be123c_100%)]", // Coral Red
        provider: "openai",
    },
    {
        id: "sage",
        name: "Sage",
        description: "Wise and measured",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#86efac_0%,_#22c55e_50%,_#15803d_100%)]", // Sage Green
        provider: "openai",
    },
    {
        id: "verse",
        name: "Verse",
        description: "Poetic and expressive",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#d8b4fe_0%,_#a855f7_50%,_#7e22ce_100%)]", // Purple
        provider: "openai",
    },
];

export const geminiVoices: VoiceType[] = [
    {
        id: "priya",
        name: "priya",
        description: "Bright",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fef08a_0%,_#eab308_50%,_#854d0e_100%)]", // Bright Yellow/Gold
        provider: "gemini",
    },
    {
        id: "Bunty",
        name: "Bunty",
        description: "Upbeat",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fdba74_0%,_#f97316_50%,_#9a3412_100%)]", // Vibrant Orange
        provider: "gemini",
    },
    {
        id: "Tau ji",
        name: "Tau ji",
        description: "Informative",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#d6d3d1_0%,_#78716c_50%,_#44403c_100%)]", // Deep Bronze/Brown
        provider: "gemini",
    },
    {
        id: "daddi maa",
        name: "daddi maa",
        description: "Firm",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fca5a5_0%,_#ef4444_50%,_#991b1b_100%)]", // Deep Red
        provider: "gemini",
    },
    {
        id: "shera",
        name: "shera",
        description: "Excitable",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fde047_0%,_#eab308_50%,_#a16207_100%)]", // Rich Gold
        provider: "gemini",
    },
    {
        id: "anjali",
        name: "anjali",
        description: "Youthful",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#f5d0fe_0%,_#d946ef_50%,_#86198f_100%)]", // Magenta
        provider: "gemini",
    },
    {
        id: "viram",
        name: "viram",
        description: "Firm",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#7dd3fc_0%,_#2563eb_50%,_#1e3a8a_100%)]", // Deep Royal Blue
        provider: "gemini",
    },
    {
        id: "Priyanka",
        name: "Priyanka",
        description: "Breezy",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#bae6fd_0%,_#38bdf8_50%,_#0369a1_100%)]", // Sky Blue
        provider: "gemini",
    },
    {
        id: "simran",
        name: "simran",
        description: "Easy-going",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#86efac_0%,_#22c55e_50%,_#15803d_100%)]", // Green
        provider: "gemini",
    },
    {
        id: "Mrs. Kulkarni (The Strict Teacher)",
        name: "Mrs. Kulkarni (The Strict Teacher)",
        description: "Bright",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fcd34d_0%,_#f59e0b_50%,_#b45309_100%)]", // Amber
        provider: "gemini",
    },
    {
        id: "rocky",
        name: "rocky",
        description: "Breathy",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#67e8f9_0%,_#06b6d4_50%,_#155e75_100%)]", // Cyan
        provider: "gemini",
    },
    {
        id: "dj lucky",
        name: "dj lucky",
        description: "Clear",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#f3f4f6_0%,_#9ca3af_50%,_#4b5563_100%)]", // Gray
        provider: "gemini",
    },
    {
        id: "baba anteryami",
        name: "baba anteryami",
        description: "Easy-going",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#6ee7b7_0%,_#10b981_50%,_#047857_100%)]", // Emerald
        provider: "gemini",
    },
    {
        id: "Advocate Mehta",
        name: "Advocate Mehta",
        description: "Smooth",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#c4b5fd_0%,_#8b5cf6_50%,_#5b21b6_100%)]", // Violet
        provider: "gemini",
    },
    {
        id: "chutki the cute kid",
        name: "chutki the cute kid",
        description: "Smooth",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#d8b4fe_0%,_#a855f7_50%,_#7e22ce_100%)]", // Purple
        provider: "gemini",
    },
    {
        id: "Sweta -The News Reporter",
        name: "Sweta -The News Reporter",
        description: "Clear",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#e5e5e5_0%,_#a3a3a3_50%,_#525252_100%)]", // Neutral
        provider: "gemini",
    },
    {
        id: "prakash",
        name: "prakash",
        description: "Gravelly",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#d6d3d1_0%,_#78716c_50%,_#44403c_100%)]", // Stone
        provider: "gemini",
    },
    {
        id: "Dada ji",
        name: "Dada ji",
        description: "Informative",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#a5b4fc_0%,_#6366f1_50%,_#312e81_100%)]", // Indigo
        provider: "gemini",
    },
    {
        id: "Bhabhi ji",
        name: "Bhabhi ji",
        description: "Upbeat",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#bef264_0%,_#84cc16_50%,_#3f6212_100%)]", // Lime
        provider: "gemini",
    },
    {
        id: "kaal",
        name: "kaal",
        description: "Soft",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fda4af_0%,_#f43f5e_50%,_#be123c_100%)]", // Rose
        provider: "gemini",
    },
    {
        id: "Robot chacha",
        name: "Robot chacha",
        description: "Firm",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#e4e4e7_0%,_#a1a1aa_50%,_#52525b_100%)]", // Zinc
        provider: "gemini",
    },
    {
        id: "Robotic inspector",
        name: "Robotic inspector",
        description: "Even",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#5eead4_0%,_#14b8a6_50%,_#0f766e_100%)]", // Teal
        provider: "gemini",
    },
    {
        id: "mr.patel",
        name: "mr.patel",
        description: "Even",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#2dd4bf_0%,_#0d9488_50%,_#115e59_100%)]", // Teal
        provider: "gemini",
    },
    {
        id: "Chandramukhi",
        name: "Chandramukhi",
        description: "Mature",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fdba74_0%,_#f97316_50%,_#9a3412_100%)]", // Orange
        provider: "gemini",
    },
    {
        id: "shanaya-fashion artist",
        name: "shanaya-fashion artist",
        description: "Forward",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#f0abfc_0%,_#e879f9_50%,_#a21caf_100%)]", // Fuchsia
        provider: "gemini",
    },
    {
        id: "aarav",
        name: "aarav",
        description: "Friendly",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fde047_0%,_#eab308_50%,_#854d0e_100%)]", // Yellow
        provider: "gemini",
    },
    {
        id: "jugaad laal- salesman",
        name: "jugaad laal- salesman",
        description: "Casual",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fdba74_0%,_#f97316_50%,_#c2410c_100%)]", // Orange
        provider: "gemini",
    },
    {
        id: "Warden Madam (The Hostel Warden)",
        name: "Warden Madam (The Hostel Warden)",
        description: "Gentle",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#86efac_0%,_#22c55e_50%,_#14532d_100%)]", // Green
        provider: "gemini",
    },
    {
        id: "Rooh (The Mystery)",
        name: "Rooh (The Mystery)",
        description: "Lively",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fca5a5_0%,_#f87171_50%,_#991b1b_100%)]", // Red
        provider: "gemini",
    },
    {
        id: "Guddu comedian comentater",
        name: "Guddu comedian comentater",
        description: "Knowledgeable",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#93c5fd_0%,_#3b82f6_50%,_#1e3a8a_100%)]", // Blue
        provider: "gemini",
    },
    {
        id: "sustram",
        name: "sustram",
        description: "Warm",
        color: "bg-[radial-gradient(circle_at_50%_0%,_#fdba74_0%,_#f97316_50%,_#9a3412_100%)]", // Orange
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
