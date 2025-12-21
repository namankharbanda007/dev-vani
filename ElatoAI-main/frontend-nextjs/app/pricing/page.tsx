import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, X, ChevronRight, Sparkles, Heart, Users, Music } from "lucide-react";

export default function PricingPage() {
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
            <main className="flex-1">

                {/* Hero Section */}
                <section className="w-full py-12 md:py-24 bg-gradient-to-br from-purple-100 via-pink-100 to-amber-100">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto text-center">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                            {/* Free Plan */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-green-300 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <Music className="h-6 w-6 text-green-500" />
                                    <h3 className="text-2xl font-bold text-gray-900">Free</h3>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-gray-900">₹0</span>
                                        <span className="text-gray-500">/forever</span>
                                    </div>
                                    <p className="text-gray-600 mt-2">Experience our divine audio collection</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Access to all Bhajans</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Access to all Aartis</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Browse characters</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-400">No AI conversations</span>
                                    </li>
                                </ul>

                                <Link href="/home">
                                    <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-full py-6 text-lg">
                                        Get Started Free
                                    </Button>
                                </Link>
                            </div>

                            {/* Basic Plan */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-purple-300 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="h-6 w-6 text-purple-500" />
                                    <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-gray-900">₹199</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-sm text-purple-600 font-medium">or ₹2,200/year (save ₹188)</p>
                                    <p className="text-gray-600 mt-2">Perfect for individuals starting their journey</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>1 hour</strong> conversation/month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>1 premade</strong> character</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>5 custom</strong> characters you create</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">All Indian languages</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Bhajans & Aarti access</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-400">No voice cloning</span>
                                    </li>
                                </ul>

                                <Link href="/home">
                                    <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-full py-6 text-lg">
                                        Get Basic
                                    </Button>
                                </Link>
                            </div>

                            {/* Premium Plan - Featured */}
                            <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-8 shadow-2xl border-2 border-purple-400 transform lg:-translate-y-4 hover:scale-105 transition-all duration-300">
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
                                        <span className="text-5xl font-bold text-white">₹1,499</span>
                                        <span className="text-purple-100">/month</span>
                                    </div>
                                    <p className="text-sm text-amber-300 font-medium">or ₹15,999/year (save ₹1,989)</p>
                                    <p className="text-purple-100 mt-2">For power users wanting more</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white"><strong>10 hours</strong> conversation/month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white"><strong>All premade</strong> characters</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white"><strong>10 custom</strong> characters you create</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white"><strong>1 voice clone</strong> included</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">All languages + dialects</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-300 flex-shrink-0 mt-0.5" />
                                        <span className="text-white">Priority support</span>
                                    </li>
                                </ul>

                                <Link href="/home">
                                    <Button className="w-full bg-white text-purple-700 hover:bg-gray-100 rounded-full py-6 text-lg font-bold">
                                        Get Premium
                                    </Button>
                                </Link>
                            </div>

                            {/* Family Plan */}
                            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-200 hover:border-amber-300 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="h-6 w-6 text-amber-500" />
                                    <h3 className="text-2xl font-bold text-gray-900">Family</h3>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-bold text-gray-900">₹3,499</span>
                                        <span className="text-gray-500">/month</span>
                                    </div>
                                    <p className="text-sm text-amber-600 font-medium">or ₹39,999/year (save ₹1,989)</p>
                                    <p className="text-gray-600 mt-2">For families and power users</p>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>24 hours</strong> conversation/month</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>All premade</strong> characters</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>Unlimited</strong> custom characters</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700"><strong>5 voice clones</strong> included</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">All languages + dialects</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">Multi-device support</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-700">24/7 premium support</span>
                                    </li>
                                </ul>

                                <Link href="/home">
                                    <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white rounded-full py-6 text-lg">
                                        Get Family
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Comparison Table */}
                <section className="w-full py-12 md:py-20 bg-gray-50">
                    <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            Compare Plans
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                                <thead>
                                    <tr className="bg-purple-50">
                                        <th className="text-left p-4 font-bold text-gray-900">Feature</th>
                                        <th className="text-center p-4 font-bold text-green-600">Free</th>
                                        <th className="text-center p-4 font-bold text-purple-600">Basic</th>
                                        <th className="text-center p-4 font-bold text-pink-600">Premium</th>
                                        <th className="text-center p-4 font-bold text-amber-600">Family</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <td className="p-4 text-gray-700">Monthly Price</td>
                                        <td className="p-4 text-center font-bold">₹0</td>
                                        <td className="p-4 text-center font-bold">₹199</td>
                                        <td className="p-4 text-center font-bold">₹1,499</td>
                                        <td className="p-4 text-center font-bold">₹3,499</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="p-4 text-gray-700">Yearly Price</td>
                                        <td className="p-4 text-center">-</td>
                                        <td className="p-4 text-center">₹2,200</td>
                                        <td className="p-4 text-center">₹15,999</td>
                                        <td className="p-4 text-center">₹39,999</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-gray-700">Conversation Time</td>
                                        <td className="p-4 text-center">-</td>
                                        <td className="p-4 text-center">1 hr/month</td>
                                        <td className="p-4 text-center">10 hrs/month</td>
                                        <td className="p-4 text-center">24 hrs/month</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="p-4 text-gray-700">Premade Characters</td>
                                        <td className="p-4 text-center">Browse only</td>
                                        <td className="p-4 text-center">1</td>
                                        <td className="p-4 text-center">All</td>
                                        <td className="p-4 text-center">All</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-gray-700">Custom Characters</td>
                                        <td className="p-4 text-center">-</td>
                                        <td className="p-4 text-center">5</td>
                                        <td className="p-4 text-center">10</td>
                                        <td className="p-4 text-center">Unlimited</td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="p-4 text-gray-700">Voice Cloning</td>
                                        <td className="p-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                                        <td className="p-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                                        <td className="p-4 text-center">1</td>
                                        <td className="p-4 text-center">5</td>
                                    </tr>
                                    <tr>
                                        <td className="p-4 text-gray-700">Bhajans & Aarti</td>
                                        <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                                        <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                                        <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                                        <td className="p-4 text-center"><Check className="h-5 w-5 text-green-500 mx-auto" /></td>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <td className="p-4 text-gray-700">Languages</td>
                                        <td className="p-4 text-center">-</td>
                                        <td className="p-4 text-center">All Indian</td>
                                        <td className="p-4 text-center">All + Dialects</td>
                                        <td className="p-4 text-center">All + Dialects</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full py-12 md:py-20 bg-white">
                    <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                        <h2 className="text-4xl font-bold font-lora text-center text-gray-900 mb-12">
                            Frequently Asked Questions
                        </h2>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">What is voice cloning?</h3>
                                <p className="text-gray-700">
                                    Voice cloning lets you create an AI voice that sounds like anyone - yourself, a loved one, or a celebrity. Upload a voice sample and our AI will learn to speak in that voice!
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Can I switch plans later?</h3>
                                <p className="text-gray-700">
                                    Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect in the next billing cycle.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">What happens if I run out of conversation time?</h3>
                                <p className="text-gray-700">
                                    You can still access Bhajans, Aartis, and browse characters. To continue conversations, you can wait for the next month or upgrade your plan.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 shadow-md">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Is there a refund policy?</h3>
                                <p className="text-gray-700">
                                    Yes! We offer a 7-day money-back guarantee on all paid plans. If you're not satisfied, contact us for a full refund.
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
                            Start with our Free plan and upgrade anytime. Experience the magic of SMART मूर्ति today!
                        </p>
                        <Link href="/home">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-purple-900 hover:bg-purple-50 rounded-full shadow-xl px-12 py-6 text-lg">
                                Get Started Free
                                <ChevronRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>

            </main>
        </div>
    );
}
