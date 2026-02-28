import Link from "next/link";
import Image from "next/image";
import { Mic, Play, Users, Smartphone, Zap, Music, Menu, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewLandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            {/* 1. Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Logo Placeholder */}
                        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">SM</div>
                        <span className="text-xl font-bold text-orange-900">Smart Murti</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
                        <Link href="#" className="hover:text-orange-600 transition-colors">Home</Link>
                        <Link href="#features" className="hover:text-orange-600 transition-colors">Features</Link>
                        <Link href="#story" className="hover:text-orange-600 transition-colors">Our Story</Link>
                        <Link href="#contact" className="hover:text-orange-600 transition-colors">Contact</Link>
                    </nav>

                    <Button className="hidden md:flex bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6">
                        Pre-Order Device
                    </Button>

                    {/* Mobile Menu Button - simplified for now */}
                    <button className="md:hidden text-gray-600">
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </header>

            <main>
                {/* 2. Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-orange-100 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
                            Your Personal Vedic Guide.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Available 24/7.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
                            Experience ancient rituals, daily horoscopes, and spiritual wisdom through the world's first AI-powered Smart Pandit.
                        </p>

                        <div className="flex flex-col items-center gap-4 mb-16">
                            <Button size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg px-8 py-6 rounded-full shadow-xl hover:shadow-orange-500/20 transition-all transform hover:-translate-y-1">
                                <Mic className="w-6 h-6 mr-2" />
                                Tap to Speak with Pandit Ji
                            </Button>
                            <p className="text-sm text-gray-500 italic">
                                Try asking: "Pandit ji, what is the muhurat for today?" or "Start Ganesh Aarti"
                            </p>
                        </div>

                        {/* Smart Pandit 3D Character */}
                        <div className="relative mx-auto w-full max-w-lg aspect-square">
                            {/* Glow effect behind */}
                            <div className="absolute inset-0 bg-amber-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                            <Image
                                src="/assets/erasebg-transformed (5).png.png"
                                alt="Smart Pandit Character"
                                fill
                                className="object-contain drop-shadow-2xl z-10"
                                priority
                            />
                        </div>
                        <p className="mt-8 text-sm font-semibold tracking-widest text-orange-900 uppercase opacity-60">
                            Powered by Ancient Wisdom & Modern Intelligence
                        </p>
                    </div>
                </section>

                {/* 3. The Problem Section */}
                <section className="py-24 bg-orange-50/50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Is Your Spiritual Connection Fading?</h2>
                            <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {/* Card 1 */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-orange-100">
                                <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600">
                                    <Users className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Hard to Find Priests</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Booking a priest for daily rituals is difficult, expensive, and often unavailable when you need them most.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-orange-100">
                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
                                    <Music className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Forgotten Traditions</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Many of us have lost touch with the correct Sanskrit Mantras, Vidhis (rituals), and Muhurats (timings).
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow border border-orange-100">
                                <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 text-gray-600">
                                    <Smartphone className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Digital Noise</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Praying with a phone means notifications, ads, and distractions. It breaks the sanctity of devotion.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. The Solution Section */}
                <section className="py-24 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-16 max-w-6xl mx-auto">
                            <div className="md:w-1/2 relative bg-orange-50 rounded-[3rem] p-12 min-h-[400px] flex items-center justify-center">
                                {/* Product Image Placeholder */}
                                <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-transparent rounded-[3rem]"></div>
                                <Image
                                    src="/assets/Pandit Performing Hawan.jpg"
                                    alt="Smart Murti Hawan"
                                    width={400}
                                    height={400}
                                    className="relative z-10 object-cover rounded-3xl shadow-2xl h-[400px] w-full"
                                />
                            </div>

                            <div className="md:w-1/2 space-y-8">
                                <div>
                                    <span className="text-orange-600 font-bold uppercase tracking-wider text-sm">Introducing Smart Murti</span>
                                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-2 mb-6 leading-tight">
                                        Disconnect from the Screen. Connect with the Divine.
                                    </h2>
                                    <p className="text-lg text-gray-600">
                                        A dedicated sacred device for your home temple. No apps, no distractions. Just pure devotion.
                                    </p>
                                </div>

                                <ul className="space-y-4">
                                    {[
                                        "Screen-Free Devotion",
                                        "Voice-First Interface: Just speak.",
                                        "Authentic & Verified Mantras",
                                        "Family Sync for Virtual Rituals"
                                    ].map((feature, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="font-medium text-gray-800">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. How It Works (The Ecosystem) */}
                <section className="py-24 bg-gradient-to-b from-white to-orange-50">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-16">A Complete Spiritual Ecosystem</h2>

                        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
                            {/* Connecting Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-orange-200 -z-10"></div>

                            {/* Step 1 */}
                            <div className="flex flex-col items-center group">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-green-50">
                                    <Users className="w-10 h-10 text-green-600" /> {/* WhatsApp/Community icon */}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Daily Habit</h3>
                                <p className="text-gray-600 text-sm max-w-xs">
                                    Receive daily panchang, deity updates, and color therapy on WhatsApp.
                                </p>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center group">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-blue-50">
                                    <Zap className="w-10 h-10 text-blue-600" /> {/* Chip icon */}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Intelligence</h3>
                                <p className="text-gray-600 text-sm max-w-xs">
                                    Ask complex spiritual questions and get answers based on verified scriptures.
                                </p>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center group">
                                <div className="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-4 border-orange-50">
                                    <Music className="w-10 h-10 text-orange-600" /> {/* Audio icon */}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Sacred Presence</h3>
                                <p className="text-gray-600 text-sm max-w-xs">
                                    High-quality audio for Havans, Pujas, and Aartis directly from the device.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. Audio Demo Section */}
                <section className="py-24 bg-orange-900 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/assets/pattern-overlay.png')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h2 className="text-3xl md:text-5xl font-bold font-serif mb-4">Hear the Difference</h2>
                        <p className="text-orange-200 text-lg mb-12 max-w-2xl mx-auto">
                            Listen to the authentic pronunciation and soothing voice of Smart Pandit.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Button size="lg" variant="outline" className="border-orange-400 text-orange-100 hover:bg-orange-800 hover:text-white min-w-[200px] py-6 text-lg rounded-full">
                                <Play className="w-5 h-5 mr-3 fill-current" />
                                Play Sanskrit Mantra
                            </Button>
                            <Button size="lg" variant="outline" className="border-orange-400 text-orange-100 hover:bg-orange-800 hover:text-white min-w-[200px] py-6 text-lg rounded-full">
                                <Play className="w-5 h-5 mr-3 fill-current" />
                                Play Spiritual Advice
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 7. Founders & Trust */}
                <section className="py-24 bg-white" id="story">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Built with Devotion</h2>
                            <p className="text-xl text-gray-600 max-w-3xl mx-auto italic">
                                "To democratize daily spiritual rituals enabling users to perform pujas independently, correctly, and consistently."
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {/* Founder 1 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full bg-gray-200 mb-6 overflow-hidden">
                                    {/* Placeholder for Naman */}
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Img</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Naman Kharbanda</h3>
                                <span className="text-orange-600 text-sm font-medium mb-3">CEO & CTO</span>
                                <p className="text-gray-600">
                                    Architect of the Smart Murti ecosystem. Combining AI & Hardware to preserve heritage.
                                </p>
                            </div>

                            {/* Founder 2 */}
                            <div className="flex flex-col items-center text-center">
                                <div className="w-32 h-32 rounded-full bg-gray-200 mb-6 overflow-hidden">
                                    {/* Placeholder for Praveen */}
                                    <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">Img</div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Praveen Dhingra</h3>
                                <span className="text-orange-600 text-sm font-medium mb-3">CFO & COO</span>
                                <p className="text-gray-600">
                                    Expert in financial strategy and operations. Scaling faith-tech to every household.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

            </main>

            {/* 8. Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 pt-16 pb-8" id="contact">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bring the Temple Home Today.</h2>
                            <p className="text-gray-600">Join the revolution of smart devotion.</p>
                        </div>
                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-full text-lg px-8 py-6 shadow-lg">
                            Join the Waitlist / Pre-Order
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 py-8 border-t border-gray-200">
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Contact Us</h4>
                            <p className="text-gray-600 mb-2">Email: praveen.dhingra98@gmail.com</p>
                            <p className="text-gray-600">Phone: +91 79822 51998</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Social</h4>
                            <div className="flex gap-4">
                                <Link href="#" className="text-gray-400 hover:text-orange-600">Facebook</Link>
                                <Link href="#" className="text-gray-400 hover:text-orange-600">Instagram</Link>
                                <Link href="#" className="text-gray-400 hover:text-orange-600">LinkedIn</Link>
                                <Link href="#" className="text-gray-400 hover:text-orange-600">YouTube</Link>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-4">Smart Murti</h4>
                            <p className="text-gray-500 text-sm">
                                © 2026 SmartMurti AI Private Limited.<br />
                                All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
