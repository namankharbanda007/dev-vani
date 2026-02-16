"use client";

import Link from "next/link";
import { Twitter, Instagram, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-murti-stone text-white py-20 px-6 md:px-10">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end gap-10">

                <div className="space-y-6">
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-divine-saffron">SMART MURTI</h2>
                    <p className="text-white/60 text-lg max-w-sm">
                        Merging ancient Vedic tradition with futuristic minimalism. Made with devotion in India.
                    </p>
                </div>

                <div className="flex flex-col items-start md:items-end space-y-6">
                    <div className="flex space-x-6">
                        <SocialLink href="#" icon={<Twitter />} label="Twitter" />
                        <SocialLink href="#" icon={<Instagram />} label="Instagram" />
                        <SocialLink href="#" icon={<Mail />} label="Support" />
                    </div>
                    <p className="text-white/40 text-sm">
                        © {new Date().getFullYear()} Smart Murti. All rights reserved.
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
            className="p-3 rounded-full bg-white/5 hover:bg-divine-saffron hover:text-white transition-all duration-300"
            aria-label={label}
        >
            {icon}
        </Link>
    );
}
