import { NextResponse } from "next/server";
import { createServiceClient } from "@/utils/supabase/service";
import { getSupabaseForRouteAuth } from "@/utils/supabase/route-auth";
import { ensureMobileUser } from "../_lib";

function inferExtension(mimeType: string | null) {
    if (!mimeType) return "jpg";
    const ext = mimeType.split("/")[1] || "jpg";
    return ext.replace("jpeg", "jpg");
}

export async function POST(request: Request) {
    const { supabase, user } = await getSupabaseForRouteAuth(request);

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await ensureMobileUser(supabase, user);
    if (!dbUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
        return NextResponse.json({ error: "Image file is required" }, { status: 400 });
    }

    const extension = inferExtension(file.type || null);
    const filePath = `profile-photos/${user.id}-${Date.now()}.${extension}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    let uploader = supabase;
    try {
        uploader = createServiceClient();
    } catch {
        uploader = supabase;
    }

    const { error: uploadError } = await uploader.storage
        .from("avatars")
        .upload(filePath, bytes, {
            contentType: file.type || "image/jpeg",
            upsert: true,
        });

    if (uploadError) {
        return NextResponse.json({ error: uploadError.message }, { status: 400 });
    }

    const avatarUrl = uploader.storage.from("avatars").getPublicUrl(filePath).data.publicUrl;

    const { error: profileError } = await supabase
        .from("users")
        .update({ avatar_url: avatarUrl })
        .eq("user_id", user.id);

    if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, avatarUrl });
}
