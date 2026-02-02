"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";
import { signInAction, startPhoneAuthAction, verifyPhoneAuthAction } from "@/app/actions";
import Link from "next/link";


interface LoginFormProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export function LoginForm({ searchParams }: LoginFormProps) {
    const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
    const [otpSent, setOtpSent] = useState(false);
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(
        (searchParams?.message as string) || (searchParams?.error as string) || null
    );
    const [message, setMessage] = useState<string | null>(null);

    const toy_id = searchParams?.toy_id as string | undefined;
    const personality_id = searchParams?.personality_id as string | undefined;

    const handlePhoneSubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        setMessage(null);

        const result = await startPhoneAuthAction(formData);

        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setOtpSent(true);
            setMessage("OTP sent via WhatsApp/SMS!");
        }
        setLoading(false);
    };

    const handleVerifySubmit = async (formData: FormData) => {
        setLoading(true);
        setError(null);
        // Add phone to formData since it's state-controlled
        formData.append("phone", phone);

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

            {/* Auth Method Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                    onClick={() => {
                        setAuthMethod("email");
                        setError(null);
                        setMessage(null);
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === "email"
                        ? "bg-white text-purple-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Email
                </button>
                <button
                    onClick={() => {
                        setAuthMethod("phone");
                        setError(null);
                        setMessage(null);
                    }}
                    className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMethod === "phone"
                        ? "bg-white text-purple-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                        }`}
                >
                    Phone
                </button>
            </div>

            <div className="space-y-6">
                {authMethod === "email" ? (
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
                                className="h-12 rounded-xl bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm font-medium text-purple-600 hover:text-purple-500 transition-colors"
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
                                className="h-12 rounded-xl bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                            />
                        </div>

                        <SubmitButton
                            formAction={signInAction}
                            className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                            pendingText="Signing in..."
                        >
                            Sign In
                        </SubmitButton>
                    </form>
                ) : (
                    <div className="space-y-6">
                        {!otpSent ? (
                            <form action={handlePhoneSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-gray-700 font-medium">Phone Number</Label>
                                    <p className="text-xs text-gray-500">Includes country code (e.g. +919876543210)</p>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+91 98765 43210"
                                        required
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="h-12 rounded-xl bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all"
                                    />
                                </div>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {loading ? "Sending OTP..." : "Send OTP"}
                                </button>
                            </form>
                        ) : (
                            <form action={handleVerifySubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="otp" className="text-gray-700 font-medium">Enter OTP</Label>
                                    <Input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        placeholder="123456"
                                        required
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="h-12 rounded-xl bg-white/50 border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 transition-all text-center tracking-widest text-lg"
                                    />
                                </div>
                                <button
                                    disabled={loading}
                                    type="submit"
                                    className="w-full h-12 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
                                >
                                    {loading ? "Verifying..." : "Verify OTP"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setOtpSent(false);
                                        setMessage(null);
                                        setError(null);
                                    }}
                                    className="w-full text-center text-sm text-gray-500 hover:text-purple-600 mt-2"
                                >
                                    Change Phone Number
                                </button>
                            </form>
                        )}
                    </div>
                )}

                {error && (
                    <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs text-left animate-in fade-in slide-in-from-top-2 max-h-48 overflow-y-auto">
                        <div className="font-bold mb-2">Database Error:</div>
                        <div className="font-mono break-words whitespace-pre-wrap">{error}</div>
                    </div>
                )}

                {message && (
                    <div className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm text-center animate-in fade-in slide-in-from-top-2">
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
