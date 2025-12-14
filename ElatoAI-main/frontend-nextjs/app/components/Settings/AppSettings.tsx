"use client";

import { connectUserToDevice, signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogOut } from "lucide-react";

import GeneralUserForm from "./UserForm";
import { Slider } from "@/components/ui/slider";
import { updateUser } from "@/db/users";
import _ from "lodash";
import { createClient } from "@/utils/supabase/client";
import React, { useCallback } from "react";
import { doesUserHaveADevice, updateDevice } from "@/db/devices";
import { useToast } from "@/components/ui/use-toast";

interface AppSettingsProps {
    selectedUser: IUser;
    heading: React.ReactNode;
}

const skipDeviceRegistration = process.env.NEXT_PUBLIC_SKIP_DEVICE_REGISTRATION === "True";


const AppSettings: React.FC<AppSettingsProps> = ({
    selectedUser,
    heading,
}) => {
    const supabase = createClient();
    const { toast } = useToast();
    const [isConnected, setIsConnected] = React.useState(false);
    const doctorFormRef = React.useRef<{ submitForm: () => void } | null>(null);
    const userFormRef = React.useRef<{ submitForm: () => void } | null>(null);
    const [deviceCode, setDeviceCode] = React.useState("");
    const [error, setError] = React.useState("");

    const handleSave = () => {
        if (selectedUser.user_info.user_type === "doctor") {
            doctorFormRef.current?.submitForm();
        } else {
            userFormRef.current?.submitForm();
        }
    };

    const checkIfUserHasDevice = useCallback(async () => {
        setIsConnected(
            await doesUserHaveADevice(supabase, selectedUser.user_id)
        );
    }, [selectedUser.user_id, supabase]);

    React.useEffect(() => {
        checkIfUserHasDevice();
    }, [checkIfUserHasDevice]);


    const [volume, setVolume] = React.useState([
        selectedUser.device?.volume ?? 50,
    ]);

    const debouncedUpdateVolume = _.debounce(async () => {
        if (selectedUser.device?.device_id) {
            await updateDevice(
                supabase,
                { volume: volume[0] },
                selectedUser.device.device_id
            );
        }
    }, 1000); // Adjust the debounce delay as needed

    const updateVolume = (value: number[]) => {
        setVolume(value);
        debouncedUpdateVolume();
    };

    const onSave = async (values: any, userType: "doctor" | "user", userId: string) => {

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
        toast({
            description: "Your prefereces have been saved!",
        });
    }

    return (
        <div className="glass-card p-8 rounded-3xl shadow-xl border border-white/50 bg-white/40 backdrop-blur-md max-w-4xl mx-auto">
            <GeneralUserForm
                selectedUser={selectedUser}
                userId={selectedUser.user_id}
                heading={heading}
                onSave={onSave}
                onClickCallback={() => handleSave()}
            />

            <div className="space-y-6 mt-12 pt-8 border-t border-gray-200/50">
                <h2 className="text-xl font-bold font-lora text-gray-800 flex items-center gap-2">
                    Device Settings
                </h2>
                {skipDeviceRegistration && <div className="flex flex-col text-purple-500 text-xs gap-2">You don't need to register your device because NEXT_PUBLIC_SKIP_DEVICE_REGISTRATION is set to True.</div>}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-row items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700">
                                Register your device
                            </Label>
                            <div
                                className={`rounded-full flex-shrink-0 h-2 w-2 ${isConnected ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500'
                                    }`}
                            />

                        </div>

                        <div className="flex flex-row items-center gap-3 mt-1">
                            <Input
                                value={deviceCode}
                                disabled={isConnected || skipDeviceRegistration}
                                onChange={(e) => setDeviceCode(e.target.value)}
                                placeholder={isConnected ? "**********" : "Enter your device code"}
                                maxLength={100}
                                className="bg-white/50 border-gray-200 focus:ring-purple-500 rounded-xl"
                            />
                            <Button
                                size="sm"
                                variant={isConnected ? "outline" : "default"}
                                className={isConnected ? "" : "bg-purple-600 hover:bg-purple-700 text-white rounded-xl"}
                                disabled={isConnected || skipDeviceRegistration}
                                onClick={async () => {
                                    const result = await connectUserToDevice(selectedUser.user_id, deviceCode);
                                    if (!result) {
                                        setError("Error registering device");
                                    }
                                    checkIfUserHasDevice();
                                }}
                            >
                                {isConnected ? "Linked" : "Register"}
                            </Button>
                        </div>
                        <p className="text-xs text-gray-500 pl-1">
                            {isConnected ? <span className="font-medium text-green-600">Successfully registered!</span> :
                                error ? <span className="text-red-500">{error}.</span> :
                                    "Enter the code displayed on your device screen."
                            }
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <Label className="text-sm font-medium text-gray-700">
                            Logged in as
                        </Label>
                        <Input
                            // autoFocus
                            disabled
                            value={selectedUser?.email}
                            className="bg-gray-50/50 border-gray-200 text-gray-600 rounded-xl"
                            autoComplete="on"
                            style={{
                                fontSize: 16,
                            }}
                        />
                    </div>
                    {isConnected && <div className="flex flex-col gap-4 mt-2 p-4 bg-purple-50/50 rounded-2xl border border-purple-100">
                        <Label className="text-sm font-medium text-gray-800">
                            Device Volume
                        </Label>
                        <div className="flex flex-row gap-4 items-center flex-nowrap">
                            <Slider
                                value={volume}
                                onValueChange={updateVolume}
                                className="flex-1"
                                defaultValue={[50]}
                                max={100}
                                min={1}
                                step={1}
                            />
                            <span className="text-purple-700 font-bold bg-white px-2 py-1 rounded-lg text-sm w-12 text-center">{volume}%</span>
                        </div>
                    </div>}
                    <form
                        action={signOutAction}
                        className="flex flex-row justify-end mt-8"
                    >
                        <Button
                            variant="destructive"
                            size="default"
                            className="font-medium flex flex-row items-center rounded-xl gap-2 shadow-sm hover:shadow-md transition-all px-6"
                        >
                            <LogOut size={16} strokeWidth={2} />
                            <span>Sign Out</span>
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AppSettings;