import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { format, toZonedTime } from "date-fns-tz";

export async function POST(req: Request) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

        if (!supabaseUrl || !supabaseServiceKey) {
            console.error("Missing Supabase service role key or URL");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        const body = await req.json();

        console.log("Received WhatsApp webhook payload:", JSON.stringify(body, null, 2));

        const incomingMessage = body?.message || "";
        const senderPhone = body?.from || "";

        if (!incomingMessage || typeof incomingMessage !== "string") {
            return NextResponse.json({ status: "ignored - no message" });
        }

        const normalizedMessage = incomingMessage.trim().toLowerCase();

        if (normalizedMessage !== "radhe radhe") {
            return NextResponse.json({ status: "ignored - unrelated message" });
        }

        let dbUser: { zodiac_sign?: string | null } | null = null;

        if (senderPhone) {
            const { data, error } = await supabase
                .from("users")
                .select("user_id, zodiac_sign, date_of_birth, user_info")
                .eq("whatsapp_number", senderPhone)
                .single();

            if (data && !error) {
                dbUser = data;
            }
        }

        if (dbUser) {
            const sign = dbUser.zodiac_sign || "Aries";
            const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
            const today = format(toZonedTime(new Date(), "UTC"), "yyyy-MM-dd");

            try {
                const horoscopeRes = await fetch(`${baseUrl}/api/horoscope/daily?sign=${sign}&date=${today}`);

                if (horoscopeRes.ok) {
                    const horoscopeData = await horoscopeRes.json();
                    const replyMessage = `Radhe Radhe! Here is your daily guidance:
${horoscopeData.content}

Lucky Color: ${horoscopeData.lucky_color}
Lucky Number: ${horoscopeData.lucky_number}
Lucky Time: ${horoscopeData.lucky_time}

May your day feel calm and blessed.`;

                    console.log("WhatsApp send pending provider integration:");
                    console.log(`To: ${senderPhone}`);
                    console.log(`Message: \n${replyMessage}`);
                } else {
                    console.error("Failed to fetch horoscope internally", await horoscopeRes.text());
                    console.log("WhatsApp fallback: Radhe Radhe! Please check Smart Murti for today's guidance.");
                }
            } catch (error) {
                console.error("Internal horoscope fetch error", error);
            }
        } else {
            const registrationUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://smartmurti.com"}/login`;
            const replyMessage = `Radhe Radhe! To try Smart Pandit guidance and NRI launch packages, please register here: ${registrationUrl}`;

            console.log("WhatsApp send pending provider integration:");
            console.log(`To: ${senderPhone}`);
            console.log(`Message: \n${replyMessage}`);
        }

        return NextResponse.json({ status: "success", handled: true });
    } catch (error) {
        console.error("Webhook Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode && token) {
        if (mode === "subscribe" && token === verifyToken) {
            console.log("WEBHOOK_VERIFIED");
            return new NextResponse(challenge, { status: 200 });
        }

        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: "Missing params" }, { status: 400 });
}
