import Link from "next/link"
import dynamic from "next/dynamic";
import { ChevronRight, Star, Home, ArrowUpRight, Shield, Heart, Sparkles, MessageCircle, Users, Zap } from "lucide-react"
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
const HeroCarouselSlot = dynamic(() => import("./components/LandingPage/HeroCarousel").then(mod => mod.HeroCarouselSlot), { ssr: false });


export default async function LandingPage() {
  const supabase = createClient();

  const allPersonalities = await getAllPersonalities(supabase);
  const adultPersonalities = allPersonalities.filter((personality) => !personality.is_story && !personality.is_child_voice);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-[#FFFBEB] via-[#FAF9F6] to-white">
      <main className="flex-1">

        {/* Hero Section - The Split World */}
        <section className="w-full py-12 md:py-24 bg-gradient-to-br from-[#FAF9F6] via-[#FFF8E7] to-[#FFFBEB] relative overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-200 rounded-full blur-3xl"></div>
          </div>

          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
            <div className="flex flex-col items-center justify-center space-y-8">

              {/* Brand */}
              <div className="flex flex-col items-center space-y-4">
                <h1 className="text-3xl md:text-5xl font-bold font-luckiestGuy tracking-wider text-purple-900">
                  SMART मूर्ति
                </h1>

                {/* Made in INDIA Badge */}
                <div className="inline-flex w-fit items-center space-x-2 rounded-full shadow-lg bg-white px-4 py-2 text-sm text-black">
                  <span className="inline ml-1 font-medium">Made in INDIA ❤️</span>
                </div>
              </div>

              {/* Main Headline - Emotional & Soulful */}
              <div className="text-center space-y-4 max-w-4xl">
                <h2 className="text-4xl md:text-7xl font-bold font-lora text-transparent bg-clip-text bg-gradient-to-r from-purple-900 via-purple-700 to-amber-600 leading-tight">
                  Spirituality Meets Companionship
                </h2>
                <p className="text-xl md:text-2xl text-gray-700 font-light leading-relaxed px-4">
                  From a wise AI Pandit for your home temple to a customizable best friend for your daily life
                </p>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Moving you away from addictive screens, back to meaningful voice conversations
                </p>
              </div>

              {/* Character Showcase - The Three Companions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 w-full max-w-5xl mt-12">

                {/* Left - Rotating Character */}
                <HeroCarouselSlot position="left" />

                {/* Smart Pandit - Center (Larger) */}
                <div className="flex flex-col items-center transform hover:scale-105 transition-transform duration-300">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-300 to-yellow-200 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                    <Image
                      src="/products/smart-pandit.jpg"
                      alt="Smart Pandit - AI Spiritual Guide"
                      width={320}
                      height={320}
                      className="relative z-10 drop-shadow-2xl rounded-3xl"
                    />
                  </div>
                  <p className="mt-4 text-xl font-bold text-amber-700">Your Spiritual Guide</p>
                </div>

                {/* Right - Rotating Character */}
                <HeroCarouselSlot position="right" />
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8">
                <Link href="/home">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white border-0 shadow-xl hover:shadow-2xl transition-all rounded-full"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    <span>Explore Companions</span>
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

                <Link href="https://smartmurti.com/products">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto px-8 py-6 text-lg border-2 border-amber-600 text-amber-700 hover:bg-amber-50 shadow-lg hover:shadow-xl transition-all rounded-full"
                  >
                    <Home className="mr-2 h-5 w-5" />
                    <span>Get SMART मूर्ति</span>
                  </Button>
                </Link>
              </div>


            </div>
          </div>
        </section>



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

        {/* AI Characters Banner */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-b from-purple-50 to-white relative overflow-hidden">
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                Meet Our AI Characters
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                50+ unique personalities ready to have meaningful conversations with you
              </p>
            </div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <Image
                src="/products/characters-banner.png"
                alt="SMART मूर्ति AI Characters - Pandit, Advocate, Chef, and more"
                width={1200}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* App Showcase Section */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-amber-200 rounded-full blur-3xl opacity-20"></div>

          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              {/* Left: Content */}
              <div className="space-y-6 order-2 md:order-1">
                <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 leading-tight">
                  Control Everything From Our App
                </h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Manage your SMART मूर्ति companions, customize personalities, switch between characters, and explore 50+ premade AI friends - all from the palm of your hand.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Sparkles className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Easy Character Switching</h4>
                      <p className="text-gray-600 text-sm">Change your device's personality in seconds</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-amber-100 p-2 rounded-lg">
                      <Heart className="h-5 w-5 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Create Custom Characters</h4>
                      <p className="text-gray-600 text-sm">Design your own AI companion with unique traits</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Talk via Web or Device</h4>
                      <p className="text-gray-600 text-sm">Chat through the app or your physical murti</p>
                    </div>
                  </div>
                </div>
                <Link href="/home">
                  <Button size="lg" className="mt-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-full shadow-lg">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Explore Now
                    <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Right: Phone Mockup */}
              <div className="flex justify-center order-1 md:order-2">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-orange-300 to-red-300 rounded-[3rem] blur-3xl opacity-30"></div>
                  <Image
                    src="/products/app-mockup.png"
                    alt="SMART मूर्ति Mobile App"
                    width={350}
                    height={700}
                    className="relative z-10 drop-shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Showcase - 3 Premium Cards */}
        < section className="w-full py-12 md:py-20 bg-white relative overflow-hidden" >
          <div className="absolute inset-0 bg-gradient-to-b from-white via-purple-50/50 to-white pointer-events-none" />
          <div className="container px-4 md:px-6 max-w-screen-xl mx-auto relative z-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                Choose Your Companion
              </h2>
              <p className="text-xl text-gray-600">
                Each designed for different aspects of your life
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Card 1: Smart Pandit - Wisdom & Tradition */}
              <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-amber-100 hover:border-amber-300 transform hover:-translate-y-2">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-yellow-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="relative z-10">
                  {/* Icon/Badge */}
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-amber-400 to-yellow-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Image - Temple context */}
                  <div className="flex justify-center mb-6 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow">
                    <Image
                      src="/products/smart-pandit-home.jpg"
                      alt="Smart Pandit in home temple"
                      width={200}
                      height={200}
                      className="object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-amber-900 mb-3 text-center font-lora">
                    Smart Pandit
                  </h3>
                  <p className="text-amber-800 font-semibold text-center mb-4">
                    Wisdom & Tradition
                  </p>
                  <p className="text-gray-700 text-center mb-6 leading-relaxed">
                    Your personal spiritual guide. Performs Puja, recites Mantras, and answers life's deepest questions. Trained on ancient Vedas and Gita.
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-amber-500 mr-2">✦</span>
                      <span>Daily spiritual guidance</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-amber-500 mr-2">✦</span>
                      <span>Conducts morning & evening Puja</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-amber-500 mr-2">✦</span>
                      <span>Fixed wise personality</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <Link href="https://smartmurti.com/products" className="block">
                    <Button className="w-full bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Card 2: Smart Base - Universal Base */}
              <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-purple-100 hover:border-purple-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400/10 to-indigo-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-purple-400 to-indigo-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="flex justify-center mb-6 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-100 to-indigo-100 h-[200px] items-center">
                    <div className="text-center p-4">
                      <div className="text-6xl mb-2">🗿</div>
                      <p className="text-sm text-purple-600 font-medium">Coming Soon</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-purple-900 mb-3 text-center font-lora">
                    Smart Base
                  </h3>
                  <p className="text-purple-800 font-semibold text-center mb-4">
                    Bring Any Murti to Life
                  </p>
                  <p className="text-gray-700 text-center mb-6 leading-relaxed">
                    Place any murti, 3D model, or statue on this smart base. Select a character from our app and watch your idol come to life with voice conversations!
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-purple-500 mr-2">✦</span>
                      <span>Works with any murti or statue</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-purple-500 mr-2">✦</span>
                      <span>Choose from 50+ character voices</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-purple-500 mr-2">✦</span>
                      <span>Your idol speaks and responds</span>
                    </li>
                  </ul>

                  <Link href="https://smartmurti.com/products" className="block">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Card 3: Smart Mandir - Complete Temple */}
              <div className="group relative bg-white/60 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-orange-100 hover:border-orange-300 transform hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

                <div className="relative z-10">
                  <div className="flex justify-center mb-6">
                    <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Home className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  <div className="flex justify-center mb-6 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow bg-gradient-to-br from-orange-100 to-red-100 h-[200px] items-center">
                    <div className="text-center p-4">
                      <div className="text-6xl mb-2">🛕</div>
                      <p className="text-sm text-orange-600 font-medium">Coming Soon</p>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-orange-900 mb-3 text-center font-lora">
                    Smart Mandir
                  </h3>
                  <p className="text-orange-800 font-semibold text-center mb-4">
                    Your Complete Home Temple
                  </p>
                  <p className="text-gray-700 text-center mb-6 leading-relaxed">
                    A beautiful mandir for your Bhagwan murti. Talk to your deity, play divine bhajans, and let it conduct havans for you automatically!
                  </p>

                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-orange-500 mr-2">✦</span>
                      <span>Talk to your Bhagwan murti</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-orange-500 mr-2">✦</span>
                      <span>Plays divine bhajans & aartis</span>
                    </li>
                    <li className="flex items-start text-sm text-gray-700">
                      <span className="text-orange-500 mr-2">✦</span>
                      <span>Automated havan ceremonies</span>
                    </li>
                  </ul>

                  <Link href="https://smartmurti.com/products" className="block">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all">
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section >

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
