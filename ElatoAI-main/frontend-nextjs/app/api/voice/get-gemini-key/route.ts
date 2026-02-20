import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // In a strict production environment, we should validate the user session or a short-lived token here
        // The goal is to prevent bots from scraping the key directly from the initial GET /api/session payload.
        // We require a POST request to add a layer of obfuscation.

        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Server configuration error: Gemini API Key not found' }, { status: 500 });
        }

        return NextResponse.json({ gemini_api_key: apiKey });
    } catch (error) {
        console.error('Error in secure Gemini key fetch:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
