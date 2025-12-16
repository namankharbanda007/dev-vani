"use client";

import { Label } from "@/components/ui/label";
import { usePathname } from "next/navigation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Link from "next/link";

export default function Footer() {
    const pathname = usePathname();
    const isHome = pathname.includes("/home");
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <footer
            className={`w-full ${isHome ? "pb-16" : "pb-2"
                } border-gray-200 flex flex-col sm:flex-row items-center justify-center border-t-[1px] mx-auto text-center text-xs sm:gap-8 sm:py-4 py-4 bg-white/50 backdrop-blur-sm`}
        >
            <Label className={`font-normal text-xs text-gray-500`}>
                Made with ❤️ by SMART मूर्ति © {new Date().getFullYear()}
            </Label>

            <div className="flex gap-4 text-gray-500 text-xs">
                <Link href="/terms" className="hover:text-purple-600 transition-colors">
                    Terms
                </Link>
                <Link href="/privacy" className="hover:text-purple-600 transition-colors">
                    Privacy
                </Link>
            </div>
        </footer>
    );
}
