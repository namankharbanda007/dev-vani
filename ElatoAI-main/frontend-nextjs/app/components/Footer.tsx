"use client";

import { usePathname } from "next/navigation";
import SiteFooter from "@/app/components/SiteFooter";

export default function Footer() {
    const pathname = usePathname();

    if (pathname === "/landing") return null;

    return <SiteFooter variant="light" />;
}
