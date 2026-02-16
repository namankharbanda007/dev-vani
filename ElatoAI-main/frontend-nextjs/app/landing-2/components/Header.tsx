"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Users, Zap, Mail, Menu, X } from "lucide-react";
import clsx from "clsx";

export default function Header() {
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const hasScrolled = latest > 50;
        if (isScrolled !== hasScrolled) {
            setIsScrolled(hasScrolled);
        }
    });

    return (
        <>
            <motion.header
                className={clsx(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4 md:px-12 flex items-center justify-between",
                    isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
                )}
            >
                {/* Logo */}
                <Link href="/landing-2" className="flex items-center gap-2">
                    <div className="relative h-12 w-auto">
                        <img
                            src="/smart-murti-logo.png"
                            alt="Smart Murti"
                            className="h-full w-auto object-contain"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                        />
                        <span className="hidden text-2xl font-serif font-bold text-murti-stone">SMART MURTI</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center space-x-8">
                    <NavLink href="#collection" label="Shop" />
                    <NavLink href="#story" label="Our Story" />
                    <NavLink href="#technology" label="Technology" />
                    <NavLink href="#contact" label="Contact" />
                </nav>

                {/* CTA & Mobile Menu Toggle */}
                <div className="flex items-center space-x-4">
                    <Link
                        href="#get-app"
                        className="hidden md:inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition-all"
                    >
                        Get App
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(true)}
                        className="md:hidden text-murti-stone p-2"
                    >
                        <Menu className="w-6 h-6" />
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
        <Link href={href} className="text-sm font-medium text-murti-stone/80 hover:text-divine-saffron transition-colors">
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
