"use client";

import { usePathname } from "next/navigation";

export function MobileNav({
    items,
}: {
    items: SidebarNavItem[];
}) {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 md:hidden z-50">
            {/* Glassmorphism backdrop */}
            <div className="backdrop-blur-xl bg-white/70 border-t border-white/50 shadow-[0_-4px_30px_rgba(0,0,0,0.05)]">
                <div className="flex justify-around items-center h-16 max-w-lg mx-auto px-2">
                    {items.map((item) => {
                        const isActive = pathname === item.href;

                        // Floating "Create" button
                        if (item.isPrimary) {
                            return (
                                <a
                                    key={item.href}
                                    href={item.href}
                                    className="relative flex items-center justify-center -mt-6 w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:scale-105 transition-all duration-200 active:scale-95"
                                >
                                    <div className="text-white">
                                        {item.icon}
                                    </div>
                                </a>
                            );
                        }

                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className="relative flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200"
                            >
                                {/* Icon */}
                                <div
                                    className={`transition-colors duration-200 ${isActive ? "text-purple-600" : "text-gray-400"
                                        }`}
                                >
                                    {item.icon}
                                </div>
                                {/* Label */}
                                <span
                                    className={`mt-1 text-[11px] transition-colors duration-200 ${isActive
                                            ? "text-purple-600 font-semibold"
                                            : "text-gray-400 font-medium"
                                        }`}
                                >
                                    {item.title}
                                </span>
                                {/* Active dot indicator */}
                                {isActive && (
                                    <div className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-purple-600" />
                                )}
                            </a>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
