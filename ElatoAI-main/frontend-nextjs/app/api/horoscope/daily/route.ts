
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Helper to determine Zodiac Sign from date (duplicated from frontend for backend reliability)
const getZodiacSign = (dateString?: string) => {
    if (!dateString) return "Aries"; // Default
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

export async function GET(req: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch current user data to check cache
        const { data: dbUser, error: fetchError } = await supabase
            .from("users")
            .select("user_info")
            .eq("user_id", user.id)
            .single();

        if (fetchError || !dbUser) {
            console.error("Error fetching user:", fetchError);
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const metadata = (dbUser.user_info as any)?.user_metadata || {};
        const birthDate = metadata.birth_date;
        const rashi = metadata.rashi;

        // 1. Check if we already have a horoscope for TODAY
        const today = new Date().toISOString().split('T')[0];
        const cachedHoroscope = metadata.daily_horoscope;

        if (cachedHoroscope && cachedHoroscope.date === today) {
            // Return cached version
            return NextResponse.json(cachedHoroscope);
        }

        // 2. Generate New Horoscope via OpenAI
        const sign = getZodiacSign(birthDate);
        console.log(`Generating horoscope for ${sign}...`);

        const prompt = `
            Generate a short, mystical, and uplifting daily horoscope for a ${sign} (Zodiac) user.
            ${rashi ? `Their Vedic Rashi is ${rashi}.` : ""}
            
            Return strictly a JSON object with the following fields:
            {
                "lucky_color": "Specific color name (e.g. 'Azure Blue')",
                "lucky_number": "Single number string (e.g. '7')",
                "lucky_time": "Time string (e.g. '04:20 PM')",
                "mood": "Single emoji (e.g. '✨')",
                "content": "A 2-sentence horoscope prediction."
            }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a mystical astrologer." }, { role: "user", content: prompt }],
            model: "gpt-4o-mini", // Cost effective
            response_format: { type: "json_object" },
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) throw new Error("No content from OpenAI");

        const generatedData = JSON.parse(rawContent);

        const newHoroscope = {
            date: today,
            sign: sign,
            ...generatedData
        };

        // 3. Save to Database (Cache it)
        const updatedMetadata = {
            ...metadata,
            daily_horoscope: newHoroscope
        };

        const { error: updateError } = await supabase
            .from("users")
            .update({
                user_info: {
                    ...dbUser.user_info as any,
                    user_metadata: updatedMetadata
                }
            })
            .eq("user_id", user.id);

        if (updateError) {
            console.error("Failed to cache horoscope:", updateError);
            // We still return the data even if caching failed
        }

        return NextResponse.json(newHoroscope);

    } catch (error) {
        console.error("Horoscope API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
