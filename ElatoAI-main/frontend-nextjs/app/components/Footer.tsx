"use client";

import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Footer() {
    const pathname = usePathname();
    const isHome = pathname.includes("/home");
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <footer
            className={`w-full ${isHome ? "pb-16" : "pb-2"
                } border-gray-200 flex flex-col sm:flex-row items-center justify-center border-t-[1px] mx-auto text-center text-xs sm:gap-8 sm:py-1 py-2`}
        >
            <Label className={`font-normal text-xs text-gray-500`}>
                Made with ❤️ by SMART मूर्ति © {new Date().getFullYear()}
            </Label>
        </footer>
    );
}
