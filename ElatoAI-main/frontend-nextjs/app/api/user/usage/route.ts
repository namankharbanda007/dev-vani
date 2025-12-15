import { createClient } from "@/utils/supabase/server";
import { checkAndResetUsage, getUserById, updateUserUsage } from "@/db/users";
import { FREE_LIMIT_SECONDS, PREMIUM_LIMIT_SECONDS } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let dbUser = await getUserById(supabase, user.id);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse body for delta seconds
    const body = await request.json();
    const deltaSeconds = body.seconds || 0;

    // Check reset
    dbUser = await checkAndResetUsage(supabase, dbUser);

    // Check limit
    const limit = dbUser.is_premium ? PREMIUM_LIMIT_SECONDS : FREE_LIMIT_SECONDS;
    if (dbUser.session_time >= limit) {
        return NextResponse.json({
            status: "LIMIT_EXCEEDED",
            message: "Monthly limit reached"
        }, { status: 403 });
    }

    // Update usage
    // We add the delta to the current session time
    const newSessionTime = dbUser.session_time + deltaSeconds;

    // Check if new time exceeds limit (caught before next update, but good to check now)
    if (newSessionTime > limit) {
        // Cap it or just allow the small overflow? 
        // Let's mark as exceeded for the client to stop
        await updateUserUsage(supabase, dbUser.user_id, limit); // Cap at limit
        return NextResponse.json({
            status: "LIMIT_EXCEEDED",
            message: "Monthly limit reached"
        }, { status: 403 });
    }

    await updateUserUsage(supabase, dbUser.user_id, newSessionTime);

    return NextResponse.json({ status: "OK", remaining: limit - newSessionTime });
}
