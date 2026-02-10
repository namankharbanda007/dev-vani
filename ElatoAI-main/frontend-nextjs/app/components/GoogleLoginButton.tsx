"use client";

import { FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { defaultPersonalityId, defaultToyId } from "@/lib/data";

interface GoogleLoginButtonProps {
    toy_id?: string;
    personality_id?: string;
    text?: string;
}

export const loginWithGoogle = async (
    toy_id: string,
    personality_id: string
) => {
    const supabase = createClient();

    const redirectTo = `${location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
            redirectTo,
            queryParams: {
                toy_id,
                personality_id,
            },
        },
    });
};

export default function GoogleLoginButton({
    toy_id,
    personality_id,
    text = "Continue with Google"
}: GoogleLoginButtonProps) {
    // console.log("1324355345435", toy_id);
    return (
        <Button
            variant="outline"
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 relative overflow-hidden group"
            onClick={() =>
                loginWithGoogle(
                    toy_id ?? defaultToyId,
                    personality_id ?? defaultPersonalityId
                )
            }
        >
            <FaGoogle className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-base">{text}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </Button>
    );
}
