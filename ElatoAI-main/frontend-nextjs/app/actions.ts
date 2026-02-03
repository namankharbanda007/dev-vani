"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { addUserToDevice, dbCheckUserCode } from "@/db/devices";
import { getSimpleUserById } from "@/db/users";

export async function deleteUserApiKey(userId: string) {
    const supabase = createClient();
    const { error } = await supabase.from("api_keys").delete().eq(
        "user_id",
        userId,
    );
    return error;
}

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const toy_id = formData.get("toy_id") as string | undefined;
    const personality_id = formData.get("personality_id") as string | undefined;
    const supabase = createClient();

    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (!signInError) {
        return redirect("/home");
    }

    // If sign in fails, try to sign up
    const origin = headers().get("origin");
    const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                toy_id: toy_id,
                personality_id: personality_id,
            },
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (signUpError) {
        return encodedRedirect("error", "/login", signUpError.message);
    }

    return encodedRedirect(
        "success",
        "/login",
        "Check email to continue sign in process",
    );
};

export const startPhoneAuthAction = async (formData: FormData) => {
    const phone = formData.get("phone") as string;
    const toy_id = formData.get("toy_id") as string | undefined;
    const personality_id = formData.get("personality_id") as string | undefined;
    const supabase = createClient();

    if (!phone) {
        return { error: "Phone number is required" };
    }

    const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
            data: {
                toy_id,
                personality_id,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
};

export const verifyPhoneAuthAction = async (formData: FormData) => {
    const phone = formData.get("phone") as string;
    const token = formData.get("otp") as string;
    const supabase = createClient();

    if (!phone || !token) {
        return { error: "Phone and OTP are required" };
    }

});

if (error) {
    console.error("verifyOtp failed:", error);
    return { error: `[ACTION-ERR] ${error.message}` };
}

return redirect("/home");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = createClient();
    const origin = headers().get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Email is required",
        );
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo:
            `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect(
            "error",
            "/forgot-password",
            "Could not reset password",
        );
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a link to reset your password.",
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password and confirm password are required",
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Passwords do not match",
        );
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password update failed",
        );
    }

    encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    return redirect("/login");
};

export const checkDoctorAction = async (authCode: string) => {
    return authCode === "kiwi-subtle-emu";
};

export const connectUserToDevice = async (
    userId: string,
    userDeviceCode: string,
) => {
    const supabase = createClient();

    const isCodeValid = await dbCheckUserCode(supabase, userDeviceCode.trim());
    if (!isCodeValid) {
        return false;
    }

    // if user code is valid, add user to device
    const successfullyAdded = await addUserToDevice(
        supabase,
        userDeviceCode,
        userId,
    );
    return successfullyAdded;
};

export const fetchGithubStars = async (repo: string) => {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo}`, {
            headers: {
                Accept: "application/vnd.github.v3+json",
            },
            next: {
                revalidate: 3600,
            },
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.statusText}`);
        }

        const data = await response.json();
        return {
            stars: data.stargazers_count,
            error: null,
        };
    } catch (error) {
        console.error("Error fetching GitHub stats:", error);
        return {
            stars: null,
            error: "Failed to load GitHub stats",
        };
    }
};

export const isPremiumUser = async (userId: string) => {
    const supabase = createClient();
    const dbUser = await getSimpleUserById(supabase, userId);
    return dbUser?.is_premium;
};

export const updatePersonalityAction = async (
    personalityId: string,
    updates: any
) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: "User not authenticated" };
    }

    // Verify ownership
    const { data: existing, error: fetchError } = await supabase
        .from("personalities")
        .select("creator_id")
        .eq("personality_id", personalityId)
        .single();

    if (fetchError || !existing) {
        return { error: "Personality not found or access denied" };
    }

    if (existing.creator_id !== user.id) {
        return { error: "Unauthorized: You do not own this character" };
    }

    // Filter updates
    const allowedUpdates = {
        title: updates.title,
        character_prompt: updates.character_prompt,
        oai_voice: updates.oai_voice,
        voice_prompt: updates.voice_prompt,
        short_description: updates.short_description,
        pitch_factor: updates.pitch_factor,
        first_message_prompt: updates.first_message_prompt,
        provider: updates.provider,
        subtitle: updates.subtitle, // repurposed for image_url
    };

    const { data, error } = await supabase
        .from("personalities")
        .update(allowedUpdates)
        .eq("personality_id", personalityId)
        .select();

    if (error) {
        return { error: error.message };
    }

    if (!data || data.length === 0) {
        return {
            error: "Update rejected by database. This usually means an RLS (Row Level Security) policy for UPDATE is missing in Supabase. Please add a policy for the 'personalities' table allowing UPDATE where 'auth.uid() = creator_id'."
        };
    }

    return { data: data[0] };
};

export const generateCharacterImageAction = async (prompt: string) => {
    // Using Pollinations.ai as a free alternative
    const encodedPrompt = encodeURIComponent(prompt + " cartoon style, high quality, portrait");
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&seed=${Math.floor(Math.random() * 1000)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error(`Pollinations API Error: ${response.status} ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const imageBase64 = buffer.toString('base64');

        return { data: imageBase64 };

    } catch (error: any) {
        console.error("Error generating image:", error);
        return { error: error.message || "Failed to generate image" };
    }
};
