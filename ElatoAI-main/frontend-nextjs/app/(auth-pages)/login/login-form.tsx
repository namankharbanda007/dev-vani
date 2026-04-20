"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "./submit-button";
import { signInAction, signUpAction } from "@/app/actions";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GoogleLoginButton from "@/app/components/GoogleLoginButton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface LoginFormProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export function LoginForm({ searchParams }: LoginFormProps) {
    const [loading, setLoading] = useState(false);
    const error = (searchParams?.message as string) || (searchParams?.error as string) || null;
    const message = (searchParams?.success as string) || null;

    const toy_id = searchParams?.toy_id as string | undefined;
    const personality_id = searchParams?.personality_id as string | undefined;

    const friendlyError = (err: string) => {
        if (!err) return null;
        if (err.includes("Database error")) return "System is busy. Please try again.";
        return err;
    };

    return (
        <div className="w-full max-w-[450px]">
            <Card className="overflow-hidden rounded-[32px] border border-[#eadfcf] bg-white/88 shadow-[0_24px_70px_rgba(92,67,37,0.14)] backdrop-blur-xl">
                <CardHeader className="text-center pb-2 pt-8">
                    <h1 className="mb-2 font-lora text-4xl font-bold tracking-tight text-[#24170f]">
                        SMART मूर्ति
                    </h1>
                    <p className="text-sm font-medium uppercase tracking-[0.22em] text-[#b07229]">
                        Start with Smart Pandit
                    </p>
                </CardHeader>

                <Tabs defaultValue="login" className="w-full">
                    <div className="px-8 mb-6">
                        <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl border border-[#eadfcf] bg-[#f7efe3] p-1">
                            <TabsTrigger
                                value="login"
                                className="rounded-xl text-sm font-bold text-[#7f6a55] data-[state=active]:bg-white data-[state=active]:text-[#24170f] data-[state=active]:shadow-sm transition-all"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="rounded-xl text-sm font-bold text-[#7f6a55] data-[state=active]:bg-white data-[state=active]:text-[#24170f] data-[state=active]:shadow-sm transition-all"
                            >
                                Sign Up
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <CardContent className="px-8 pb-8 space-y-6">
                        <TabsContent value="login" className="space-y-6 mt-0 animate-in fade-in slide-in-from-left-4 duration-300">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-[#24170f]">Welcome back</h2>
                                <p className="mt-1 text-sm text-[#7a6651]">Return to one calm front door for guidance, puja, and family support.</p>
                            </div>

                            <GoogleLoginButton
                                toy_id={toy_id}
                                personality_id={personality_id}
                                text="Sign in with Google"
                            />

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/0 px-3 text-gray-400 font-medium">
                                        or using email
                                    </span>
                                </div>
                            </div>

                            <form className="space-y-5">
                                {toy_id && <input type="hidden" name="toy_id" value={toy_id} />}
                                {personality_id && <input type="hidden" name="personality_id" value={personality_id} />}

                                <div className="space-y-2">
                                    <Label htmlFor="email-login" className="text-gray-700 font-bold text-sm ml-1">Email Address</Label>
                                    <Input
                                        id="email-login"
                                        name="email"
                                        type="email"
                                        placeholder="devotee@smartmurti.com"
                                        required
                                        disabled={loading}
                                        className="h-12 rounded-xl border-[#eadfcf] bg-white/70 font-medium transition-all focus:border-[#d8a257] focus:ring-4 focus:ring-[#d8a257]/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between ml-1">
                                        <Label htmlFor="password-login" className="text-gray-700 font-bold text-sm">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-xs font-semibold text-[#b07229] transition-colors hover:text-[#9e6526]"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password-login"
                                        name="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        required
                                        disabled={loading}
                                        className="h-12 rounded-xl border-[#eadfcf] bg-white/70 font-medium transition-all focus:border-[#d8a257] focus:ring-4 focus:ring-[#d8a257]/10"
                                    />
                                </div>

                                <SubmitButton
                                    formAction={signInAction}
                                    disabled={loading}
                                    className="h-12 w-full rounded-xl bg-gradient-to-r from-[#c86b1f] to-[#9f5520] text-lg font-bold text-white shadow-lg shadow-[#9f5520]/20 transition-all hover:-translate-y-0.5 hover:from-[#b6611c] hover:to-[#8f4b1b] hover:shadow-xl hover:shadow-[#9f5520]/30"
                                    pendingText="Logging in..."
                                >
                                    Login
                                </SubmitButton>
                            </form>
                        </TabsContent>

                        <TabsContent value="signup" className="space-y-6 mt-0 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-[#24170f]">Begin with Smart Pandit</h2>
                                <p className="mt-1 text-sm text-[#7a6651]">Create your account and start with live spiritual guidance that feels personal and immediate.</p>
                            </div>

                            <GoogleLoginButton
                                toy_id={toy_id}
                                personality_id={personality_id}
                                text="Sign up with Google"
                            />

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-gray-200" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white/0 px-3 text-gray-400 font-medium">
                                        or create with email
                                    </span>
                                </div>
                            </div>

                            <form className="space-y-5">
                                {toy_id && <input type="hidden" name="toy_id" value={toy_id} />}
                                {personality_id && <input type="hidden" name="personality_id" value={personality_id} />}

                                <div className="space-y-2">
                                    <Label htmlFor="email-signup" className="text-gray-700 font-bold text-sm ml-1">Email Address</Label>
                                    <Input
                                        id="email-signup"
                                        name="email"
                                        type="email"
                                        placeholder="devotee@smartmurti.com"
                                        required
                                        disabled={loading}
                                        className="h-12 rounded-xl border-[#eadfcf] bg-white/70 font-medium transition-all focus:border-[#d8a257] focus:ring-4 focus:ring-[#d8a257]/10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password-signup" className="text-gray-700 font-bold text-sm ml-1">Create Password</Label>
                                    <Input
                                        id="password-signup"
                                        name="password"
                                        type="password"
                                        placeholder="Create a password"
                                        required
                                        minLength={6}
                                        disabled={loading}
                                        className="h-12 rounded-xl border-[#eadfcf] bg-white/70 font-medium transition-all focus:border-[#d8a257] focus:ring-4 focus:ring-[#d8a257]/10"
                                    />
                                    <p className="text-xs text-gray-500 ml-1">Must be at least 6 characters</p>
                                </div>

                                <SubmitButton
                                    formAction={signUpAction}
                                    disabled={loading}
                                    className="h-12 w-full rounded-xl bg-gradient-to-r from-[#c86b1f] to-[#9f5520] text-lg font-bold text-white shadow-lg shadow-[#9f5520]/20 transition-all hover:-translate-y-0.5 hover:from-[#b6611c] hover:to-[#8f4b1b] hover:shadow-xl hover:shadow-[#9f5520]/30"
                                    pendingText="Creating account..."
                                >
                                    Create Account
                                </SubmitButton>
                            </form>
                        </TabsContent>

                        {error && (
                            <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm animate-in fade-in slide-in-from-top-2 flex items-start gap-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                <div className="break-words whitespace-pre-wrap font-medium">{friendlyError(error)}</div>
                            </div>
                        )}

                        {message && (
                            <div role="status" className="p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm text-center animate-in fade-in slide-in-from-top-2 font-medium">
                                {message}
                            </div>
                        )}
                    </CardContent>
                </Tabs>

                <div className="border-t border-[#efe3d2] bg-[#fff8ef] p-4 text-center">
                    <p className="mx-auto max-w-xs text-xs text-[#8a7763]">
                        By continuing, you agree to our Terms of Service and Privacy Policy.
                    </p>
                </div>
            </Card>
        </div>
    );
}
