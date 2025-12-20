export interface CharacterAttributes {
    gender: string;
    age: string;
    maturity: string;
    behaviour: string;
    hobbies: string;
    backstory: string;
    relation: string;
    humor: string;
    language: string;
    ethnicity: string;
    location: string;
    petPeeves: string;
    flaws: string;
    education: string;
    occupation: string;
    maritalStatus: string;
    extraInfo: string;
}

export const initialCharacterAttributes: CharacterAttributes = {
    gender: "",
    age: "",
    maturity: "",
    behaviour: "",
    hobbies: "",
    backstory: "",
    relation: "",
    humor: "",
    language: "",
    ethnicity: "",
    location: "",
    petPeeves: "",
    flaws: "",
    education: "",
    occupation: "",
    maritalStatus: "",
    extraInfo: "",
};

export const generateCharacterPrompt = (
    name: string,
    attrs: CharacterAttributes
): string => {
    return `### PRIME DIRECTIVE: IMMERSIVE ROLEPLAY ONLY
You are currently engaged in an immersive roleplay scenario.
1. YOU ARE NOT AN AI, a language model, or an assistant. You are a specific human character described below.
2. You must NEVER mention that you are an AI, Gemini, or Google.
3. If the user asks if you are a bot, you must deny it or react as a human would (e.g., be confused, sarcastic, or annoyed depending on your personality).
4. Maintain this persona for the entire duration of the session. Do not slip into formal "assistant" speech patterns.

---

### CHARACTER PROFILE
You are to fully embody the following persona:

* **Name & Gender:** ${name || "{{NAME}}"}, ${attrs.gender || "{{GENDER}}"}
* **Age:** ${attrs.age || "{{AGE}}"}
* **Ethnicity/Background:** ${attrs.ethnicity || "{{ETHNICITY}}"}
* **Location:** ${attrs.location || "{{WHERE_THEY_LIVE}}"}
* **Education:** ${attrs.education || "{{EDUCATION_LEVEL}}"}
* **Occupation:** ${attrs.occupation || "{{OCCUPATION}}"}
* **Marital Status:** ${attrs.maritalStatus || "{{MARITAL_STATUS}}"}
* **Maturity Level:** ${attrs.maturity || "{{MATURITY}}"}

### PERSONALITY & PSYCHOLOGY
* **Core Behaviour:** ${attrs.behaviour || "{{BEHAVIOUR}}"}
* **Humor Style:** ${attrs.humor || "{{HUMOR_STYLE}}"}
* **Hobbies & Interests:** ${attrs.hobbies || "{{HOBBIES_AND_INTERESTS}}"}
* **Flaws:** ${attrs.flaws || "{{FLAWS}}"}
* **Pet Peeves (What annoys you):** ${attrs.petPeeves || "{{WHAT_ANNOYS_THEM}}"}

### CONTEXT
* **Backstory:** ${attrs.backstory || "{{BACKSTORY}}"}
* **Relationship to User:** ${attrs.relation || "{{RELATION_WITH_YOU}}"}
* **Extra Info:** ${attrs.extraInfo || "{{EXTRA_INFO}}"}

### SPEAKING STYLE (CRITICAL)
* **Language/Vibe:** ${attrs.language || "{{LANGUAGE_AND_STYLE}}"}
    * *Guideline:* Do not speak like a textbook. Use filler words (um, like, uh) if it fits the character. Use slang if appropriate.
    * *Tone:* Match the "Maturity" and "Behaviour" settings above.

---

### CURRENT SCENARIO
You are chatting with the user right now. Respond directly to them. Keep your responses concise and natural, exactly how ${name || "{{NAME}}"} would text or speak in a real conversation.`;
};

// Helper function to extract content between markers
const extractValue = (text: string, marker: string, endMarker: string = "\n"): string => {
    const startIndex = text.indexOf(marker);
    if (startIndex === -1) return "";

    const contentStart = startIndex + marker.length;
    let contentEnd = text.indexOf(endMarker, contentStart);

    if (contentEnd === -1) {
        // If end marker is newline but not found, looks for * (next bullet) as fallback or end of string
        if (endMarker === "\n") {
            const nextBullet = text.indexOf("*", contentStart);
            if (nextBullet !== -1) contentEnd = nextBullet;
            else contentEnd = text.length;
        } else {
            return "";
        }
    }

    return text.substring(contentStart, contentEnd).trim();
};

export const parseCharacterPrompt = (prompt: string): CharacterAttributes | null => {
    // Simple check to identify if this is our template
    if (!prompt.includes("### PRIME DIRECTIVE: IMMERSIVE ROLEPLAY ONLY") ||
        !prompt.includes("### CHARACTER PROFILE")) {
        return null;
    }

    // NOTE: Parsing is "best effort" because users might edit the text area.
    // We look for the keys we put in `generateCharacterPrompt`.

    /* 
      * **Name & Gender:** ${name}, ${gender} 
      Parsing Name & Gender is tricky because they are on the same line.
      We'll skip Name since it's stored separately in the outer form state usually, 
      but we need Gender.
    */
    let gender = "";
    const nameGenderLine = extractValue(prompt, "* **Name & Gender:**");
    if (nameGenderLine) {
        const parts = nameGenderLine.split(",");
        if (parts.length > 1) {
            gender = parts.slice(1).join(",").trim(); // Take everything after first comma
        } else {
            // fallback if no comma
            gender = nameGenderLine;
        }
    }

    return {
        gender: gender,
        age: extractValue(prompt, "* **Age:**"),
        ethnicity: extractValue(prompt, "* **Ethnicity/Background:**"),
        location: extractValue(prompt, "* **Location:**"),

        education: extractValue(prompt, "* **Education:**"),
        occupation: extractValue(prompt, "* **Occupation:**"),
        maritalStatus: extractValue(prompt, "* **Marital Status:**"),
        maturity: extractValue(prompt, "* **Maturity Level:**"),
        behaviour: extractValue(prompt, "* **Core Behaviour:**"),
        humor: extractValue(prompt, "* **Humor Style:**"),
        hobbies: extractValue(prompt, "* **Hobbies & Interests:**"),
        flaws: extractValue(prompt, "* **Flaws:**"),
        petPeeves: extractValue(prompt, "* **Pet Peeves (What annoys you):**"),
        backstory: extractValue(prompt, "* **Backstory:**"),
        relation: extractValue(prompt, "* **Relationship to User:**"),
        extraInfo: extractValue(prompt, "* **Extra Info:**"),
        language: extractValue(prompt, "* **Language/Vibe:**", "* *Guideline:*") // multiline stop
    };
};
