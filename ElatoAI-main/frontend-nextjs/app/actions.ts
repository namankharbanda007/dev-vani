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
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect("error", "/login", error.message);
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
    const apiKey = process.env.GEMINI_API_KEY!;
    if (!apiKey) {
        return { error: "GEMINI_API_KEY is not set" };
    }

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    instances: [
                        {
                            prompt: "A high quality, cartoon style character portrait of: " + prompt,
                        },
                    ],
                    parameters: {
                        sampleCount: 1,
                        aspectRatio: "1:1"
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();

            // If model not found, try to list available models to help debug
            if (response.status === 404) {
                try {
                    const listResponse = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
                    );
                    const listData = await listResponse.json();
                    const modelNames = listData.models ? listData.models.map((m: any) => m.name).join(", ") : "No models found";
                    throw new Error(`Gemini Model 404. Your API Key has access to: ${modelNames}. Original error: ${errorText}`);
                } catch (listError) {
                    // Fallback if list models also fails
                    throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
                }
            }

            throw new Error(`Gemini API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();

        let imageBase64;
        if (data.predictions && data.predictions.length > 0) {
            imageBase64 = data.predictions[0].bytesBase64Encoded;
        } else {
            throw new Error("No image generated by Gemini.");
        }

        return { data: imageBase64 };

    } catch (error: any) {
        console.error("Error generating image:", error);
        return { error: error.message || "Failed to generate image" };
    }
};
