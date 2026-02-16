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
        const hasScrolled = latest > 100;
        if (isScrolled !== hasScrolled) {
            setIsScrolled(hasScrolled);
        }
    });

    return (
        <>
            <motion.header
                layout
                initial={{ width: "100%", y: 0, borderRadius: 0 }}
                animate={{
                    width: isScrolled ? "90%" : "100%",
                    top: isScrolled ? 20 : 0,
                    borderRadius: isScrolled ? 9999 : 0,
                    backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.7)" : "transparent",
                    borderColor: isScrolled ? "rgba(255, 255, 255, 0.4)" : "transparent",
                    borderWidth: isScrolled ? 1 : 0,
                    backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
                    boxShadow: isScrolled ? "0 4px 6px -1px rgba(0, 0, 0, 0.1)" : "none",
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center justify-between px-6 py-4 md:px-10 transition-all"
                style={{ left: "50%", x: "-50%" }} // Ensure centering works with fixed position
            >
                {/* Logo */}
                <Link href="/landing-2" className="text-2xl font-serif font-bold tracking-tight text-murti-stone flex items-center">
                    <span className={clsx("transition-opacity duration-300", isScrolled ? "opacity-100" : "opacity-90")}>
                        SMART MURTI
                    </span>
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
                        className="hidden md:inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-divine-saffron rounded-full hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/30"
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
