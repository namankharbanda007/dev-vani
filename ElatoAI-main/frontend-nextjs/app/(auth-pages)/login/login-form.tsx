"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";
import { signInAction, startPhoneAuthAction, verifyPhoneAuthAction } from "@/app/actions";
import Link from "next/link";


import GoogleLoginButton from "@/app/components/GoogleLoginButton";

interface LoginFormProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export function LoginForm({ searchParams }: LoginFormProps) {
    const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
    const [otpSent, setOtpSent] = useState(false);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);

    // Resend Timer State
    const [cooldown, setCooldown] = useState(0);

    const [error, setError] = useState<string | null>(
        (searchParams?.message as string) || (searchParams?.error as string) || null
    );
    const [message, setMessage] = useState<string | null>(null);

    const toy_id = searchParams?.toy_id as string | undefined;
    const personality_id = searchParams?.personality_id as string | undefined;

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (cooldown > 0) {
            interval = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [cooldown]);

    // Validation Helpers
    const validatePhone = (p: string) => {
        // E.164ish format: + followed by 10-15 digits
        const phoneRegex = /^\+[1-9]\d{10,14}$/;
        return phoneRegex.test(p.replace(/\s/g, '')); // Allow spaces in check but strip them
    };

    const friendlyError = (err: string) => {
        if (!err) return null;
        if (err.includes("[START-ERR]")) return "Unable to send SMS. Please check the number or try again later.";
        if (err.includes("[ACTION-ERR]")) return "Invalid OTP code. Please try again.";
        if (err.includes("Database error")) return "System is busy. Please try email login.";
        return err;
    };

    const handlePhoneSubmit = async (formData: FormData) => {
        setError(null);
        setMessage(null);

        const rawPhone = formData.get("phone") as string;
        const cleanPhone = rawPhone.replace(/\s/g, '');

        if (!validatePhone(cleanPhone)) {
            setError("Invalid phone format. Use country code (e.g., +919876543210)");
            return;
        }

        setLoading(true);
        // Update formData with clean phone
        formData.set("phone", cleanPhone);

        const result = await startPhoneAuthAction(formData);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setOtpSent(true);
            setMessage("OTP sent via WhatsApp/SMS!");
            setCooldown(30); // Start 30s cooldown
        }
        setLoading(false);
    };

    const handleResendOtp = async () => {
        if (cooldown > 0) return;
        setLoading(true);
        const formData = new FormData();
        formData.append("phone", phone);
        if (toy_id) formData.append("toy_id", toy_id);
        if (personality_id) formData.append("personality_id", personality_id);

        await handlePhoneSubmit(formData);
    };

    const handleVerifySubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        // Add phone to formData since it's state-controlled
        formData.append("phone", phone.replace(/\s/g, ''));

        const result = await verifyPhoneAuthAction(formData);

        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
        // If successful, the action redirects, so no need to stop loading
    };

    return (
        <div className="w-full max-w-md space-y-8 bg-white/70 backdrop-blur-lg p-8 rounded-3xl shadow-xl border border-white/50">
            <div className="text-center">
                <h1 className="text-4xl font-bold font-luckiestGuy tracking-wider text-purple-900 mb-2">
                    SMART मूर्ति
                </h1>
                <p className="text-gray-600">
                    Welcome back! Please login to continue.
                </p>
            </div>

            <div className="space-y-6">
                <GoogleLoginButton toy_id={toy_id} personality_id={personality_id} />

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-500 rounded-full">
                            Or continue with email
                        </span>
                    </div>
                </div>

                <form className="space-y-6">
                    {toy_id && <input type="hidden" name="toy_id" value={toy_id} />}
                    {personality_id && <input type="hidden" name="personality_id" value={personality_id} />}

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="you@example.com"
                            required
                            disabled={loading}
                            aria-describedby="email-error"
                            className="h-12 rounded-xl bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                            <Link
                                href="/forgot-password"
                                className={`text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors ${loading ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            required
                            disabled={loading}
                            className="h-12 rounded-xl bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                        />
                    </div>

                    <SubmitButton
                        formAction={signInAction}
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                        pendingText="Signing in..."
                    >
                        Sign In devotee
                    </SubmitButton>
                </form>

                {error && (
                    <div id="phone-error" role="alert" className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-left animate-in fade-in slide-in-from-top-2 max-h-48 overflow-y-auto">
                        <div className="font-bold mb-1">Error:</div>
                        <div className="break-words whitespace-pre-wrap">{friendlyError(error)}</div>
                    </div>
                )}

                {message && (
                    <div role="status" className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center animate-in fade-in slide-in-from-top-2">
                        {message}
                    </div>
                )}
            </div>

            <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
                <span className="text-gray-500">
                    (Sign up is automatic via Phone or Email)
                </span>
            </p>
        </div>
    );
}
