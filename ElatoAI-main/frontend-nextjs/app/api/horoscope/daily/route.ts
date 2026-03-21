import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getPlanetaryTransits, getPlanetaryHour, getDailyNumerology } from "@/lib/astrology";
import { toZonedTime, format } from 'date-fns-tz';
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";

export async function GET(req: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(req);
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

        // 4. CHECK GLOBAL CACHE (The "Generate Once" Logic)
        const { data: globalCache } = await supabase
            .from('daily_horoscopes')
            .select('horoscope_data')
            .eq('date', targetDate)
            .eq('sign', signToUse)
            .single();

        if (globalCache && globalCache.horoscope_data) {
            console.log(`Cache HIT for ${signToUse} on ${targetDate}`);
            const cachedData = globalCache.horoscope_data;
            return NextResponse.json(cachedData);
        }

        console.log(`Cache MISS for ${signToUse} on ${targetDate} - Generating...`);

        // 5. GENERATE WITH GEMINI
        console.log(`Generating horoscope for ${signToUse} on ${targetDate}`);

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Gemini API Key not configured");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

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
            
            Return strictly a JSON object with this schema:
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

        let generatedData = {};
        try {
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            // Gemini often wraps JSON in markdown code blocks, so we need to extract it
            const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
            const jsonString = jsonMatch ? jsonMatch[1] : responseText;
            generatedData = JSON.parse(jsonString);
        } catch (e) {
            console.error("Gemini Generation Error", e);
            // FALLBACK: If AI fails (Quota/404), use deterministic but valid data
            generatedData = {
                mood: "✨",
                content: `The stars are aligning for ${signToUse} today. ${transits.split(',')[0] || ''} brings focus to your goals. Trust your intuition.`,
                love: { text: "Be open to connection.", percentage: 70 + (numerology.luckyNumber % 30) },
                career: { text: "Steady progress is favored.", percentage: 60 + (numerology.luckyNumber % 30) },
                money: { text: "Wise investments pay off.", percentage: 50 + (numerology.luckyNumber % 40) },
                health: { text: "Prioritize rest today.", percentage: 80 },
                travel: { text: "Short trips are lucky.", percentage: 40 }
            };
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
        // 6. UPDATE GLOBAL CACHE
        const { error: insertError } = await supabase
            .from('daily_horoscopes')
            .upsert({
                date: targetDate,
                sign: signToUse,
                horoscope_data: newHoroscope
            }, { onConflict: 'date, sign' });

        if (insertError) console.error("Global Cache Insert Error:", insertError);

        // 7. SYNC TO USER METADATA (Optional: Keeps dashboard fast without global lookup)
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
        const errorMessage = error instanceof Error ? error.message : "Unknown Error";
        return NextResponse.json({ error: errorMessage, details: String(error) }, { status: 500 });
    }
}
