"use client";

import { useState } from "react";
import { Check, Flame, Flower2, Droplets, Box } from "lucide-react";

interface SamagriItem {
    id: string;
    name: string;
    icon: "flame" | "flower" | "water" | "box";
}

interface SamagriChecklistProps {
    items: SamagriItem[];
    title?: string;
}

export default function SamagriChecklist({ items, title = "Puja Samagri" }: SamagriChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

    const toggleItem = (id: string) => {
        const newSet = new Set(checkedItems);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setCheckedItems(newSet);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "flame": return <Flame size={16} className="text-orange-500" />;
            case "flower": return <Flower2 size={16} className="text-pink-500" />;
            case "water": return <Droplets size={16} className="text-blue-400" />;
            case "box": default: return <Box size={16} className="text-stone-400" />;
        }
    };

    const progress = Math.round((checkedItems.size / items.length) * 100) || 0;

    return (
        <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-5 backdrop-blur-md w-full">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-medium text-lg">{title}</h3>
                <span className="text-stone-400 text-sm font-mono">{checkedItems.size}/{items.length} Ready</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-stone-800 rounded-full h-1.5 mb-6 overflow-hidden">
                <div
                    className="bg-orange-500 h-1.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => {
                    const isChecked = checkedItems.has(item.id);
                    return (
                        <div
                            key={item.id}
                            onClick={() => toggleItem(item.id)}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isChecked
                                    ? "bg-orange-500/10 border border-orange-500/20"
                                    : "bg-stone-800/40 border border-transparent hover:bg-stone-800/80"
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-colors ${isChecked
                                    ? "bg-orange-500 border-orange-500 text-white"
                                    : "border-stone-600 bg-stone-800/50"
                                }`}>
                                {isChecked && <Check size={14} strokeWidth={3} />}
                            </div>

                            <div className="flex-1 flex items-center gap-2">
                                <div className={`p-1.5 rounded-md ${isChecked ? "bg-stone-900/50" : "bg-stone-800"}`}>
                                    {getIcon(item.icon)}
                                </div>
                                <span className={`text-sm transition-colors ${isChecked ? "text-orange-200" : "text-stone-300"}`}>
                                    {item.name}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
