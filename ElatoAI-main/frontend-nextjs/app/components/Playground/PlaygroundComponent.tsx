"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { updateUser } from "@/db/users";
import _ from "lodash";
import HomePageSubtitles from "../HomePageSubtitles";
import PersonalityFilters from "./PersonalityFilters";
import { TranscriptProvider } from "../Realtime/contexts/TranscriptContext";
import { EventProvider } from "../Realtime/contexts/EventContext";
import App from "../Realtime/App";
import { defaultPersonalityId } from "@/lib/data";
import UserPersonalities from "./UserPersonalities";

interface PlaygroundProps {
    currentUser: IUser;
    allPersonalities: IPersonality[];
    myPersonalities: IPersonality[];
}

const Playground: React.FC<PlaygroundProps> = ({
    currentUser,
    allPersonalities,
    myPersonalities,
}) => {
    const isDoctor = currentUser.user_info.user_type === "doctor";

    const supabase = createClient();

    const [personalityIdState, setPersonalityIdState] = useState<string>(
        currentUser.personality!.personality_id ?? defaultPersonalityId // Initial value from props
    );

    const [selectedFilters, setSelectedFilters] = useState<PersonalityFilter[]>(
        []
    );

    const onPersonalityPicked = async (personalityIdPicked: string) => {
        setPersonalityIdState(personalityIdPicked);
        await updateUser(
            supabase,
            {
                personality_id: personalityIdPicked,
            },
            currentUser.user_id
        );
    };

    return (
        <div className="flex flex-col min-h-[calc(100vh-80px)] p-6 md:p-10 max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col w-full gap-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 tracking-tight">
                            Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-amber-600">Friend</span>
                        </h1>
                        <p className="text-lg text-gray-600 font-medium">
                            Continue your spiritual journey or start a new conversation.
                        </p>
                    </div>

                    {/* Active Conversation Area - Integrated */}
                    <div className="glass-card p-1 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                        <TranscriptProvider>
                            <EventProvider>
                                <App personalityIdState={personalityIdState} isDoctor={isDoctor} userId={currentUser.user_id} />
                            </EventProvider>
                        </TranscriptProvider>
                    </div>
                </div>

                {/* Subtitles / Status */}
                <div className="w-full">
                    <HomePageSubtitles
                        user={currentUser}
                        page="home"
                        languageCode={'en-US'}
                    />
                </div>

                {/* Personalities Grid */}
                <div className="flex flex-col gap-6 mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h2 className="text-2xl font-bold text-gray-800 font-lora">Your Avatars</h2>
                        </div>
                        <PersonalityFilters
                            setSelectedFilters={setSelectedFilters}
                            selectedFilters={selectedFilters}
                            languageState={'en-US'}
                            currentUser={currentUser}
                        />
                    </div>

                    <UserPersonalities
                        selectedFilters={selectedFilters}
                        onPersonalityPicked={onPersonalityPicked}
                        personalityIdState={personalityIdState}
                        languageState={'en-US'}
                        disableButtons={false}
                        allPersonalities={isDoctor
                            ? allPersonalities.filter(p => p.is_story || p.is_doctor)
                            : allPersonalities}
                        myPersonalities={myPersonalities}
                    />
                </div>
            </div>
        </div>
    );
};

export default Playground;