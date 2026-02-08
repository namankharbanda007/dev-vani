import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getPlanetaryTransits, getPlanetaryHour } from "@/lib/astrology";
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

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Fetch current user data
        const { data: dbUser, error: fetchError } = await supabase
            .from("users")
            .select("user_info")
            .eq("user_id", user.id)
            .single();

        if (fetchError || !dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const metadata = (dbUser.user_info as any)?.user_metadata || {};
        const signToUse = requestedSign || "Aries"; // Default if something goes wrong, but frontend should always send

        // 3. Real Astronomical Data
        const transits = getPlanetaryTransits(targetDateObj);
        const luckyTime = getPlanetaryHour(targetDateObj);

        // 4. CHECK CACHE (Logic: If we have a stored horoscope for this date/sign, return it)
        // We need to check if the *user's* stored daily horoscope matches this request.
        // We only cache the "Main" horoscope in the user_metadata to avoid cluttering DB with 12 signs.
        // For other signs/dates, we might just return generated data without saving to profile, 
        // OR we could implement a separate "cache" table. For now, following the audit plan:
        // "Browsing other signs... triggers fresh API calls". 
        // We will stick to caching ONLY if it's the User's Own Sign + Today.

        // However, to prevent "Token Wasting" for Tomorrow/Others, we can eventually use a global cache.
        // For this step, I will implement the "Deterministic Seed" in the prompt to ensure consistency if re-generated.

        // Check if this request matches the user's "Primary" horoscope (User's Sign + Today)
        // We need the user's actual sign to know if this is "their" horoscope.
        // For simplicity, let's assume `signToUse` matches their birth sign if `requestedSign` was empty or same.
        // But since we are stateless about "User's Sign" here properly without recalculating it each time...
        // Let's just check the existing cache date.

        const cachedHoroscope = metadata.daily_horoscope;
        const isUserSign = (cachedHoroscope?.sign === signToUse);

        if (isUserSign && cachedHoroscope?.date === targetDate && cachedHoroscope?.money) {
            return NextResponse.json(cachedHoroscope);
        }

        // 5. GENERATE
        console.log(`Generating horoscope for ${signToUse} on ${targetDate}`);

        const prompt = `
            Act as an expert mystic astrologer.
            Generate a daily horoscope for: ${signToUse}
            Date: ${targetDate}
            
            REAL ASTRONOMICAL DATA (Use this to ground your predictions):
            - Planetary Transits: ${transits}
            - Planetary Hour (Lucky Time): ${luckyTime}
            
            INSTRUCTIONS:
            - Use the planetary positions to give specific advice. e.g. "With Saturn in Pisces, focus on..."
            - The "Lucky Time" MUST be exactly: "${luckyTime}".
            - Generate a "Lucky Number" and "Lucky Color" based on numerology of the date.
            - "Mood" should be a single emoji reflecting the transit energy.
            
            Return strictly a JSON object:
            {
                "lucky_color": "Specific color name",
                "lucky_number": "Single number string",
                "lucky_time": "${luckyTime}",
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
            seed: parseInt(targetDate.replace(/-/g, '')) + signToUse.length, // Deterministic Seed based on Date+Sign
        });

        const rawContent = completion.choices[0].message.content;
        if (!rawContent) throw new Error("No content from OpenAI");

        const generatedData = JSON.parse(rawContent);

        const newHoroscope = {
            date: targetDate,
            sign: signToUse,
            ...generatedData
        };

        // 6. CACHE (Only if it's "Today" and likely the user's primary sign request)
        // Since we don't strictly check if signToUse == UserBirthSign here (we could but it requires extra DB read of birthdate -> sign calc),
        // we will update the profile cache IF the requests didn't specify a sign (meaning it used default/user sign) OR if it matches the 'cached' sign.
        // Actually best logic: Update cache if relativeDate is "Today" and requestedSign is null (implied user sign) OR matches user metadata.

        // For now, to be safe and simple: If `referenceDate` is Today, we update. 
        // The user might be browsing "Aries" when they are "Taurus". We shouldn't overwrite their "Taurus" cache with "Aries".
        // We will skip overwriting if `requestedSign` is present. We only write if `requestedSign` was null (default flow).

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
