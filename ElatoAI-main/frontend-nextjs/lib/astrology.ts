import {
    AstroTime,
    Body,
    Observer,
    SunPosition,
    MoonPhase,
    GeoVector,
    Ecliptic,
    SearchRiseSet,
} from 'astronomy-engine';

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
    const astroTime = new AstroTime(date);
    const sun = SunPosition(astroTime);
    // SunPosition returns EclipticCoordinates { elon, elat, ... }
    const lon = sun.elon;

    const sign = ZODIAC_SIGNS.find(s => lon >= s.start && lon < s.end) || ZODIAC_SIGNS[11];
    return sign;
};

/**
 * Calculates the current Moon Phase and Sign.
 */
export const getMoonDetails = (date: Date) => {
    const astroTime = new AstroTime(date);
    const moonVec = GeoVector(Body.Moon, astroTime, true);
    const phase = MoonPhase(astroTime); // 0-360

    let phaseName = "New Moon";
    if (phase < 45) phaseName = "Waxing Crescent";
    else if (phase < 90) phaseName = "First Quarter";
    else if (phase < 135) phaseName = "Waxing Gibbous";
    else if (phase < 180) phaseName = "Full Moon";
    else if (phase < 225) phaseName = "Waning Gibbous";
    else if (phase < 270) phaseName = "Last Quarter";
    else if (phase < 315) phaseName = "Waning Crescent";

    // Convert GeoVector to Ecliptic to get longitude
    const moonPos = Ecliptic(moonVec);
    const lon = moonPos.elon;
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
 */
export const getPlanetaryTransits = (date: Date) => {
    const astroTime = new AstroTime(date);
    const bodies = [
        { name: 'Mercury', body: Body.Mercury },
        { name: 'Venus', body: Body.Venus },
        { name: 'Mars', body: Body.Mars },
        { name: 'Jupiter', body: Body.Jupiter },
        { name: 'Saturn', body: Body.Saturn },
    ];

    return bodies.map(b => {
        const vec = GeoVector(b.body, astroTime, true);
        const ecl = Ecliptic(vec);
        const lon = ecl.elon;
        const sign = ZODIAC_SIGNS.find(s => lon >= s.start && lon < s.end);
        return `${b.name} in ${sign?.name}`;
    }).join(', ');
};

/**
 * Generate a deterministic integer seed from string(s).
 */
function getStringHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Calculates a "Lucky Time" based on Planetary Hours (Hora) and Sign.
 * Each sign has a ruling planet, affecting the auspicious hour.
 */
export const getPlanetaryHour = (date: Date, signName: string = "Aries") => {
    const observer = new Observer(28.6139, 77.2090, 0); // New Delhi (default)

    // SearchRiseSet returns AstroTime | null
    const sunrise = SearchRiseSet(Body.Sun, observer, +1, date, 300);
    const sunriseDate = sunrise ? sunrise.date : new Date(date.setHours(6, 0, 0));

    // Simple deterministic offset based on Sign Name hash + Day
    const seed = getStringHash(signName + date.toDateString());

    // Pick a time between 8 AM and 8 PM
    const startHour = 8;
    const windowSize = 12; // 12 hours window

    const randomOffsetHours = seed % windowSize;
    const randomOffsetMinutes = (seed % 60);

    let targetHour = startHour + randomOffsetHours;
    let targetMinute = randomOffsetMinutes;

    // Round to nearest 5 mins for cleaner look
    targetMinute = Math.round(targetMinute / 5) * 5;
    if (targetMinute === 60) {
        targetMinute = 0;
        targetHour += 1;
    }

    const dateObj = new Date(sunriseDate);
    dateObj.setHours(targetHour, targetMinute);

    return dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

/**
 * Determine Lucky Number and Color based on Chaldean Numerology & Astrology.
 */
export const getDailyNumerology = (date: Date, signName: string) => {
    const seed = getStringHash(signName + date.toDateString());

    // Lucky Numbers (1-9)
    const luckyNumber = (seed % 9) + 1;

    // Lucky Colors based on element + variance
    const elementColors = {
        'Aries': ['Red', 'Scarlet', 'Gold', 'Mustard'],
        'Leo': ['Gold', 'Orange', 'White', 'Purple'],
        'Sagittarius': ['Purple', 'Yellow', 'Blue', 'Orange'],
        'Taurus': ['Green', 'Pink', 'White', 'Earth Brown'],
        'Virgo': ['Green', 'Beige', 'Grey', 'Navy Blue'],
        'Capricorn': ['Black', 'Grey', 'Brown', 'Charcoal'],
        'Gemini': ['Yellow', 'Green', 'Orange', 'Sky Blue'],
        'Libra': ['Pink', 'Blue', 'White', 'Lavender'],
        'Aquarius': ['Blue', 'Turquoise', 'Silver', 'Violet'],
        'Cancer': ['Silver', 'White', 'Cream', 'Sea Green'],
        'Scorpio': ['Maroon', 'Red', 'Black', 'Rust'],
        'Pisces': ['Sea Green', 'Mauve', 'Violet', 'Silver']
    };

    const colors = elementColors[signName as keyof typeof elementColors] || ['White', 'Blue'];
    const luckyColor = colors[seed % colors.length];

    return { luckyNumber, luckyColor };
};
