import { NextResponse } from "next/server";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";
import { ensureMobileUser } from "../../_lib";

export async function POST(request: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await ensureMobileUser(supabase, user);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json().catch(() => null);
    const amount = Number(body?.amount);

    if (!amount || amount < 10) {
        return NextResponse.json({ error: "Enter a valid amount of at least Rs. 10." }, { status: 400 });
    }

    const currentBalance = Number((dbUser as IUser & { wallet_balance?: number | null }).wallet_balance ?? 0);
    const newBalance = currentBalance + amount;

    const { error: updateError } = await supabase
        .from("users")
        .update({ wallet_balance: newBalance })
        .eq("user_id", user.id);

    if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 400 });
    }

    const { error: transactionError } = await supabase.from("wallet_transactions").insert({
        user_id: user.id,
        type: "credit",
        amount,
        service_name: "Wallet Recharge",
        status: "completed",
    });

    if (transactionError) {
        console.warn("Wallet transaction insert failed", transactionError.message);
    }

    return NextResponse.json({ success: true, newBalance });
}
