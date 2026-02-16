"use client";

import { motion } from "framer-motion";
import { Zap, Smartphone, Cuboid as Cube } from "lucide-react";
import clsx from "clsx";

export default function BentoGrid() {
    return (
        <section className="py-24 px-6 md:px-10 bg-soft-paper">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px] md:auto-rows-[400px]">

                {/* Card 1: Smart Aarti (Large - Spans 2 cols) */}
                <BentoCard
                    title="Smart Aarti"
                    description="Experience divine light synchronization."
                    className="md:col-span-2 bg-gradient-to-br from-orange-50 to-white"
                    icon={<Zap className="w-8 h-8 text-divine-saffron" />}
                >
                    {/* Placeholder for Video/Animation */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="text-9xl font-serif">ॐ</span>
                    </div>
                </BentoCard>

                {/* Card 2: App Control (Tall - Spans 2 rows on mobile, 1 on desktop but tall?) 
            Actually, let's stick to standard bento. 
            Request said: Card 2 (Tall), Card 3 (Small). 
            Let's make Card 2 span 1 col but 2 rows? Or just 1 col.
            Let's go with:
            [ Large (2) ] [ Tall (1) ]
            [ Small (1) ] [ Small (1) ] [ Small (1) ] - wait, grid is 3 cols.
            
            Let's try:
            [ 1 (2 cols) ] [ 2 (1 col, 2 rows) ]
            [ 3 (1 col)  ] [ 4 (1 col) ] 
        */}

                {/* Card 2: App Control (Tall - Spans 1 col, 2 rows) */}
                <BentoCard
                    title="App Control"
                    description="Devotion at your fingertips."
                    className="row-span-2 bg-murti-stone text-white"
                    icon={<Smartphone className="w-8 h-8 text-divine-saffron" />}
                    dark
                >
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-neutral-800 rounded-t-3xl border-t-8 border-x-8 border-neutral-700 opacity-50" />
                </BentoCard>

                {/* Card 3: Pure Materials */}
                <BentoCard
                    title="Pure Materials"
                    description="Crafted from ethically sourced marble."
                    className="bg-zinc-100"
                    icon={<Cube className="w-8 h-8 text-murti-stone" />}
                />

                {/* Card 4: Filler to balance grid if needed, or expand Card 3 */}
                <BentoCard
                    title="Eco Friendly"
                    description="Sustainable spiritual technology."
                    className="bg-orange-50"
                    icon={<span className="text-2xl">🌱</span>}
                />

            </div>
        </section>
    );
}

interface BentoCardProps {
    title: string;
    description: string;
    className?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
    dark?: boolean;
}

function BentoCard({ title, description, className, icon, children, dark }: BentoCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={clsx(
                "relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between group cursor-pointer border hover:border-divine-saffron/50 transition-colors shadow-sm hover:shadow-xl hover:shadow-divine-saffron/10",
                dark ? "border-transparent" : "border-white/10",
                className
            )}
        >
            <div className="relative z-10 flex justify-between items-start">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                    {icon}
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <h3 className={clsx("text-2xl font-serif font-bold mb-2", dark ? "text-white" : "text-murti-stone")}>
                    {title}
                </h3>
                <p className={clsx("text-sm font-medium", dark ? "text-white/60" : "text-murti-stone/60")}>
                    {description}
                </p>
            </div>

            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none" />

            {children}
        </motion.div>
    );
}
