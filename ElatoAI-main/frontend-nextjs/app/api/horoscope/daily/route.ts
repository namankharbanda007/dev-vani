import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getPlanetaryTransits, getPlanetaryHour, getDailyNumerology } from "@/lib/astrology"; // Added getDailyNumerology
import { toZonedTime, format } from 'date-fns-tz';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: Request) {
    const supabase = createClient();
    const { searchParams } = new URL(req.url);

    // 1. Parse Query Params
    const requestedSign = searchParams.get('sign');
    const relativeDate = searchParams.get('date'); // "Yesterday", "Today", "Tomorrow"
    const userTimezone = searchParams.get('timezone') || "UTC"; // Default to UTC if not provided

    // 2. Calculate "Target Date" relative to User's Timezone
    const now = new Date();
    const zonedNow = toZonedTime(now, userTimezone);

    const targetDateObj = new Date(zonedNow);
    if (relativeDate === "Yesterday") targetDateObj.setDate(targetDateObj.getDate() - 1);
    if (relativeDate === "Tomorrow") targetDateObj.setDate(targetDateObj.getDate() + 1);

    const targetDate = format(targetDateObj, 'yyyy-MM-dd', { timeZone: userTimezone });

    // Auth Check
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        // Fetch current user data for caching/metadata
        const { data: dbUser, error: fetchError } = await supabase
            .from("users")
            .select("user_info")
            .eq("user_id", user.id)
            .single();

        if (fetchError || !dbUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

        const metadata = (dbUser.user_info as any)?.user_metadata || {};
        const signToUse = requestedSign || "Aries";

        // 3. Real Astronomical & Numerological Data
        const transits = getPlanetaryTransits(targetDateObj);
        const luckyTime = getPlanetaryHour(targetDateObj, signToUse); // Pass sign for variance
        const numerology = getDailyNumerology(targetDateObj, signToUse); // Get deterministic numbers/colors

        // 4. CHECK USER CACHE (Only for "Today" + "User's Sign")
        const cachedHoroscope = metadata.daily_horoscope;
        const isUserSign = (cachedHoroscope?.sign === signToUse);

        // Return cache if it matches Today + Sign + has data
        if (isUserSign && cachedHoroscope?.date === targetDate && cachedHoroscope?.money) {
            return NextResponse.json(cachedHoroscope);
        }

        // 5. GENERATE
        console.log(`Generating horoscope for ${signToUse} on ${targetDate}`);

        // Create a robust seed to prevent collisions between signs
        const seedString = `${targetDate}-${signToUse}`;
        let seedHash = 0;
        for (let i = 0; i < seedString.length; i++) {
            seedHash = ((seedHash << 5) - seedHash) + seedString.charCodeAt(i);
            seedHash |= 0;
        }

        const prompt = `
            Act as an expert mystic astrologer.
            Generate a daily horoscope for: ${signToUse}
            Date: ${targetDate}
            
            REAL ASTRONOMICAL DATA:
            - Planetary Transits: ${transits}
            - Planetary Hour: ${luckyTime}
            
            MANDATORY DATA (Do not change these):
            - Lucky Number: ${numerology.luckyNumber}
            - Lucky Color: ${numerology.luckyColor}
            - Lucky Time: ${luckyTime}
            
            INSTRUCTIONS:
            - Use the planetary positions to give specific advice.
            - "Mood" should be a single emoji reflecting the transit energy.
            - Provide percentages (0-100) for Love, Career, Money, Health, Travel based on the astrological aspects.
            
            Return strictly a JSON object:
            {
                "mood": "Single emoji",
                "content": "2-sentence astrological prediction referencing the transits.",
                "love": { "text": "Insight about love.", "percentage": 85 },
                "career": { "text": "Insight about career.", "percentage": 60 },
                "money": { "text": "Insight about finances.", "percentage": 70 },
                "health": { "text": "Insight about health.", "percentage": 90 },
                "travel": { "text": "Insight about travel.", "percentage": 40 }
            }
        `;

        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: "You are a mystical astrologer. Output valid JSON only." }, { role: "user", content: prompt }],
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            seed: Math.abs(seedHash), // Robust deterministic seed
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) throw new Error("No content from OpenAI");

        let generatedData = {};
        try {
            generatedData = JSON.parse(rawContent);
        } catch (e) {
            console.error("JSON Parse Error", e);
            // Fallback content if JSON fails
            generatedData = { content: "The stars are quiet today. Please try again later." };
        }

        const newHoroscope = {
            date: targetDate,
            sign: signToUse,
            lucky_number: numerology.luckyNumber.toString(),
            lucky_color: numerology.luckyColor,
            lucky_time: luckyTime,
            ...generatedData // Spread AI data (mood, content, categories)
        };

        // 6. UPDATE CACHE (Only if logic permits, same as before)
        if (!requestedSign && relativeDate === "Today") {
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
