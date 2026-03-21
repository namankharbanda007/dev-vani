import { NextResponse } from 'next/server';
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";

export async function POST(req: Request) {
    const { user } = await getSupabaseForRouteAuth(req);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const amount = Number(body.amount);

        if (!amount || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        // --- MOCK PAYMENT GATEWAY ORDER CREATION ---
        console.log(`Creating MOCK Payment Order for ${user.id} - Amount: ₹${amount}`);

        // In a real app with Razorpay/Stripe, you would call their API here to generate an order ID
        // const order = await razorpay.orders.create({ amount: amount * 100, currency: "INR" });

        const mockOrderId = `order_mock_${Date.now()}`;

        return NextResponse.json({
            success: true,
            orderId: mockOrderId,
            amount: amount,
            currency: "INR",
            key: "mock_gateway_key_123" // The public key for your frontend SDK
        });

    } catch (error) {
        console.error("Wallet Order Creation Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
