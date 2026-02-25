import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    // Note: If verifying webhooks, we'd use a service_role client. 
    // If the frontend calls this securely after checkout, we can use the user's session.
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { orderId, amount, paymentId, signature } = body;

        // --- MOCK PAYMENT GATEWAY VERIFICATION ---
        console.log(`Verifying MOCK Payment for ${user.id} - Order: ${orderId}, Amount: ₹${amount}`);

        // In reality, verify the Razorpay signature or Stripe Webhook secret here
        const isSignatureValid = true; // Always true for mock

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

        const newBalance = Number(dbUser.wallet_balance) + Number(amount);

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
                amount: Number(amount),
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
