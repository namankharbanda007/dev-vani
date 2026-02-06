import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper to determine Zodiac Sign from date
const getZodiacSign = (dateString?: string) => {
    if (!dateString) return "Aries";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;

    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
    return "Pisces";
};

// Helper to get date string relative to today
const getDateString = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toISOString().split('T')[0];
};

export async function GET(req: Request) {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);

    // 1. Parse Query Params
    const requestedSign = searchParams.get('sign');
    const relativeDate = searchParams.get('date'); // "Yesterday", "Today", "Tomorrow"

    // Calculate actual date string
    let targetDate = getDateString(0); // Default Today
    if (relativeDate === "Yesterday") targetDate = getDateString(-1);
    if (relativeDate === "Tomorrow") targetDate = getDateString(1);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch current user data for context
        const { data: dbUser, error: fetchError } = await supabase
            .from("users")
            .select("user_info")
            .eq("user_id", user.id)
            .single();

        if (fetchError || !dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const metadata = (dbUser.user_info as any)?.user_metadata || {};
        const userBirthDate = metadata.birth_date;
        const userSign = getZodiacSign(userBirthDate);

        // Determine which sign to generate for
        const signToUse = requestedSign || userSign;
        const rashiToUse = (signToUse === userSign) ? metadata.rashi : ""; // Only use Rashi if it's the user's sign

        // 2. CHECK CACHE (Only if it's the user's main horoscope for TODAY)
        const isMainProfile = (signToUse === userSign && targetDate === getDateString(0));

        if (isMainProfile) {
            const cachedHoroscope = metadata.daily_horoscope;
            if (cachedHoroscope && cachedHoroscope.date === targetDate) {
                // Check if it has the new fields (migration check)
                if (cachedHoroscope.money) {
                    return NextResponse.json(cachedHoroscope);
                }
            }
        }

        // 3. GENERATE
        const prompt = `
            Generate a short, mystical, and uplifting daily horoscope for a ${signToUse} (Zodiac) user for the date ${targetDate}.
            ${rashiToUse ? `Their Vedic Rashi is ${rashiToUse}.` : ""}
            
            Return strictly a JSON object with the following fields:
            {
                "lucky_color": "Specific color name (e.g. 'Azure Blue')",
                "lucky_number": "Single number string (e.g. '7')",
                "lucky_time": "Time string (e.g. '04:20 PM')",
                "mood": "Single emoji (e.g. '✨')",
                "content": "A 2-sentence general horoscope prediction.",
                "love": { "text": "Insight about love.", "percentage": 85 },
                "career": { "text": "Insight about career.", "percentage": 60 },
                "money": { "text": "Insight about finances.", "percentage": 70 },
                "health": { "text": "Insight about health.", "percentage": 90 },
                "travel": { "text": "Insight about travel.", "percentage": 40 }
            }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a mystical astrologer." }, { role: "user", content: prompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) throw new Error("No content from OpenAI");

        const generatedData = JSON.parse(rawContent);

        const newHoroscope = {
            date: targetDate,
            sign: signToUse,
            ...generatedData
        };

        // 4. CACHE (Only if main profile)
        if (isMainProfile) {
            const updatedMetadata = {
                ...metadata,
                daily_horoscope: newHoroscope
            };

            await supabase
                .from("users")
                .update({
                    user_info: {
                        ...dbUser.user_info as any,
                        user_metadata: updatedMetadata
                    }
                })
                .eq("user_id", user.id);
        }

        return NextResponse.json(newHoroscope);

    } catch (error) {
        console.error("Horoscope API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
