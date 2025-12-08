import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import Image from "next/image";

interface LoginProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Login({ searchParams }: LoginProps) {
  const toy_id = searchParams?.toy_id as string | undefined;
  const personality_id = searchParams?.personality_id as string | undefined;

  const signInOrSignUp = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    // Try to sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If sign in succeeds, redirect to home
    if (!signInError) {
      return redirect("/home");
    }

    // If sign in fails, try to sign up
    const origin = headers().get("origin");
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          toy_id: toy_id,
          personality_id: personality_id,
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (signUpError) {
      return redirect(`/login?message=${signUpError.message}`);
    }

    return redirect("/login?message=Check email to continue sign in process");
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-purple-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/20 z-10" />
        <Image
          src="/login-hero.jpg"
          alt="SMART मूर्ति Family"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="text-4xl font-bold font-lora mb-4">Spirituality Meets Companionship</h2>
          <p className="text-lg text-gray-200 max-w-md">
            Join thousands of families discovering the magic of AI-powered spiritual guidance and companionship.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
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
            <form className="space-y-6">
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
                formAction={signInOrSignUp}
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                pendingText="Signing in..."
              >
                Sign In
              </SubmitButton>

              {searchParams?.message && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center animate-in fade-in slide-in-from-top-2">
                  {searchParams.message}
                </div>
              )}
            </form>
          </div>

          <p className="text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/login" className="font-bold text-purple-600 hover:text-purple-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
