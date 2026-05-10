import Link from "next/link";
import { Globe2, Mail, ShieldCheck, Sparkles } from "lucide-react";

type SiteFooterProps = {
    variant?: "light" | "dark";
};

const legalLinks = [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
    { href: "/refunds", label: "Refund Policy" },
    { href: "/disclaimer", label: "Disclaimer" },
    { href: "/contact", label: "Contact" },
];

const productLinks = [
    { href: "/pandit", label: "Smart Pandit" },
    { href: "/pandit?ritual=ganpati-havan", label: "Live Family Puja" },
    { href: "/astrologer", label: "Astrologer" },
    { href: "/pricing", label: "Pricing" },
    {
        href: "https://wa.me/917982251998?text=Namaste%20Smart%20Murti%2C%20I%20want%20to%20try%20Smart%20Pandit.",
        label: "WhatsApp",
    },
];

export default function SiteFooter({ variant = "light" }: SiteFooterProps) {
    const isDark = variant === "dark";

    return (
        <footer
            className={
                isDark
                    ? "border-t border-white/10 bg-[#130b08] px-6 py-14 text-white md:px-10"
                    : "border-t border-[#eadfcf] bg-gradient-to-b from-[#fff8ef] to-white px-6 py-14 text-[#2b1d13] md:px-10"
            }
        >
            <div className="mx-auto max-w-7xl">
                <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr_1fr]">
                    <div className="space-y-5">
                        <div>
                            <p className={`text-xs font-semibold uppercase tracking-[0.28em] ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                                Smart Murti
                            </p>
                            <h2 className={`mt-2 font-lora text-4xl font-bold ${isDark ? "text-white" : "text-[#20130b]"}`}>
                                SMART मूर्ति
                            </h2>
                        </div>

                        <p className={`max-w-xl text-base leading-7 ${isDark ? "text-white/70" : "text-[#5b4837]"}`}>
                            Smartmurti AI Private Limited helps Hindu families access live multilingual AI Pandit guidance, family puja, and spiritual support from anywhere in the world.
                        </p>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <div className={`rounded-lg border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-[#eadfcf] bg-white/80"}`}>
                                <div className="flex items-center gap-2">
                                    <Mail className={`h-4 w-4 ${isDark ? "text-amber-300" : "text-amber-700"}`} />
                                    <span className="text-sm font-semibold">Support</span>
                                </div>
                                <a
                                    href="mailto:support@smartmurti.com"
                                    className={`mt-2 block text-sm transition ${isDark ? "text-white/75 hover:text-white" : "text-[#6a5542] hover:text-[#2b1d13]"}`}
                                >
                                    support@smartmurti.com
                                </a>
                            </div>

                            <div className={`rounded-lg border p-4 ${isDark ? "border-white/10 bg-white/5" : "border-[#eadfcf] bg-white/80"}`}>
                                <div className="flex items-center gap-2">
                                    <Globe2 className={`h-4 w-4 ${isDark ? "text-amber-300" : "text-amber-700"}`} />
                                    <span className="text-sm font-semibold">Remote-first support</span>
                                </div>
                                <p className={`mt-2 text-sm leading-6 ${isDark ? "text-white/65" : "text-[#6a5542]"}`}>
                                    Serving NRI families across time zones through email, WhatsApp, and live digital sessions.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className={`text-sm font-semibold uppercase tracking-[0.22em] ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                            Explore
                        </h3>
                        <div className="mt-5 space-y-3">
                            {productLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block text-sm transition ${isDark ? "text-white/70 hover:text-white" : "text-[#5a4632] hover:text-[#20130b]"}`}
                                    target={link.href.startsWith("http") ? "_blank" : undefined}
                                    rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className={`text-sm font-semibold uppercase tracking-[0.22em] ${isDark ? "text-amber-300" : "text-amber-700"}`}>
                            Legal
                        </h3>
                        <div className="mt-5 space-y-3">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`block text-sm transition ${isDark ? "text-white/70 hover:text-white" : "text-[#5a4632] hover:text-[#20130b]"}`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div className={`mt-10 flex flex-col gap-4 border-t pt-6 text-sm md:flex-row md:items-center md:justify-between ${isDark ? "border-white/10 text-white/60" : "border-[#eadfcf] text-[#6a5542]"}`}>
                    <div className="flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span>Digital sessions are non-refundable once started, except failed or duplicate payments.</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>© {new Date().getFullYear()} Smartmurti AI Private Limited. All rights reserved.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
