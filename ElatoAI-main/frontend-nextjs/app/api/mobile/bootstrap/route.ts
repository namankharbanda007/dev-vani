import { NextResponse } from "next/server";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";
import { ensureMobileUser, getMobileGuideCatalog } from "../_lib";

export async function GET(request: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await ensureMobileUser(supabase, user);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const personalities = await getMobileGuideCatalog(supabase, user.id);

    return NextResponse.json({
        dbUser,
        personalities,
    });
}
