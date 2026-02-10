import { createUser, doesUserExist, getUserById } from "@/db/users";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Playground from "../components/Playground/PlaygroundComponent";
import { defaultPersonalityId, defaultToyId, HIDDEN_PERSONALITIES } from "@/lib/data";
import { getAllPersonalities, getMyPersonalities } from "@/db/personalities";


export const revalidate = 0; // disable cache for this route
export const dynamic = "force-dynamic";

export default async function Home() {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    if (user) {
        const userExists = await doesUserExist(supabase, user);
        // await supabase.auth.signOut();
        if (!userExists) {
            // Create user if they don't exist
            const result = await createUser(supabase, user, {
                personality_id:
                    user?.user_metadata?.personality_id ?? defaultPersonalityId,
                language_code: "en-US",
            });

            if (result?.error) {
                // If user creation failed, DO NOT redirect. Show error here.
                console.error("User creation failed in /home:", result.error);
                return (
                    <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-red-50 text-red-900">
                        <h1 className="text-2xl font-bold mb-4">Account Creation Failed</h1>
                        <p className="mb-4">We verified your number, but could not create your profile.</p>
                        <div className="bg-white p-4 rounded shadow font-mono text-sm border border-red-200 mb-6 max-w-lg overflow-auto">
                            {result.error}
                        </div>
                        <form action={async () => {
                            "use server";
                            const sb = createClient();
                            await sb.auth.signOut();
                            redirect("/login");
                        }}>
                            <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                                Sign Out & Try Again
                            </button>
                        </form>
                    </div>
                );
            }

            return (
                <div className="flex min-h-screen flex-col items-center justify-center p-8 bg-red-50 text-red-900">
                    <h1 className="text-2xl font-bold mb-4">Account Creation Failed</h1>
                    <p className="mb-4">We verified your number, but could not create your profile.</p>
                    <div className="bg-white p-4 rounded shadow font-mono text-sm border border-red-200 mb-6 max-w-lg overflow-auto">
                        {result.error}
                    </div>
                    <form action={async () => {
                        "use server";
                        const sb = createClient();
                        await sb.auth.signOut();
                        redirect("/login");
                    }}>
                        <button className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700">
                            Sign Out & Try Again
                        </button>
                    </form>
                </div>
            );
        }
    }

    const dbUser = await getUserById(supabase, user!.id);

    // If user exists but hasn't completed onboarding (missing supervisee_name), redirect to onboard
    if (dbUser && !dbUser.supervisee_name) {
        redirect("/onboard");
    }

    const rawPersonalities = await getAllPersonalities(supabase);
    // Filter out hidden personalities
    const allPersonalities = rawPersonalities.filter(p => !HIDDEN_PERSONALITIES.includes(p.title));
    const myPersonalities = await getMyPersonalities(supabase, user?.id ?? "");

    return (
        <div>
            {dbUser && (
                <Playground
                    allPersonalities={allPersonalities}
                    myPersonalities={myPersonalities}
                    currentUser={dbUser}
                />
            )}
        </div>
    );
}
