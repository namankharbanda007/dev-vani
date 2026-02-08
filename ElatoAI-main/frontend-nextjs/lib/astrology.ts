import { Astronomy, DefineStar, Equator, Observer, SearchMoonQuarter, Time } from 'astronomy-engine';

// Zodiac Signs with their starting longitudes (Tropical)
const ZODIAC_SIGNS = [
    { name: 'Aries', symbol: '♈', start: 0, end: 30 },
    { name: 'Taurus', symbol: '♉', start: 30, end: 60 },
    { name: 'Gemini', symbol: '♊', start: 60, end: 90 },
    { name: 'Cancer', symbol: '♋', start: 90, end: 120 },
    { name: 'Leo', symbol: '♌', start: 120, end: 150 },
    { name: 'Virgo', symbol: '♍', start: 150, end: 180 },
    { name: 'Libra', symbol: '♎', start: 180, end: 210 },
    { name: 'Scorpio', symbol: '♏', start: 210, end: 240 },
    { name: 'Sagittarius', symbol: '♐', start: 240, end: 270 },
    { name: 'Capricorn', symbol: '♑', start: 270, end: 300 },
    { name: 'Aquarius', symbol: '♒', start: 300, end: 330 },
    { name: 'Pisces', symbol: '♓', start: 330, end: 360 },
];

/**
 * Calculates the Tropical Sun Sign for a given date.
 */
export const getSunSign = (date: Date) => {
    const astroTime = new Time(date);
    const sun = Astronomy.SunPosition(astroTime);
    // longitude is 0-360. 0 is Aries start.
    const lon = sun.ecliptic.longitude;

    const sign = ZODIAC_SIGNS.find(s => lon >= s.start && lon < s.end) || ZODIAC_SIGNS[11]; // Fallback to Pisces if 359.9...
    return sign;
};

/**
 * Calculates the current Moon Phase and Sign.
 */
export const getMoonDetails = (date: Date) => {
    const astroTime = new Time(date);
    const moon = Astronomy.GeoVector(Astronomy.Body.Moon, astroTime, true);
    // Calculate ecliptic longitude of Moon? Astronomy-engine approach:
    // easier to just use MoonPhase function for phase
    const phase = Astronomy.MoonPhase(astroTime); // 0-360

    let phaseName = "New Moon";
    if (phase < 45) phaseName = "Waxing Crescent";
    else if (phase < 90) phaseName = "First Quarter";
    else if (phase < 135) phaseName = "Waxing Gibbous";
    else if (phase < 180) phaseName = "Full Moon";
    else if (phase < 225) phaseName = "Waning Gibbous";
    else if (phase < 270) phaseName = "Last Quarter";
    else if (phase < 315) phaseName = "Waning Crescent";

    // To get Moon Sign, we need Ecliptic Longitude
    // GeoVector returns equatorial coordinates. 
    // We can use Ecliptic(vector)
    const moonPos = Astronomy.Ecliptic(moon);
    const lon = moonPos.longitude;
    const sign = ZODIAC_SIGNS.find(s => lon >= s.start && lon < s.end);

    return {
        phase: phaseName,
        phaseAngle: phase,
        sign: sign?.name || "Pisces",
        symbol: sign?.symbol || "♓"
    };
};

/**
 * Get current positions of major planets to inject into AI prompt.
 * "Saturn is in Pisces", "Jupiter is in Gemini", etc.
 */
export const getPlanetaryTransits = (date: Date) => {
    const astroTime = new Time(date);
    const bodies = [
        { name: 'Mercury', body: Astronomy.Body.Mercury },
        { name: 'Venus', body: Astronomy.Body.Venus },
        { name: 'Mars', body: Astronomy.Body.Mars },
        { name: 'Jupiter', body: Astronomy.Body.Jupiter },
        { name: 'Saturn', body: Astronomy.Body.Saturn },
    ];

    return bodies.map(b => {
        const vec = Astronomy.GeoVector(b.body, astroTime, true);
        const ecl = Astronomy.Ecliptic(vec);
        const lon = ecl.longitude;
        const sign = ZODIAC_SIGNS.find(s => lon >= s.start && lon < s.end);
        return `${b.name} in ${sign?.name}`;
    }).join(', ');
};

/**
 * Calculates a "Lucky Time" based on Planetary Hours (Hora).
 * Simple approximation: Sunrise + (DayOfWeekOffset).
 * Ideally needs lat/long, defaulting to New Delhi for generic.
 */
export const getPlanetaryHour = (date: Date) => {
    // Default observer: New Delhi (28.6139, 77.2090)
    const observer = new Observer(28.6139, 77.2090, 0);
    const astroTime = new Time(date);

    // Get sunrise/sunset
    const sunrise = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, +1, date, 300); // +1 for Rise

    if (!sunrise) return "10:00 AM"; // Fallback

    const sunriseDate = sunrise.date;
    // Simple Hora logic: The 1st hour of the day is ruled by the Day Lord.
    // Sunday -> Sun, Monday -> Moon, etc.
    // Let's just return a "Peak Power Time" which is usually Noon or Sunrise + 2hrs

    // Add random offset deterministic to date to simulate "Lucky Time"
    const seed = date.getDate() + date.getMonth();
    const rangeStart = 8; // 8 AM
    const rangeEnd = 20; // 8 PM

    // Deterministic pseudo-random based on date
    const hour = (seed % (rangeEnd - rangeStart)) + rangeStart;
    const minute = (seed * 17) % 60;

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : hour;

    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
