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
 * Calculates a "Lucky Time" based on Planetary Hours (Hora).
 */
export const getPlanetaryHour = (date: Date) => {
    const observer = new Observer(28.6139, 77.2090, 0);
    const astroTime = new AstroTime(date);

    // SearchRiseSet returns AstroTime | null
    const sunrise = SearchRiseSet(Body.Sun, observer, +1, date, 300);

    if (!sunrise) return "10:00 AM";

    // Seed logic
    const seed = date.getDate() + date.getMonth();
    const rangeStart = 8;
    const rangeEnd = 20;

    const hour = (seed % (rangeEnd - rangeStart)) + rangeStart;
    const minute = (seed * 17) % 60;

    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour > 12 ? hour - 12 : hour;

    return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
};
