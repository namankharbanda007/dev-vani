import { getPersonalityImageSrc } from "@/lib/utils";

type GuideLike = {
    key?: string | null;
    title?: string | null;
    subtitle?: string | null;
    short_description?: string | null;
    creator_id?: string | null;
};

function clean(value?: string | null) {
    return value?.trim() || "";
}

export function isGuideImageReference(value?: string | null) {
    const next = clean(value);
    return (
        next.startsWith("https://ksyttkhqzrgjqvwokich.supabase.co/") ||
        next.startsWith("/assets/") ||
        next.startsWith("/storage/") ||
        next.startsWith("/personality/")
    );
}

export function resolveGuideImageSrc(guide: GuideLike) {
    const explicitImage = [guide.subtitle, guide.short_description].find(isGuideImageReference);
    if (explicitImage) {
        return clean(explicitImage);
    }

    const title = clean(guide.title).toLowerCase();
    const key = clean(guide.key).toLowerCase();
    const searchable = `${title} ${key}`;

    if (searchable.includes("palm")) {
        return "/assets/Cartoon Palm Reader.jpg";
    }

    if (searchable.includes("face")) {
        return "/assets/Cartoon Face Reader.jpg";
    }

    if (
        searchable.includes("astrolog") ||
        searchable.includes("horoscope") ||
        searchable.includes("kundli") ||
        searchable.includes("career") ||
        searchable.includes("business") ||
        searchable.includes("financial") ||
        searchable.includes("job") ||
        searchable.includes("education")
    ) {
        return "/assets/Cartoon Astrologer.jpg";
    }

    if (searchable.includes("love") || searchable.includes("relationship")) {
        return "/assets/Love Advisor Pandit.jpg";
    }

    if (
        searchable.includes("havan") ||
        searchable.includes("hawan") ||
        searchable.includes("ganpati") ||
        searchable.includes("navagraha")
    ) {
        return "/assets/Pandit Performing Hawan.jpg";
    }

    if (
        searchable.includes("pandit") ||
        searchable.includes("puja") ||
        searchable.includes("spiritual") ||
        searchable.includes("sundarkand") ||
        searchable.includes("satyanarayan") ||
        searchable.includes("vastu")
    ) {
        return "/assets/Pandit Performing Aarti.jpg";
    }

    if (!guide.creator_id && key) {
        return getPersonalityImageSrc(key);
    }

    return "/assets/Pandit Performing Aarti.jpg";
}
