import { NextResponse } from 'next/server';
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";

export async function POST(req: Request) {
    const { user } = await getSupabaseForRouteAuth(req);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.NODE_ENV === "production" && process.env.ALLOW_MOCK_WALLET_RECHARGE !== "true") {
        return NextResponse.json(
            { error: "Wallet recharge is temporarily unavailable while payment verification is being configured." },
            { status: 503 }
        );
    }

    try {
        const body = await req.json();
        const amount = Number(body.amount);

        if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        console.log(`Creating test wallet order for ${user.id} - Amount: $${amount}`);

        // Replace this with a verified payment provider order before enabling public production checkout.

        const mockOrderId = `order_mock_${Date.now()}`;

        return NextResponse.json({
            success: true,
            orderId: mockOrderId,
            amount: amount,
            currency: "USD",
            key: "test_gateway_key"
        });

    } catch (error) {
        console.error("Wallet Order Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
