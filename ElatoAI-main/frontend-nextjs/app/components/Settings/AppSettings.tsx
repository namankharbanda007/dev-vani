"use client";

import { connectUserToDevice, signOutAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LogOut, Camera, Upload, Loader2, CheckCircle } from "lucide-react";

import GeneralUserForm from "./UserForm";
import { Slider } from "@/components/ui/slider";
import { updateUser } from "@/db/users";
import _ from "lodash";
import { createClient } from "@/utils/supabase/client";
import React, { useCallback, useRef, useState } from "react";
import { doesUserHaveADevice, updateDevice } from "@/db/devices";
import { useToast } from "@/components/ui/use-toast";
import UsageStats from "./UsageStats";
import Image from "next/image";

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

    // Profile photo upload state
    const [avatarUrl, setAvatarUrl] = useState(selectedUser.avatar_url);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handlePhotoUpload = async (file: File) => {
        if (!file) return;

        // Validate file
        if (!file.type.startsWith('image/')) {
            toast({ description: "Please select an image file.", variant: "destructive" });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            toast({ description: "Image must be under 5MB.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        setUploadSuccess(false);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${selectedUser.user_id}-${Date.now()}.${fileExt}`;
            const filePath = `profile-photos/${fileName}`;

            // Upload to Supabase Storage
            const { data, error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: true,
                });

            if (uploadError) {
                // If bucket doesn't exist, upload to public storage
                console.error("Upload error:", uploadError);
                toast({ description: `Upload failed: ${uploadError.message}`, variant: "destructive" });
                setIsUploading(false);
                return;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);

            // Update user's avatar_url in DB
            await updateUser(supabase, { avatar_url: publicUrl }, selectedUser.user_id);

            setAvatarUrl(publicUrl);
            setUploadSuccess(true);
            toast({ description: "Profile photo updated! 📸" });

            // Clear success state after a few seconds
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err: any) {
            toast({ description: `Upload failed: ${err?.message}`, variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) handlePhotoUpload(file);
    };

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
    }, 1000);

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

            {/* Profile Photo Section */}
            <section className="mb-8 pb-8 border-b border-gray-200/50">
                <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 pb-2 flex items-center gap-2 mb-4">
                    📷 Profile Photo
                </h2>
                <p className="text-xs text-gray-500 mb-4">
                    This photo will be shown in the navbar and can also be used for face reading features.
                </p>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Avatar Preview */}
                    <div className="relative group">
                        <div
                            className="w-28 h-28 rounded-full overflow-hidden border-4 border-purple-200 shadow-lg cursor-pointer transition-all hover:border-purple-400 hover:shadow-xl"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {avatarUrl ? (
                                <Image
                                    src={avatarUrl.startsWith('http') ? avatarUrl : avatarUrl.startsWith('/') ? avatarUrl : `/${avatarUrl}`}
                                    alt="Profile"
                                    width={112}
                                    height={112}
                                    className="w-full h-full object-cover"
                                    unoptimized
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-amber-400 flex items-center justify-center text-white text-3xl font-bold">
                                    {(selectedUser.supervisee_name || selectedUser.email || '?').charAt(0).toUpperCase()}
                                </div>
                            )}

                            {/* Overlay on hover */}
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Camera className="w-6 h-6 text-white" />
                            </div>
                        </div>

                        {/* Upload Status Badge */}
                        {isUploading && (
                            <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full p-1.5 shadow-md">
                                <Loader2 className="w-4 h-4 text-white animate-spin" />
                            </div>
                        )}
                        {uploadSuccess && (
                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 shadow-md">
                                <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Upload Area */}
                    <div
                        className="flex-1 w-full"
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                    >
                        <div
                            className="border-2 border-dashed border-purple-200 rounded-2xl p-6 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <Upload className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600 font-medium">
                                Click or drag a photo here
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                JPG, PNG or WebP • Max 5MB
                            </p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handlePhotoUpload(file);
                            }}
                        />
                    </div>
                </div>
            </section>

            <GeneralUserForm
                selectedUser={selectedUser}
                userId={selectedUser.user_id}
                heading={heading}
                onSave={onSave}
                onClickCallback={() => handleSave()}
            />

            <div className="mt-8">
                <UsageStats user={selectedUser} />
            </div>

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