import { type SupabaseClient, type User } from "@supabase/supabase-js";
import { createServiceClient } from "@/utils/supabase/service";

export const createUser = async (
    supabase: SupabaseClient,
    user: User,
    userProps: Partial<IUser>,
) => {
    console.log("=== CREATING USER ===");
    console.log("User ID:", user.id);
    console.log("User Email:", user.email);
    console.log("User Phone:", user.phone);
    console.log("User Metadata:", JSON.stringify(user.user_metadata, null, 2));
    console.log("User Props:", JSON.stringify(userProps, null, 2));

    // Use email if available, otherwise use phone number for phone-only authentication
    const identifier = user.email ?? (user.phone ? `${user.phone}@phone.com` : "") ?? "";

    const userToInsert = {
        user_id: user.id,
        email: identifier,  // Store phone number in email field if no email exists
        supervisor_name: user.user_metadata?.name ?? "",
        supervisee_name: "",
        supervisee_age: 14,
        supervisee_persona: "",
        personality_id: userProps.personality_id, // selecting default personality
        language_code: userProps.language_code ?? "en-US",
        session_time: 0,
        last_session_reset: null,
        is_premium: false,
        device_id: null,
        user_info: {
            user_type: "user",
            user_metadata: {}
        },
        avatar_url: user.user_metadata?.avatar_url ??
            `/user_avatar/user_avatar_${Math.floor(Math.random() * 10)
            }.png`,
    };

    console.log("Attempting to insert user:", JSON.stringify(userToInsert, null, 2));

    // Try to use service role client to bypass RLS, fallback to regular client if not available
    let clientToUse = supabase;
    try {
        if (process.env.SUPABASE_SERVICE_ROLE_KEY) {
            const serviceClient = createServiceClient();
            clientToUse = serviceClient;
            console.log("Using service role client for user creation");
        } else {
            console.log("Service role key not found, using regular client");
        }
    } catch (e) {
        console.log("Could not create service client, using regular client:", e);
    }

    const { data, error } = await clientToUse.from("users").insert([userToInsert as IUser]);

    if (error) {
        console.error("=== DATABASE ERROR ===");
        console.error("Error Message:", error.message);
        console.error("Error Details:", error.details);
        console.error("Error Hint:", error.hint);
        console.error("Error Code:", error.code);
        console.error("Full Error:", JSON.stringify(error, null, 2));

        // Return detailed error information
        return {
            error: `[DB-FAIL] ${error.message} (Code: ${error.code})`
        };
    }

    console.log("=== USER CREATED SUCCESSFULLY ===");
    console.log("Inserted data:", data);
    return { success: true };
};

export const getSimpleUserById = async (
    supabase: SupabaseClient,
    id: string,
) => {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", id)
        .single();

    if (error) {
        console.log("error in getSimpleUserById", error);
    }

    return data as IUser | undefined;
};

export const getUserById = async (supabase: SupabaseClient, id: string) => {
    const { data, error } = await supabase
        .from("users")
        .select(
            `*, personality:personality_id(*), device:devices!users_device_id_fkey(device_id, volume)`,
        )
        .eq("user_id", id)
        .single();

    if (error) {
        console.log("error in getUserById", error);
    }

    return data as IUser | undefined;
};

export const doesUserExist = async (
    supabase: SupabaseClient,
    authUser: User,
) => {
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

    if (error) {
        console.log("error in doesUserExist", error);
    }

    return !!user;
};

export const updateUser = async (
    supabase: SupabaseClient,
    user: Partial<IUser>,
    userId: string,
) => {
    const { error } = await supabase
        .from("users")
        .update(user)
        .eq("user_id", userId);
    if (error) {
        // console.log("error", error);
    }
};

export const updateUserUsage = async (
    supabase: SupabaseClient,
    userId: string,
    sessionTime: number
) => {
    const { error } = await supabase
        .from("users")
        .update({ session_time: sessionTime })
        .eq("user_id", userId);

    if (error) {
        console.error("Error updating user usage:", error);
    }
};

export const checkAndResetUsage = async (
    supabase: SupabaseClient,
    user: IUser
): Promise<IUser> => {
    const lastResetStr = user.last_session_reset;
    const now = new Date();
    let shouldReset = false;

    if (!lastResetStr) {
        shouldReset = true;
    } else {
        const lastReset = new Date(lastResetStr);
        const diffTime = Math.abs(now.getTime() - lastReset.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays >= 30) {
            shouldReset = true;
        }
    }

    if (shouldReset) {
        console.log(`Resetting usage for user ${user.user_id}`);
        const { data, error } = await supabase
            .from("users")
            .update({
                session_time: 0,
                last_session_reset: now.toISOString(),
            })
            .eq("user_id", user.user_id)
            .select()
            .single();

        if (error) {
            console.error("Error resetting usage:", error);
            return user;
        }

        return { ...user, ...data } as IUser;
    }

    return user;
};
