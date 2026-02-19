"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Phone, MessageCircle, User, Calendar, MapPin, Smartphone } from "lucide-react";

interface DemoFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: GuestData) => void;
    mode: "call" | "chat";
}

export interface GuestData {
    name: string;
    dob: string;
    location: string;
    whatsapp: string;
}

export default function DemoForm({ isOpen, onClose, onSubmit, mode }: DemoFormProps) {
    const [formData, setFormData] = useState<GuestData>({
        name: "",
        dob: "",
        location: "",
        whatsapp: "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            onSubmit(formData);
            setLoading(false);
        }, 800);
    };

    const accentColor = mode === "call" ? "#25D366" : "#53bdeb";
    const accentRgb = mode === "call" ? "37,211,102" : "83,189,235";
    const ModeIcon = mode === "call" ? Phone : MessageCircle;

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, y: 30 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.92, opacity: 0, y: 30 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="relative w-full max-w-md overflow-hidden rounded-3xl shadow-2xl"
                        style={{
                            background: "linear-gradient(170deg, rgba(25,30,35,0.98), rgba(12,16,20,0.99))",
                            border: `1px solid rgba(${accentRgb}, 0.15)`,
                        }}
                    >
                        {/* Top accent glow */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 rounded-b-full"
                            style={{
                                background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
                                boxShadow: `0 0 30px rgba(${accentRgb}, 0.3)`,
                            }}
                        />

                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-full transition-colors z-10 hover:bg-white/10"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-8 pt-10">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div
                                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                                    style={{
                                        background: `linear-gradient(135deg, rgba(${accentRgb}, 0.15), rgba(${accentRgb}, 0.05))`,
                                        border: `1px solid rgba(${accentRgb}, 0.3)`,
                                    }}
                                >
                                    <ModeIcon className="w-6 h-6" style={{ color: accentColor }} />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-white mb-2">
                                    Start {mode === "call" ? "Live Call" : "Live Chat"}
                                </h3>
                                <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                                    Share a few details so Pandit Ji can guide you better.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Arjun Kumar"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-300"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                            }}
                                            onFocus={e => {
                                                e.target.style.borderColor = `rgba(${accentRgb}, 0.5)`;
                                                e.target.style.boxShadow = `0 0 0 3px rgba(${accentRgb}, 0.08)`;
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* DOB */}
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                                        <input
                                            required
                                            type="date"
                                            value={formData.dob}
                                            onChange={e => setFormData({ ...formData, dob: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white outline-none transition-all duration-300 [color-scheme:dark]"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                            }}
                                            onFocus={e => {
                                                e.target.style.borderColor = `rgba(${accentRgb}, 0.5)`;
                                                e.target.style.boxShadow = `0 0 0 3px rgba(${accentRgb}, 0.08)`;
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Location */}
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        Location
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                                        <input
                                            required
                                            type="text"
                                            placeholder="e.g. Mumbai, India"
                                            value={formData.location}
                                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-300"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                            }}
                                            onFocus={e => {
                                                e.target.style.borderColor = `rgba(${accentRgb}, 0.5)`;
                                                e.target.style.boxShadow = `0 0 0 3px rgba(${accentRgb}, 0.08)`;
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* WhatsApp */}
                                <div>
                                    <label className="block text-xs font-medium mb-1.5 tracking-wider uppercase" style={{ color: "rgba(255,255,255,0.35)" }}>
                                        WhatsApp Number
                                    </label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "rgba(255,255,255,0.2)" }} />
                                        <input
                                            required
                                            type="tel"
                                            placeholder="+91 98765 43210"
                                            value={formData.whatsapp}
                                            onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm text-white placeholder-white/20 outline-none transition-all duration-300"
                                            style={{
                                                background: "rgba(255,255,255,0.05)",
                                                border: "1px solid rgba(255,255,255,0.08)",
                                            }}
                                            onFocus={e => {
                                                e.target.style.borderColor = `rgba(${accentRgb}, 0.5)`;
                                                e.target.style.boxShadow = `0 0 0 3px rgba(${accentRgb}, 0.08)`;
                                            }}
                                            onBlur={e => {
                                                e.target.style.borderColor = "rgba(255,255,255,0.08)";
                                                e.target.style.boxShadow = "none";
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Submit */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 py-4 font-bold rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 text-sm tracking-wide"
                                    style={{
                                        background: loading
                                            ? `rgba(${accentRgb}, 0.3)`
                                            : `linear-gradient(135deg, ${accentColor}, ${mode === "call" ? "#1da851" : "#3a9fd4"})`,
                                        color: "white",
                                        boxShadow: loading ? "none" : `0 8px 32px rgba(${accentRgb}, 0.25)`,
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Connecting...
                                        </>
                                    ) : (
                                        <>
                                            <ModeIcon className="w-5 h-5" />
                                            Start 2-Min Demo
                                        </>
                                    )}
                                </button>
                            </form>

                            {/* Footer */}
                            <p className="text-center mt-5 text-[11px] tracking-wider" style={{ color: "rgba(255,255,255,0.2)" }}>
                                🔒 Your data is secure • No credit card required
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
