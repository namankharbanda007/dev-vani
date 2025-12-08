import BuildDashboard from "@/app/components/CreateCharacter/BuildDashboard";
import { getAllLanguages } from "@/db/languages";
import { getUserById } from "@/db/users";
import { getOpenGraphMetadata } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { getPersonalityById } from "@/db/personalities";

export const metadata: Metadata = {
    title: "Settings",
    ...getOpenGraphMetadata("Settings"),
};

export default async function Home({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const dbUser = user ? await getUserById(supabase, user.id) : null;
    const allLanguages = await getAllLanguages(supabase);

    const editMode = searchParams?.edit === "true";
    const personalityId = searchParams?.id as string;
    let initialData = null;

    if (editMode && personalityId) {
        initialData = await getPersonalityById(supabase, personalityId);
    }

    return (
        <div className="pb-4 flex flex-col gap-2">
            {dbUser && (
                <BuildDashboard
                    selectedUser={dbUser}
                    allLanguages={allLanguages}
                    initialData={initialData}
                />
            )}
        </div>
    );
}
