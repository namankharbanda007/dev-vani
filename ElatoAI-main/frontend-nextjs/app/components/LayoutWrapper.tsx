"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/app/components/Nav/Navbar";
import Footer from "@/app/components/Footer";
import { User } from "@supabase/supabase-js"; // Or appropriate type import

export default function LayoutWrapper({
    children,
    user,
}: {
    children: React.ReactNode;
    user: any; // Type as needed
}) {
    const pathname = usePathname();
    const isLandingPage = pathname?.startsWith("/landing-2") || pathname === "/" || pathname?.startsWith("/pandit");

    return (
        <main className="flex-grow mx-auto w-full flex flex-col pt-0">
            {!isLandingPage && <Navbar user={user} />}
            {children}
            {!isLandingPage && <Footer />}
        </main>
    );
}
