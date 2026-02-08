
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { getPlanetaryTransits, getPlanetaryHour, getDailyNumerology } from "../lib/astrology";

dotenv.config();

async function testGemini() {
    console.log("Testing Gemini API Integration...");

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("❌ GEMINI_API_KEY not found in .env");
        return;
    }
    console.log("✅ API Key found.");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        generationConfig: { responseMimeType: "application/json" } // Force JSON
    });

    const targetDateObj = new Date();
    const targetDate = targetDateObj.toISOString().split('T')[0];
    const signToUse = "Leo";

    const transits = getPlanetaryTransits(targetDateObj);
    const luckyTime = getPlanetaryHour(targetDateObj, signToUse);
    const numerology = getDailyNumerology(targetDateObj, signToUse);

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

    try {
        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        console.log("\n--- Raw Response ---");
        console.log(responseText.substring(0, 200) + "...");

        // Parser Logic Verification
        let generatedData = {};
        // Clean markdown if present (Gemini 1.5 Flash with JSON mode usually returns pure JSON, but good to test regex)
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : responseText;

        generatedData = JSON.parse(jsonString);
        console.log("\n✅ Parsed Data Successfully:");
        console.log(JSON.stringify(generatedData, null, 2));

    } catch (e) {
        console.error("❌ Gemini Test Failed:", e);
    }
}

testGemini();
