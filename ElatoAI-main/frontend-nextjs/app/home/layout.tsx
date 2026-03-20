import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Settings, Home, LogOut, CreditCard } from "lucide-react";
import { Metadata } from "next";
import { getOpenGraphMetadata } from "@/lib/utils";
import { MobileNav } from "../components/Nav/MobileNav";
import { getUserById } from "@/db/users";

const ICON_SIZE = 20;

export const dynamic = "force-dynamic";
export const revalidate = 60;
export const fetchCache = "force-no-store";

export const metadata: Metadata = {
    title: "Home",
    ...getOpenGraphMetadata("Home"),
};

const sidebarNavItems: SidebarNavItem[] = [
    {
        title: "Home",
        href: "/home",
        icon: <Home size={ICON_SIZE} />,
    },
    {
        title: "Wallet",
        href: "/wallet",
        icon: <CreditCard size={ICON_SIZE} />,
    },
    {
        title: "Settings",
        href: "/home/settings",
        icon: <Settings size={ICON_SIZE} />,
    },
];

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const dbUser = await getUserById(supabase, user.id);

    if (!dbUser) {
        redirect("/login");
    }

    const mobileNavItems = [
        sidebarNavItems[0], // Home
        sidebarNavItems[1], // Wallet
        sidebarNavItems[2], // Settings
        {
            title: "Account",
            href: "/home/settings",
            icon: <LogOut size={ICON_SIZE} />,
        },
    ];

    return (
        <div className="flex flex-1 flex-col mx-auto w-full max-w-[1400px] gap-2 pb-20 md:pb-2 md:flex-row min-h-screen bg-gradient-to-br from-[#FDFBF7] via-white to-[#F8F5FF]">
            <main className="flex-1 sm:py-4 px-4 flex justify-center">
                <div className="max-w-5xl w-full">{children}</div>
            </main>
            <MobileNav items={mobileNavItems} />
        </div>

    );
}
