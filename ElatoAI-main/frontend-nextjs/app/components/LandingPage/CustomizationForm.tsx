"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const hobbies = [
    { id: "reading", label: "📚 Reading", color: "bg-green-100 text-green-700 hover:bg-green-200" },
    { id: "sports", label: "⚽ Sports", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
    { id: "music", label: "🎵 Music", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
    { id: "art", label: "🎨 Art & Drawing", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
    { id: "gaming", label: "🎮 Gaming", color: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
    { id: "nature", label: "🌳 Nature", color: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200" },
    { id: "cooking", label: "🍳 Cooking", color: "bg-red-100 text-red-700 hover:bg-red-200" },
    { id: "storytelling", label: "📖 Storytelling", color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
];

const personalities = [
    "Funny & Playful",
    "Serious & Thoughtful",
    "Shy & Gentle",
    "Adventurous & Brave",
    "Caring & Empathetic",
    "Curious & Inquisitive",
    "Calm & Patient",
    "Energetic & Enthusiastic",
];

export default function CustomizationForm() {
    const [gender, setGender] = useState<"boy" | "girl" | null>(null);
    const [name, setName] = useState("");
    const [age, setAge] = useState([25]);
    const [personality, setPersonality] = useState("");
    const [selectedHobbies, setSelectedHobbies] = useState<string[]>([]);
    const [backstory, setBackstory] = useState("");

    const toggleHobby = (hobbyId: string) => {
        setSelectedHobbies(prev =>
            prev.includes(hobbyId)
                ? prev.filter(h => h !== hobbyId)
                : [...prev, hobbyId]
        );
    };

    return (
        <section className="w-full py-20 bg-gradient-to-b from-purple-50 to-white">
            <div className="container px-4 md:px-6 max-w-screen-lg mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold font-lora text-gray-900 mb-4">
                        How to Customize Your Friend
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Create a truly unique companion. Try it out below!
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Step 1: Choose Gender & Appearance */}
                    <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    1
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Choose Gender & Appearance</h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Select whether you want a Boy or Girl companion.
                                </p>

                                <div className="flex gap-4">
                                    <Button
                                        onClick={() => setGender("boy")}
                                        variant={gender === "boy" ? "default" : "outline"}
                                        className={`flex-1 py-6 text-lg rounded-xl ${gender === "boy"
                                                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                                                : "border-2 border-cyan-200 hover:bg-cyan-50"
                                            }`}
                                    >
                                        Boy (Blue theme)
                                    </Button>
                                    <Button
                                        onClick={() => setGender("girl")}
                                        variant={gender === "girl" ? "default" : "outline"}
                                        className={`flex-1 py-6 text-lg rounded-xl ${gender === "girl"
                                                ? "bg-gradient-to-r from-pink-500 to-red-600 text-white"
                                                : "border-2 border-pink-200 hover:bg-pink-50"
                                            }`}
                                    >
                                        Girl (Pink theme)
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: Name Your Companion */}
                    <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-8 border-2 border-cyan-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    2
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Give Them a Name</h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Choose a meaningful name that feels right to you.
                                </p>

                                <Input
                                    placeholder='e.g., "Aarav", "Saanvi", "Rohan", "Ananya"'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-lg py-6 rounded-xl border-2 border-cyan-200 focus:border-cyan-400"
                                />
                                {name && (
                                    <p className="mt-2 text-sm text-cyan-700">
                                        Great choice! "{name}" is a beautiful name. ✨
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Select Age & Maturity */}
                    <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 border-2 border-amber-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    3
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Set Age & Maturity Level</h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Decide how old your companion is (5-50 years).
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-amber-700">{age[0]} years old</span>
                                        <span className="text-sm text-gray-600">
                                            {age[0] <= 12 ? "Child" : age[0] <= 19 ? "Teen" : "Adult"}
                                        </span>
                                    </div>
                                    <Slider
                                        value={age}
                                        onValueChange={setAge}
                                        min={5}
                                        max={50}
                                        step={1}
                                        className="w-full"
                                    />
                                    <p className="text-sm text-gray-600">
                                        {age[0] <= 12 && "Playful talks and fun activities"}
                                        {age[0] > 12 && age[0] <= 19 && "Relatable conversations and shared interests"}
                                        {age[0] > 19 && "Deep discussions and mature topics"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: Define Personality Traits */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    4
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Define Personality Traits</h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Choose the personality that matches what you're looking for.
                                </p>

                                <Select value={personality} onValueChange={setPersonality}>
                                    <SelectTrigger className="text-lg py-6 rounded-xl border-2 border-purple-200">
                                        <SelectValue placeholder="Select a personality..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {personalities.map((p) => (
                                            <SelectItem key={p} value={p} className="text-lg py-3">
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {personality && (
                                    <p className="mt-2 text-sm text-purple-700">
                                        Perfect! A {personality.toLowerCase()} companion will be great! 🎭
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 5: Choose Hobbies & Interests */}
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-green-500 to-teal-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    5
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Select Hobbies & Interests</h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Pick hobbies they can share and talk about! (Select multiple)
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    {hobbies.map((hobby) => (
                                        <button
                                            key={hobby.id}
                                            onClick={() => toggleHobby(hobby.id)}
                                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedHobbies.includes(hobby.id)
                                                    ? hobby.color.replace("100", "200") + " ring-2 ring-offset-2 ring-green-400 scale-105"
                                                    : hobby.color
                                                }`}
                                        >
                                            {hobby.label}
                                            {selectedHobbies.includes(hobby.id) && " ✓"}
                                        </button>
                                    ))}
                                </div>
                                {selectedHobbies.length > 0 && (
                                    <p className="mt-3 text-sm text-green-700">
                                        {selectedHobbies.length} {selectedHobbies.length === 1 ? "hobby" : "hobbies"} selected!
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Step 6: Create Their Backstory */}
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 border-2 border-red-100">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="flex-shrink-0">
                                <div className="bg-gradient-to-br from-red-500 to-orange-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg">
                                    6
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">Write Their Backstory</h3>
                                <p className="text-gray-700 mb-4 leading-relaxed">
                                    Create a brief history. Where are they from? What do they love? What are their dreams?
                                </p>

                                <Textarea
                                    placeholder="Example: Aarav loves cricket and dreams of becoming a fast bowler. He grew up in Mumbai and enjoys rainy evenings with chai. He's always ready to cheer you up with funny stories..."
                                    value={backstory}
                                    onChange={(e) => setBackstory(e.target.value)}
                                    className="min-h-[150px] text-base rounded-xl border-2 border-red-200 focus:border-red-400"
                                />
                                {backstory && (
                                    <p className="mt-2 text-sm text-red-700">
                                        {backstory.length} characters - Looking good! 📖
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview Summary */}
                {(gender || name || personality || selectedHobbies.length > 0 || backstory) && (
                    <div className="mt-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-8 border-2 border-purple-200">
                        <h3 className="text-2xl font-bold text-purple-900 mb-4">Your Companion Preview</h3>
                        <div className="space-y-2 text-gray-800">
                            {gender && <p><strong>Gender:</strong> {gender === "boy" ? "Boy 👦" : "Girl 👧"}</p>}
                            {name && <p><strong>Name:</strong> {name}</p>}
                            <p><strong>Age:</strong> {age[0]} years old</p>
                            {personality && <p><strong>Personality:</strong> {personality}</p>}
                            {selectedHobbies.length > 0 && (
                                <p><strong>Hobbies:</strong> {selectedHobbies.map(id => hobbies.find(h => h.id === id)?.label).join(", ")}</p>
                            )}
                            {backstory && <p><strong>Backstory:</strong> "{backstory.substring(0, 100)}{backstory.length > 100 ? "..." : ""}"</p>}
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="text-center mt-16">
                    <Link href="/home">
                        <Button size="lg" className="px-12 py-6 text-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all">
                            Start Creating Your Friend Now
                            <ChevronRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <p className="text-sm text-gray-500 mt-4">No credit card required • Takes only 5 minutes</p>
                </div>
            </div>
        </section>
    );
}
