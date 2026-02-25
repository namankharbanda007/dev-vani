import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js";
import { format, toZonedTime } from 'date-fns-tz';

export async function POST(req: Request) {
    try {
        // Since this is a webhook, we need a service role client to query users by phone number securely
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing Supabase Service Role Key or URL");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const body = await req.json();

        // --- 1. Meta WhatsApp Webhook Verification ---
        // (Typically handled via GET, but some platforms send setup POSTs)

        // --- 2. Extract Message Data & Mock Logic ---
        console.log("📨 Received WhatsApp Webhook Payload:", JSON.stringify(body, null, 2));

        // Let's assume a simplified structure for demonstration/mocking
        // In reality, this depends on Meta's specific webhook schema
        const incomingMessage = body?.message || "";
        const senderPhone = body?.from || "";

        if (!incomingMessage || typeof incomingMessage !== 'string') {
            return NextResponse.json({ status: "ignored - no message" });
        }

        const normalizedMessage = incomingMessage.trim().toLowerCase();

        if (normalizedMessage === "radhe radhe") {
            console.log(`🙏 'Radhe Radhe' received from ${senderPhone}`);

            // 3. Check if user exists
            let isRegistered = false;
            let dbUser = null;

            if (senderPhone) {
                const { data, error } = await supabase
                    .from('users')
                    .select('user_id, zodiac_sign, date_of_birth, user_info')
                    .eq('whatsapp_number', senderPhone)
                    .single();

                if (data && !error) {
                    isRegistered = true;
                    dbUser = data;
                }
            }

            if (isRegistered && dbUser) {
                // 4a. Registered User -> Generate Daily Horoscope 
                const sign = dbUser.zodiac_sign || "Aries"; // Default if missing

                console.log(`✨ User is registered. Generating horoscope for sign: ${sign}`);

                // Call our internal Gemini Generate API (mocking internal fetch)
                const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
                const today = format(toZonedTime(new Date(), 'UTC'), 'yyyy-MM-dd');

                try {
                    // Reusing the existing API endpoint
                    const horoscopeRes = await fetch(`${baseUrl}/api/horoscope/daily?sign=${sign}&date=Today`, {
                        headers: {
                            // Pass a secret header if your internal API requires it, or we bypass auth for server-to-server 
                            // NOTE: Because /api/horoscope/daily checks `supabase.auth.getUser()`, 
                            // we would usually need to pass an auth token, or refactor the logic into a shared lib function.
                        }
                    });

                    if (horoscopeRes.ok) {
                        const horoscopeData = await horoscopeRes.json();
                        const replyMessage = `Radhe Radhe! 🙏 Here is your daily guidance:
${horoscopeData.content}

Lucky Color: ${horoscopeData.lucky_color}
Lucky Number: ${horoscopeData.lucky_number}
Lucky Time: ${horoscopeData.lucky_time}

May the Devine bless you today! ✨`;

                        // Mocking the sending of WhatsApp Message
                        console.log("🚀 MOCK WHATSAPP SEND (REGISTERED):");
                        console.log(`To: ${senderPhone}`);
                        console.log(`Message: \n${replyMessage}`);

                    } else {
                        console.error("Failed to fetch horoscope internally", await horoscopeRes.text());
                        console.log("🚀 MOCK WHATSAPP SEND (API ERROR): Radhe Radhe! Please check the app for your daily insights.");
                    }
                } catch (e) {
                    console.error("Internal fetch error", e);
                }

            } else {
                // 4b. Unregistered User -> Send Promo
                console.log(`❌ User not registered (${senderPhone}). Sending signup prompt.`);
                const registrationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/signup`;

                const replyMessage = `Radhe Radhe! 🙏 To get your personalized daily horoscope and talk to your AI Pandit, please register here: ${registrationUrl} and get ₹100 instantly in your wallet!`;

                // Mocking the sending of WhatsApp Message
                console.log("🚀 MOCK WHATSAPP SEND (UNREGISTERED):");
                console.log(`To: ${senderPhone}`);
                console.log(`Message: \n${replyMessage}`);
            }

            return NextResponse.json({ status: "success", handled: true });
        }

        return NextResponse.json({ status: "ignored - unrelated message" });

    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// Meta WhatsApp usually requires a GET endpoint for webhook verification during setup
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token) {
        if (mode === "subscribe" && token === VERIFY_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            return new NextResponse(challenge, { status: 200 });
        } else {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }
    }

    return NextResponse.json({ status: "ready" });
}
