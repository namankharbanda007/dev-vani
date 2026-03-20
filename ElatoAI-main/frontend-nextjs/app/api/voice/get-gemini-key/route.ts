import { NextResponse } from 'next/server';

function getOrigin(value: string | null) {
    if (!value) return null;
    try {
        return new URL(value).origin.toLowerCase();
    } catch {
        return null;
    }
}

export async function POST(req: Request) {
    try {
        const origin = getOrigin(req.headers.get('origin'));
        const refererOrigin = getOrigin(req.headers.get('referer'));
        const expectedOrigin = getOrigin(req.url);

        const hasTrustedOrigin =
            expectedOrigin &&
            (origin === expectedOrigin || refererOrigin === expectedOrigin);

        if (process.env.NODE_ENV === 'production' && !hasTrustedOrigin) {
            return NextResponse.json(
                { error: 'Forbidden origin for Gemini key request' },
                { status: 403 }
            );
        }

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
