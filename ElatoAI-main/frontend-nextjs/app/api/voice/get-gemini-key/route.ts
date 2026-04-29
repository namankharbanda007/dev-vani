import { NextResponse } from 'next/server';
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";

export async function POST(req: Request) {
    try {
        const { user } = await getSupabaseForRouteAuth(req);

        if (process.env.NODE_ENV === 'production' && !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
