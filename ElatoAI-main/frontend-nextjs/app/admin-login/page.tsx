import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import AdminLoginForm from "./AdminLoginForm";
import BrandLogo from "@/app/components/brand/BrandLogo";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (isAdminEmail(user?.email)) {
        redirect("/admin");
    }

    return (
        <div className="min-h-screen bg-[#FBF5EA] px-4 py-10 text-[#1F1711]">
            <div className="mx-auto grid min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
                <section>
                    <BrandLogo size="md" className="mb-6 flex" />
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.24em] text-[#C86B1F]">
                        Owner access
                    </p>
                    <h1 className="max-w-xl font-lora text-5xl font-bold leading-tight md:text-6xl">
                        Smart Murti admin console
                    </h1>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-[#6A4A2C]">
                        A separate login for wallet movement, inbound interest, user activity, and service health. Access is limited to emails configured in admin settings.
                    </p>
                </section>

                <section className="rounded-[28px] border border-[#E8D6B8] bg-[#FFFDF8] p-6 shadow-[0_24px_70px_rgba(92,67,37,0.14)] md:p-8">
                    <div className="mb-7">
                        <h2 className="text-2xl font-bold text-[#1F1711]">Sign in as admin</h2>
                        <p className="mt-2 text-sm text-[#7a6651]">
                            Use your Smart Murti owner account. Regular users cannot open the dashboard.
                        </p>
                    </div>
                    <AdminLoginForm />
                </section>
            </div>
        </div>
    );
}
