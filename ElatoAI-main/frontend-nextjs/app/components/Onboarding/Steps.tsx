
"use client";

import { Progress } from "@/components/ui/progress";
import React from "react";
import GeneralUserForm from "../Settings/UserForm";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { updateUser } from "@/db/users";
import { Loader2 } from "lucide-react";
import { companyInfo } from "@/app/lib/company";

const Steps: React.FC<{
    selectedUser?: IUser;
    userId: string;
}> = ({ selectedUser, userId }) => {
    const supabase = createClient();
    const router = useRouter();
    const [progress, setProgress] = React.useState(50);
    const [step, setStep] = React.useState(1);

    const onClickFormCallback = async () => {
        setStep(step + 1);
        setProgress(progress + 50);
        router.push("/home");
    };

    const CurrentForm = () => {
        if (step === 1) {
            return (
                <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-xl">
                    <GeneralUserForm
                        selectedUser={selectedUser}
                        userId={userId}
                        onClickCallback={onClickFormCallback}
                        onSave={
                            async (values, userType) => {
                                await updateUser(
                                    supabase,
                                    {
                                        supervisee_age: values.supervisee_age,
                                        supervisee_name: values.supervisee_name,
                                        supervisee_persona: values.supervisee_persona,
                                        user_info: {
                                            user_type: userType,
                                            user_metadata: values,
                                        },
                                    },
                                    userId);
                            }}
                        disabled={false}
                    />
                </div>
            );
        } else {
            return <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto" />;
        }
    };

    let heading = `Let's get your ${companyInfo.brandName} account set up`;
    let subHeading =
        `We want to make sure that your ${companyInfo.brandName} experience is set up properly.`;

    if (step === 1) {
        {
            heading = "👋 Hello there!";
            subHeading =
                "Let's personalize your experience with some basic details.";
        }
    }

    return (
        <div className="max-w-xl flex-auto flex flex-col gap-6 px-1 font-quicksand mx-auto py-10">
            <div className="space-y-2 text-center">
                <Progress value={progress} className="h-3 bg-gray-100/50 [&>div]:bg-gradient-to-r [&>div]:from-purple-500 [&>div]:to-amber-500" />
                <p className="text-xs font-semibold text-amber-600 uppercase tracking-widest pt-2">Step {step} of 2</p>
            </div>

            <div className="text-center space-y-2 mb-4">
                <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-700 via-pink-600 to-amber-600 font-lora">
                    {heading}
                </h1>
                <p className="text-lg text-gray-600 font-medium max-w-md mx-auto leading-relaxed">
                    {subHeading}
                </p>
            </div>

            <CurrentForm />
        </div>
    );
};

export default Steps;
