import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ChevronRight, Sparkles, Heart, Users } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
            <main className="flex-1">

                {/* Hero Section */}
                <section className="w-full py-12 md:py-32 bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
                        <div className="inline-block mb-6">
                            <span className="bg-purple-500 text-white px-6 py-3 rounded-full text-base font-bold uppercase tracking-wide shadow-lg">
                                ✨ Launching Soon
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-pink-800 to-amber-700 mb-6">
                            Simple, Transparent Pricing
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto">
                            Choose the perfect plan for your spiritual journey and AI companionship needs.
                        </p>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="w-full py-12 md:py-20">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                            {/* Basic Plan */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="h-6 w-6 text-purple-500" />
                                    <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-gray-900">₹499</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-gray-600 mt-2">Perfect for individuals starting their journey</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">1 AI Companion (Boy or Girl)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Unlimited conversations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">All Indian languages</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Basic customization</span>
                                    </li>
                                </ul>

                                <Button disabled className="w-full bg-gray-200 text-gray-500 rounded-full py-6 text-lg cursor-not-allowed">
                                    Coming Soon
                                </Button>
                            </div>

                            {/* Premium Plan - Featured */}
                            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl border-2 border-purple-400 transform md:-translate-y-4 hover:scale-105 transition-all duration-300">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                    <span className="bg-amber-400 text-amber-900 px-4 py-1 rounded-full text-sm font-bold uppercase">
                                        Most Popular
                                    </span>
                                </div>

                                <div className="flex items-center gap-2 mb-4">
                                    <Heart className="h-6 w-6 text-white" />
                                    <h3 className="text-2xl font-bold text-white">Premium</h3>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-white">₹999</span>
                                        <span className="text-purple-100">/month</span>
                                    </div>
                                    <p className="text-purple-100 mt-2">For families wanting the complete experience</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">3 AI Companions (Pandit + Boy + Girl)</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">Unlimited conversations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">All languages + dialects</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">Advanced customization</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">Daily Puja & Mantras</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">Priority support</span>
                                    </li>
                                </ul>

                                <Button disabled className="w-full bg-white text-purple-700 hover:bg-gray-100 rounded-full py-6 text-lg font-bold cursor-not-allowed">
                                    Coming Soon
                                </Button>
                            </div>

                            {/* Family Plan */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-amber-300 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="h-6 w-6 text-amber-500" />
                                    <h3 className="text-2xl font-bold text-gray-900">Family</h3>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-gray-900">₹1,499</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-gray-600 mt-2">For larger families and communities</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Up to 5 AI Companions</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Unlimited conversations</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">All languages + dialects</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Full customization</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Multi-user access</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">24/7 premium support</span>
                                    </li>
                                </ul>

                                <Button disabled className="w-full bg-gray-200 text-gray-500 rounded-full py-6 text-lg cursor-not-allowed">
                                    Coming Soon
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full py-12 md:py-20 bg-gray-50">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            Pricing FAQs
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">When will pricing be available?</h3>
                                <p className="text-gray-700">
                                    We're finalizing our pricing structure and will announce launch dates soon. Sign up for early access to get exclusive launch offers!
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Will there be a free trial?</h3>
                                <p className="text-gray-700">
                                    Yes! We plan to offer a 7-day free trial for all new users to experience SMART मूर्ति before committing to a plan.
                                </p>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Can I switch plans later?</h3>
                                <p className="text-gray-700">
                                    Absolutely! You'll be able to upgrade or downgrade your plan at any time, with changes taking effect in the next billing cycle.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-12 md:py-20 bg-gradient-to-br from-purple-900 to-pink-800">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto text-center">
                        <h2 className="text-3xl md:text-5xl font-bold font-lora text-white mb-6">
                            Ready to Get Started?
                        </h2>
                        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                            Join the waitlist to be notified when SMART मूर्ति launches and get exclusive early-bird pricing!
                        </p>
                        <Link href="/">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-purple-50 rounded-full shadow-xl px-12 py-6 text-lg">
                                Back to Home
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
