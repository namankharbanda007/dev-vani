"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Header() {
    const { scrollY } = useScroll();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Initial animation for the header
    const headerVariants = {
        hidden: { y: -100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    return (
        <>
            <motion.header
                variants={headerVariants}
                initial="hidden"
                animate="visible"
                className={clsx(
                    // Positioning: Fixed, centered, top-6
                    "fixed top-6 left-1/2 -translate-x-1/2 z-50",
                    // Sizing: Pill shape, limited width
                    "w-[90%] max-w-4xl h-14 rounded-full",
                    // Glassmorphism: Blur, semi-transparent background, subtle border/shadow
                    "backdrop-blur-lg bg-white/70 border border-white/40 shadow-lg", // Adjusted for visibility on light bg
                    // Layout: Flex center
                    "flex items-center justify-between px-6"
                )}
            >
                {/* Logo Section */}
                <Link href="/landing-2" className="flex items-center gap-2 h-full">
                    <div className="relative h-8 w-auto flex items-center">
                        <img
                            src="/smart-murti-logo-v2.png"
                            alt="Smart Murti"
                            className="h-full w-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        {/* Fallback Text */}
                        <span className="hidden text-xl font-serif font-bold text-murti-stone tracking-wide">SMART MURTI</span>
                    </div>
                </Link>

                {/* Desktop Nav - Centered/Right aligned */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink href="#collection" label="Shop" />
                    <NavLink href="#story" label="Our Story" />
                    <NavLink href="#technology" label="Technology" />
                </nav>

                {/* CTA & Mobile Menu Toggle */}
                <div className="flex items-center space-x-4">
                    <Link
                        href="#get-app"
                        className="hidden md:inline-flex items-center justify-center px-5 py-2 text-xs font-bold uppercase tracking-widest text-white bg-black rounded-full hover:bg-gray-800 transition-all"
                    >
                        Get App
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-murti-stone p-1"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </div>
            </motion.header>

            {/* Mobile Menu Overlay */}
            <AnimateMobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}

function NavLink({ href, label }: { href: string; label: string }) {
    return (
        <Link
            href={href}
            className="text-xs font-medium uppercase tracking-widest text-murti-stone/80 hover:text-black transition-colors"
        >
            {label}
        </Link>
    );
}

function AnimateMobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, pointerEvents: "none" }}
            animate={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none" }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8"
        >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-murti-stone">
                <X className="w-8 h-8" />
            </button>

            <nav className="flex flex-col items-center space-y-6 text-2xl font-serif">
                <Link href="#collection" onClick={onClose}>Shop</Link>
                <Link href="#story" onClick={onClose}>Our Story</Link>
                <Link href="#technology" onClick={onClose}>Technology</Link>
                <Link href="#contact" onClick={onClose}>Contact</Link>
            </nav>
        </motion.div>
    );
}
