"use client";

import { type FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { LockKeyhole, ArrowRight } from "lucide-react";

export default function AdminLoginForm() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const { error: loginError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        setLoading(false);

        if (loginError) {
            setError(loginError.message);
            return;
        }

        window.location.assign("/admin");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                </div>
            ) : null}

            <div>
                <label className="mb-2 block text-sm font-semibold text-[#5f4a36]">Admin email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    autoComplete="email"
                    className="h-12 w-full rounded-xl border border-[#E8D6B8] bg-white px-4 font-medium text-[#1F1711] outline-none transition focus:border-[#C86B1F] focus:ring-4 focus:ring-[#C86B1F]/10"
                    placeholder="you@smartmurti.com"
                />
            </div>

            <div>
                <label className="mb-2 block text-sm font-semibold text-[#5f4a36]">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-[#E8D6B8] bg-white px-4 font-medium text-[#1F1711] outline-none transition focus:border-[#C86B1F] focus:ring-4 focus:ring-[#C86B1F]/10"
                    placeholder="Enter your password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#1F1711] px-5 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:hover:translate-y-0"
            >
                <LockKeyhole className="h-4 w-4" />
                {loading ? "Checking access..." : "Open Admin"}
                {!loading ? <ArrowRight className="h-4 w-4" /> : null}
            </button>
        </form>
    );
}
