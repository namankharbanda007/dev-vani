import {
    Mail,
    Menu,
    CalendarCheck,
    Star,
    Box,
    LogIn,
    HomeIcon,
    Hospital,
    BookOpen,
    Blocks,
    Gamepad2,
    Cpu,
    CreditCard,
    Bell,
    Settings,
    User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    businessDemoLink,
    feedbackFormLink,
    tiktokLink,
} from "@/lib/data";
import PremiumBadge from "../PremiumBadge";
import { useEffect, useState } from "react";
import { isPremiumUser } from "@/app/actions";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

interface NavbarMenuButtonProps {
    user: IUser | null;
}
const ICON_SIZE = 22;

export function NavbarDropdownMenu({ user }: NavbarMenuButtonProps) {
    const [premiumUser, setPremiumUser] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const setUserPremium = async () => {
            if (user) {
                const isPremium = await isPremiumUser(user.user_id);
                setPremiumUser(isPremium ?? false);
            }
        };
        setUserPremium();
    }, [user]);

    // Placeholder notifications (will be dynamic later)
    const notifications = [
        { id: 1, text: "🪔 Your daily horoscope is ready!", time: "2 min ago", read: false },
        { id: 2, text: "🎉 New personality added: Vastu Expert", time: "1 hr ago", read: false },
        { id: 3, text: "🙏 Reminder: Satyanarayan Puja tomorrow", time: "3 hrs ago", read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const LoggedInItems: React.FC = () => {
        return (
            <DropdownMenuItem>
                <Link
                    href="/home"
                    passHref
                    className="flex flex-row gap-2 w-full"
                >
                    <HomeIcon size={ICON_SIZE} />
                    <span>Home</span>
                </Link>
            </DropdownMenuItem>
        );
    };

    const LoggedOutItems: React.FC = () => {
        return (
            <DropdownMenuItem>
                <Link
                    href="/login"
                    passHref
                    className="flex flex-row gap-2 w-full"
                >
                    <LogIn size={ICON_SIZE} />
                    <span>Login</span>
                </Link>
            </DropdownMenuItem>
        );
    };

    return (
        <div className="flex items-center gap-2">
            {/* Notification Bell */}
            {user && (
                <div className="relative">
                    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="relative rounded-full w-10 h-10 p-0 focus:outline-none focus:ring-0 focus-visible:ring-0 shadow-none"
                            >
                                <Bell size={20} className="text-gray-600" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                                        {unreadCount}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            className="w-80 p-0 rounded-2xl overflow-hidden"
                            side="bottom"
                            align="end"
                        >
                            <div className="px-4 py-3 bg-gradient-to-r from-purple-500/10 to-amber-500/10 border-b border-gray-100">
                                <h3 className="font-semibold text-sm text-gray-800">Notifications</h3>
                            </div>
                            <div className="max-h-72 overflow-y-auto">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-b-0 ${!notification.read ? 'bg-purple-50/40' : ''}`}
                                    >
                                        <p className="text-sm text-gray-700">{notification.text}</p>
                                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                                <button className="text-xs text-purple-600 hover:text-purple-800 font-medium w-full text-center">
                                    Mark all as read
                                </button>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}

            {/* Profile Avatar Dropdown */}
            <DropdownMenu
                onOpenChange={(open) => {
                    if (!open) {
                        document.activeElement instanceof HTMLElement &&
                            document.activeElement.blur();
                    }
                }}
            >
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full p-0 w-10 h-10 overflow-hidden
                        focus:outline-none focus:ring-0 focus:ring-transparent 
                        focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent 
                        shadow-none focus:shadow-none focus-visible:shadow-none
                        border-2 border-transparent hover:border-purple-300 transition-all"
                    >
                        {user?.avatar_url ? (
                            <Image
                                src={user.avatar_url.startsWith('http') ? user.avatar_url : user.avatar_url.startsWith('/') ? user.avatar_url : `/${user.avatar_url}`}
                                alt="Profile"
                                width={40}
                                height={40}
                                className="w-full h-full object-cover rounded-full"
                                unoptimized
                            />
                        ) : user ? (
                            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm rounded-full">
                                {(user.supervisee_name || user.email || '?').charAt(0).toUpperCase()}
                            </div>
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-full">
                                <User size={18} className="text-gray-500" />
                            </div>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    className="w-64 p-2 sm:mt-2 rounded-2xl shadow-xl border border-gray-100"
                    side="bottom"
                    align="end"
                >
                    {/* User Header */}
                    {user && (
                        <>
                            <div className="px-3 py-3 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-purple-200">
                                    {user.avatar_url ? (
                                        <Image
                                            src={user.avatar_url.startsWith('http') ? user.avatar_url : user.avatar_url.startsWith('/') ? user.avatar_url : `/${user.avatar_url}`}
                                            alt="Profile"
                                            width={40}
                                            height={40}
                                            className="w-full h-full object-cover"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-amber-500 flex items-center justify-center text-white font-bold text-sm">
                                            {(user.supervisee_name || user.email || '?').charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <p className="font-semibold text-sm text-gray-800 truncate">
                                        {user.supervisee_name || 'Welcome!'}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                        </>
                    )}

                    {!!user && premiumUser ? (
                        <DropdownMenuLabel className="flex w-full justify-center py-1">
                            <PremiumBadge currentUserId={user.user_id} displayText />
                        </DropdownMenuLabel>
                    ) : null}

                    <DropdownMenuGroup>
                        {user ? <LoggedInItems /> : <LoggedOutItems />}

                        {user && (
                            <DropdownMenuItem>
                                <Link
                                    href="/home/settings"
                                    passHref
                                    className="flex flex-row gap-2 w-full"
                                >
                                    <Settings size={ICON_SIZE} />
                                    <span>Profile & Settings</span>
                                </Link>
                            </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href="/pricing"
                                passHref
                                className="flex flex-row gap-2 w-full"
                            >
                                <CreditCard size={ICON_SIZE} />
                                <span>Pricing</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <div className="flex flex-row gap-2">
                        <Link
                            href="https://smartmurti.com/products"
                            passHref
                            className="flex rounded-lg flex-row gap-2 items-center flex-1 bg-amber-100 dark:bg-amber-900/40 px-2 py-2 text-amber-800 dark:text-amber-200 hover:bg-yellow-100 dark:hover:bg-amber-900/60 transition-colors"
                        >
                            <Box
                                size={ICON_SIZE}
                                className="text-amber-600 dark:text-amber-400"
                            />
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-xs text-amber-900 dark:text-amber-200">
                                    Smart Murti
                                </span>
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                    View Products
                                </span>
                            </div>
                        </Link>
                        <Link
                            href="/pricing"
                            passHref
                            className="flex rounded-lg flex-row gap-2 items-center flex-1 bg-purple-100 dark:bg-purple-900/40 px-2 py-2 text-purple-800 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
                        >
                            <Cpu
                                size={ICON_SIZE}
                                className="text-purple-600 dark:text-purple-400"
                            />
                            <div className="flex flex-col items-center">
                                <span className="font-medium text-xs text-purple-900 dark:text-purple-200">
                                    See Plans
                                </span>
                                <span className="text-xs text-purple-600 dark:text-purple-400">
                                    Pricing
                                </span>
                            </div>
                        </Link>
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
