import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function POST(req: Request) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { serviceName, isMeteredSessionStart } = body;

        if (!serviceName) {
            return NextResponse.json({ error: "Service name required" }, { status: 400 });
        }

        // 1. Fetch Service Pricing
        const { data: service, error: serviceErr } = await supabase
            .from('service_catalog')
            .select('price, type')
            .eq('name', serviceName)
            .single();

        if (serviceErr || !service) {
            return NextResponse.json({ error: "Service not found" }, { status: 404 });
        }

        const price = Number(service.price);

        // 2. Fetch User Balance
        const { data: dbUser, error: fetchErr } = await supabase
            .from('users')
            .select('wallet_balance')
            .eq('user_id', user.id)
            .single();

        if (fetchErr || !dbUser) {
            return NextResponse.json({ error: "Unable to fetch wallet balance" }, { status: 500 });
        }

        const currentBalance = Number(dbUser.wallet_balance);

        // 3. Deduction Logic
        if (service.type === 'metered' && isMeteredSessionStart) {
            // For metered (e.g., AI Calls/Chat), we just verify they have enough to start (e.g., 5 mins worth)
            const minimumRequired = price * 5; // e.g. 5 mins minimum buffer
            if (currentBalance < minimumRequired) {
                return NextResponse.json({
                    error: "insufficient_funds",
                    message: `Please top up your wallet. Minimum ₹${minimumRequired} required to start a metered session.`,
                    deficit: minimumRequired - currentBalance
                }, { status: 402 });
            }

            return NextResponse.json({ success: true, message: "Session authorized", currentBalance });
        }

        // Fixed Price OR Metered per-minute ongoing deduction
        if (currentBalance < price) {
            return NextResponse.json({
                error: "insufficient_funds",
                message: `Insufficient balance for ${serviceName}.`,
                deficit: price - currentBalance
            }, { status: 402 }); // 402 Payment Required
        }

        const newBalance = currentBalance - price;

        // 4. Execute Deduction
        const { error: updateErr } = await supabase
            .from('users')
            .update({ wallet_balance: newBalance })
            .eq('user_id', user.id);

        if (updateErr) throw new Error("Failed to deduct from wallet");

        // 5. Log Transaction
        const { error: logErr } = await supabase
            .from('wallet_transactions')
            .insert({
                user_id: user.id,
                type: 'debit',
                amount: price,
                service_name: serviceName,
                status: 'completed'
            });

        if (logErr) throw new Error("Failed to log transaction");

        return NextResponse.json({
            success: true,
            newBalance: newBalance,
            message: `${serviceName} deducted successfully.`
        });

    } catch (error) {
        console.error("Billing Deduction Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
