"use client";

import Link from "next/link";
import { Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-murti-stone px-6 py-20 text-white md:px-10">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 md:flex-row md:items-end">
                <div className="space-y-6">
                    <h2 className="text-4xl font-serif font-bold text-divine-saffron md:text-6xl">
                        SMART मूर्ति
                    </h2>
                    <p className="max-w-sm text-lg text-white/60">
                        Instant spiritual access for Hindu families worldwide, built with devotion in India.
                    </p>
                </div>

                <div className="flex flex-col items-start space-y-6 md:items-end">
                    <div className="flex space-x-6">
                        <SocialLink href="#" icon={<Twitter />} label="Twitter" />
                        <SocialLink href="#" icon={<Instagram />} label="Instagram" />
                        <SocialLink href="#" icon={<Mail />} label="Support" />
                    </div>
                    <p className="text-sm text-white/40">
                        © {new Date().getFullYear()} SMART मूर्ति. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <Link
            href={href}
            className="rounded-full bg-white/5 p-3 transition-all duration-300 hover:bg-divine-saffron hover:text-white"
            aria-label={label}
        >
            {icon}
        </Link>
    );
}
