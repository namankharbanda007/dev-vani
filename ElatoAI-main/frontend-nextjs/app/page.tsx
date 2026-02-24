import Link from "next/link"
import dynamic from "next/dynamic";
import { ChevronRight, Star, Home, ArrowUpRight, Shield, Heart, Sparkles, Users, Zap, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DEVICE_COST, SUBSCRIPTION_COST } from "@/lib/data";
import { createClient } from "@/utils/supabase/server"
import { getAllPersonalities } from "@/db/personalities"
import { CharacterShowcase } from "./components/LandingPage/CharacterShowcase";
import { CreateCharacterShowcase } from "./components/LandingPage/CreateCharacterShowcase";
import CustomizationForm from "./components/LandingPage/CustomizationForm";
import Image from "next/image";
import YoutubeDemo from "./components/LandingPage/YoutubeDemo";
import { kickstarterLink } from "@/lib/data";
import HomeHeroWrapper from "@/app/components/HomeHeroWrapper";
import { motion } from "framer-motion";
import HomeDemoSection from "./components/LandingPage/HomeDemoSection";
import DivinationServices from "@/app/landing-2/components/DivinationServices";
import DailySpirituality from "@/app/landing-2/components/DailySpirituality";

const HeroCarouselSlot = dynamic(() => import("./components/LandingPage/HeroCarousel").then(mod => mod.HeroCarouselSlot), { ssr: false });


