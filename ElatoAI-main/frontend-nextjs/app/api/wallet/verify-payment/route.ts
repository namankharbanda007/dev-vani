import { NextResponse } from 'next/server';
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";

export async function POST(req: Request) {
    // Note: If verifying webhooks, we'd use a service_role client. 
    // If the frontend calls this securely after payment, we can use the user's session.
    const { supabase, user } = await getSupabaseForRouteAuth(req);

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
        const { orderId, amount, paymentId, signature } = body;
        const numericAmount = Number(amount);

        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
        }

        console.log(`Verifying test wallet payment for ${user.id} - Order: ${orderId}, Amount: $${amount}`);

        // Replace this with provider signature verification before enabling public production checkout.
        const isSignatureValid = true;

        if (!isSignatureValid) {
            return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
        }

        // 1. Transaction Logic: We must update the Wallet Balance and Insert a Transaction Log Atomically.
        // We can use an RPC function or just two queries with service_role if we need bypass RLS, 
        // but user's own updates will work if RLS allows or we use an RPC.

        // To avoid RLS issues when incrementing safely, we should ideally call a simple RPC.
        // For simplicity in Next.js backend, let's use the DB's ability to update via supabase client securely.

        // A. Fetch current balance
        const { data: dbUser, error: fetchErr } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('user_id', user.id)
            .single();

        if (fetchErr || !dbUser) {
            throw new Error("Unable to fetch user wallet balance");
        }

        const newBalance = Number(dbUser.wallet_balance) + numericAmount;

        // B. Update Balance
        const { error: updateErr } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('user_id', user.id);

        if (updateErr) throw new Error("Failed to update wallet balance");

        // C. Log Transaction
        const { error: logErr } = await supabase
            .from('wallet_transactions')
            .insert({
                user_id: user.id,
                type: 'credit',
                amount: numericAmount,
                service_name: 'Wallet Recharge',
                status: 'completed'
            });

        if (logErr) throw new Error("Failed to log transaction");

        return NextResponse.json({
            success: true,
            newBalance: newBalance,
            message: "Wallet topped up successfully!"
        });

    } catch (error) {
        console.error("Wallet Verification Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
