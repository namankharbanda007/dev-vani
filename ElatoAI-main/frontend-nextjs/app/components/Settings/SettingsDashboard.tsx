"use client";

import React, { useState } from "react";
import HomePageSubtitles from "../HomePageSubtitles";
import AppSettings from "./AppSettings";
import { updateUser } from "@/db/users";
import { createClient } from "@/utils/supabase/client";
import PickLanguage from "../Playground/PickLanguage";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

interface SettingsDashboardProps {
    selectedUser: IUser;
    allLanguages: ILanguage[];
}

const SettingsDashboard: React.FC<SettingsDashboardProps> = ({
    selectedUser,
    allLanguages,
}) => {
    const supabase = createClient();

    const [languageState, setLanguageState] = useState<string>(
        selectedUser.language_code! // Initial value from props
    );


    const onLanguagePicked = async (languagePicked: string) => {
        setLanguageState(languagePicked);
        await updateUser(
            supabase,
            {
                language_code: languagePicked,
            },
            selectedUser.user_id
        );
    };

    const LanguagePicker = () => {
        return (
            <PickLanguage
                onLanguagePicked={onLanguagePicked}
                allLanguages={allLanguages}
                languageState={languageState}
                isDisabled={false}
            />
        )
    }

    const Heading = () => {
        return (
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 tracking-tight">
                            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600">Settings</span>
                        </h1>
                        <p className="text-lg text-gray-600 font-medium">
                            Manage language preferences and user details.
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/60 shadow-sm">
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50">
                                    <Info size={18} className="text-gray-500" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-4 rounded-xl shadow-lg border-none bg-white/90 backdrop-blur-xl">
                                <div className="text-sm text-gray-600 font-medium">
                                    The AI model will use this language as your character&apos;s default language.
                                </div>
                            </PopoverContent>
                        </Popover>
                        <LanguagePicker />
                    </div>
                </div>
                <HomePageSubtitles user={selectedUser} page="settings" />
            </div>
        );
    };

    return (
        <div className="overflow-hidden pb-2 w-full flex-auto flex flex-col px-1">
            <AppSettings
                heading={<Heading />}
                selectedUser={selectedUser}
            />
        </div>
    );
};

export default SettingsDashboard;
