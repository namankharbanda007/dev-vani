"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ChevronRight, X, Sparkles } from "lucide-react";

interface PreorderFormProps {
    productName: string;
    productPrice: string;
    accentColor?: string;
}

export default function PreorderForm({ productName, productPrice, accentColor = "purple" }: PreorderFormProps) {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call (in production, this would send to your backend)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        setSubmitted(true);
        toast({
            title: "Preorder Registered! 🎉",
            description: `Thank you for your interest in ${productName}. We'll notify you when it's available!`,
        });
    };

    const bgGradient = accentColor === "purple"
        ? "from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
        : accentColor === "orange"
            ? "from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
            : "from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700";

    if (submitted) {
        return (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">You're on the list!</h3>
                <p className="text-green-700">
                    We'll notify you at <strong>{formData.email}</strong> when {productName} is available for purchase.
                </p>
            </div>
        );
    }

    if (!showForm) {
        return (
            <Button
                size="lg"
                className={`w-full sm:w-auto bg-gradient-to-r ${bgGradient} text-white rounded-full shadow-xl px-8`}
                onClick={() => setShowForm(true)}
            >
                <Sparkles className="mr-2 h-5 w-5" />
                Preorder Now - {productPrice}
            </Button>
        );
    }

    return (
        <div className="bg-white/90 backdrop-blur-sm border-2 border-purple-200 rounded-2xl p-6 shadow-xl max-w-md">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Preorder {productName}</h3>
                <button
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                <p className="text-amber-800 text-sm">
                    <strong>🚀 Launching Soon!</strong> Fill in your details and we'll notify you when {productName} is available. No payment required now.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <Input
                        type="text"
                        required
                        placeholder="Your name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <Input
                        type="email"
                        required
                        placeholder="you@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <Input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full"
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-gradient-to-r ${bgGradient} text-white rounded-full py-6 text-lg`}
                >
                    {isSubmitting ? (
                        <>Processing...</>
                    ) : (
                        <>
                            Register for Preorder
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </>
                    )}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                    By registering, you agree to be contacted about this product launch.
                </p>
            </form>
        </div>
    );
}
