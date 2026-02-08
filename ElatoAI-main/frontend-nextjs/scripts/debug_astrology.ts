
import { getSunSign, getMoonDetails, getPlanetaryTransits, getPlanetaryHour, getDailyNumerology } from '../lib/astrology';

async function testAstrology() {
    console.log("Testing Astrology Library...");
    const date = new Date();

    try {
        console.log("1. Testing Sun Sign...");
        const sunSign = getSunSign(date);
        console.log("Sun Sign:", sunSign);
    } catch (e) {
        console.error("GetSunSign Failed:", e);
    }

    try {
        console.log("2. Testing Moon Details...");
        const moon = getMoonDetails(date);
        console.log("Moon:", moon);
    } catch (e) {
        console.error("GetMoonDetails Failed:", e);
    }

    try {
        console.log("3. Testing Planetary Transits...");
        const transits = getPlanetaryTransits(date);
        console.log("Transits:", transits);
    } catch (e) {
        console.error("GetPlanetaryTransits Failed:", e);
    }

    try {
        console.log("4. Testing Planetary Hour...");
        const hour = getPlanetaryHour(date, "Aries");
        console.log("Hour:", hour);
    } catch (e) {
        console.error("GetPlanetaryHour Failed:", e);
    }

    try {
        console.log("5. Testing Numerology...");
        const num = getDailyNumerology(date, "Aries");
        console.log("Numerology:", num);
    } catch (e) {
        console.error("GetDailyNumerology Failed:", e);
    }
}

testAstrology();