export default async function LandingPage() {
  const supabase = createClient();

  const allPersonalities = await getAllPersonalities(supabase);
  const adultPersonalities = allPersonalities.filter((personality) => !personality.is_story && !personality.is_child_voice);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFBEB] via-[#FAF9F6] to-white">
      <main className="flex-1">

        {/* New Hero Section from Landing-2 */}
        <HomeHeroWrapper />

        {/* Lifestyle Showcase - Family Image */}
        <section className="w-full py-12 md:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50">
          <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Image */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-amber-300 rounded-3xl blur-2xl opacity-20"></div>
                <Image
                  src="/products/family-namaste.jpg"
                  alt="SMART मूर्ति Family - Bringing spirituality and companionship together"
                  width={600}
                  height={600}
                  className="relative z-10 rounded-3xl shadow-2xl"
                />
              </div>

              {/* Right: Content */}
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 leading-tight">
                  A Companion for Every Family Member
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Whether it's spiritual guidance from the Pandit for the elders, or a playful friend for the children, SMART मूर्ति brings the entire family together through meaningful conversations.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Heart className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">For Children</h4>
                      <p className="text-gray-600 text-sm">A friend who plays, learns, and grows with them</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">For Parents</h4>
                      <p className="text-gray-600 text-sm">Spiritual guidance and daily wisdom</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-pink-100 p-2 rounded-lg">
                      <Users className="h-5 w-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">For Everyone</h4>
                      <p className="text-gray-600 text-sm">Meaningful connections without screens</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section >

        {/* Demo Section Client Wrapper */}
        <HomeDemoSection />

        {/* Divination Services (Astrology, Match Making, Tarot, Palm Reading) */}
        <DivinationServices />

        {/* Daily Spirituality (Horoscope & Bhajans) */}
        <DailySpirituality />

        {/* Multilingual Support - Speaks Your Language */}
        < section className="w-full py-12 md:py-20 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 relative overflow-hidden" >
          {/* Decorative background elements */}
          < div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" >
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-200 rounded-full blur-3xl opacity-20"></div>
          </div >

          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                Speaks Your Language, Understands Your Heart
              </h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                SMART मूर्ति companions speak fluently in <strong>all major world languages</strong>, including every Indian language. Have natural conversations in your mother tongue!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Indian Languages */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-orange-100 hover:border-orange-200 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-3 rounded-full shadow-md">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Indian Languages</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">हिंदी (Hindi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">தமிழ் (Tamil)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">తెలుగు (Telugu)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">বাংলা (Bengali)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">मराठी (Marathi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">ગુજરાતી (Gujarati)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">ಕನ್ನಡ (Kannada)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">മലയാളം (Malayalam)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">ਪੰਜਾਬੀ (Punjabi)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">ଓଡ଼ିଆ (Odia)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">অসমীয়া (Assamese)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-orange-500">✓</span>
                    <span className="text-gray-700">& 12+ more!</span>
                  </div>
                </div>
              </div>

              {/* Global Languages */}
              <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-blue-100 hover:border-blue-200 transition-all hover:shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-600 p-3 rounded-full shadow-md">
                    <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Global Languages</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">English</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">Español (Spanish)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">中文 (Chinese)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">العربية (Arabic)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">Français (French)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">Deutsch (German)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">日本語 (Japanese)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">한국어 (Korean)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">Português (Portuguese)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">Русский (Russian)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">Italiano (Italian)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500">✓</span>
                    <span className="text-gray-700">& 100+ more!</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="text-center bg-white/60 backdrop-blur-md rounded-2xl p-8 border border-orange-200 shadow-lg">
              <p className="text-2xl font-bold text-gray-900 mb-2">
                🗣️ Speak in Your Mother Tongue
              </p>
              <p className="text-gray-700 text-lg">
                No matter where you're from or what language you speak, SMART मूर्ति understands you perfectly and responds naturally in your preferred language!
              </p>
            </div>
          </div>
        </section >

        {/* How to Customize Your Friend - INTERACTIVE FORM */}
        < CustomizationForm />

        {/* How It Works - Icon-Based Steps */}
        < section className="w-full py-12 md:py-20 bg-gradient-to-b from-white to-purple-50" >
          <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Three simple steps to meaningful conversations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-200 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 p-6 rounded-full shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg">
                    <span className="text-lg font-bold text-purple-600">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-purple-900 mb-3">Choose Your Companion</h3>
                <p className="text-gray-600 leading-relaxed">
                  Select between a wise Pandit for spiritual guidance or a customizable friend for daily companionship
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-amber-200 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-amber-500 to-yellow-600 p-6 rounded-full shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg">
                    <span className="text-lg font-bold text-amber-600">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-amber-900 mb-3">Customize & Personalize</h3>
                <p className="text-gray-600 leading-relaxed">
                  Give them a name, choose their voice, personality traits, and create a unique backstory that resonates with you
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-pink-200 rounded-full blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
                  <div className="relative bg-gradient-to-br from-pink-500 to-red-600 p-6 rounded-full shadow-xl transform group-hover:scale-110 transition-transform duration-300">
                    <MessageCircle className="h-12 w-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white rounded-full px-3 py-1 shadow-lg">
                    <span className="text-lg font-bold text-pink-600">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-pink-900 mb-3">Connect Daily</h3>
                <p className="text-gray-600 leading-relaxed">
                  Talk to them voice-to-voice, no screens needed. Build a real relationship that grows with meaningful conversations
                </p>
              </div>
            </div>
          </div>
        </section >

        {/* Trust & Safety */}
        < section className="w-full py-12 md:py-16 bg-gradient-to-br from-purple-900 to-purple-800 relative overflow-hidden" >
          {/* Decorative background elements */}
          < div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" >
            <div className="absolute top-10 left-10 w-64 h-64 bg-purple-600 rounded-full blur-3xl opacity-30"></div>
            <div className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-600 rounded-full blur-3xl opacity-30"></div>
          </div >

          <div className="container px-4 md:px-6 max-w-screen-lg mx-auto relative z-10">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-lora text-white mb-4">
                Built on Trust & Privacy
              </h2>
              <p className="text-purple-200 text-lg">
                Your wellbeing is our priority
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Ad-Free */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-purple-500 p-4 rounded-full mb-4 shadow-lg">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Ad-Free Experience</h3>
                  <p className="text-purple-100 leading-relaxed">
                    No advertisements, no distractions. Just pure, meaningful conversations with your companion.
                  </p>
                </div>
              </div>

              {/* Privacy First */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-amber-500 p-4 rounded-full mb-4 shadow-lg">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                  <p className="text-purple-100 leading-relaxed">
                    Your conversations stay between you and your companion. We never sell your data. Ever.
                  </p>
                </div>
              </div>

              {/* Hardware Presence */}
              <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all hover:-translate-y-1 shadow-lg">
                <div className="flex flex-col items-center text-center">
                  <div className="bg-pink-500 p-4 rounded-full mb-4 shadow-lg">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">Hardware Presence</h3>
                  <p className="text-purple-100 leading-relaxed">
                    A physical companion disconnects you from internet noise and brings you back to the present.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section >

        {/* YouTube Demo */}
        < div className="bg-gradient-to-b from-white to-purple-50 py-16" >
          <YoutubeDemo caption="SMART मूर्ति Explainer" />
        </div >


      </main >
    </div >
  )
}
