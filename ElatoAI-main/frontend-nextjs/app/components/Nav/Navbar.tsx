"use client";

import { useEffect, useState } from "react";
import NavbarButtons from "./NavbarButtons";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import LeftNavbarButtons from "./LeftNavbarButtons";

export function Navbar({
    user,
}: {
    user: IUser | null;
}) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();
    const isHome = pathname.includes("/home") || pathname.includes("/bhajan");

    useEffect(() => {
        if (typeof window !== "undefined" && isMobile) {
            const handleScroll = () => {
                const currentScrollY = window.scrollY;
                setIsVisible(
                    currentScrollY <= 0 || currentScrollY < lastScrollY
                );
                setLastScrollY(currentScrollY);
            };

            window.addEventListener("scroll", handleScroll, { passive: true });
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [lastScrollY, isMobile]);

    if (pathname === "/landing") return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isVisible ? "translate-y-0" : "-translate-y-full"
                }`}
        >
            <div className="absolute inset-0 bg-white/70 backdrop-blur-md border-b border-white/20 shadow-sm"></div>
            <nav
                className={`relative mx-auto w-full max-w-[1440px] px-6 h-[72px] flex items-center justify-between`}
            >
                <LeftNavbarButtons user={user} />
                <NavbarButtons user={user} isHome={isHome} />
            </nav>
        </div>
    );
}
