import {
    CreditCard,
    HomeIcon,
    LogIn,
    Phone,
    Settings,
    Star,
    User,
    Wallet,
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
import PremiumBadge from "../PremiumBadge";
import { useEffect, useState } from "react";
import { isPremiumUser } from "@/app/actions";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";

interface NavbarMenuButtonProps {
    user: IUser | null;
}

const ICON_SIZE = 22;

function profileImageSrc(user: IUser) {
    if (!user.avatar_url) return null;
    if (user.avatar_url.startsWith("http") || user.avatar_url.startsWith("/")) {
        return user.avatar_url;
    }
    return `/${user.avatar_url}`;
}

function Avatar({ user }: { user: IUser | null }) {
    const src = user ? profileImageSrc(user) : null;

    if (src && user) {
        return (
            <Image
                src={src}
                alt="Profile"
                width={40}
                height={40}
                className="h-full w-full rounded-full object-cover"
                unoptimized
            />
        );
    }

    if (user) {
        return (
            <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-[#512A73] to-[#C86B1F] text-sm font-bold text-white">
                {(user.supervisee_name || user.email || "?").charAt(0).toUpperCase()}
            </div>
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200">
            <User size={18} className="text-gray-500" />
        </div>
    );
}

export function NavbarDropdownMenu({ user }: NavbarMenuButtonProps) {
    const [premiumUser, setPremiumUser] = useState(false);

    useEffect(() => {
        const setUserPremium = async () => {
            if (user) {
                const isPremium = await isPremiumUser(user.user_id);
                setPremiumUser(isPremium ?? false);
            }
        };
        setUserPremium();
    }, [user]);

    return (
        <div className="flex items-center gap-2">
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
                        className="h-10 w-10 overflow-hidden rounded-full border-2 border-transparent p-0 shadow-none transition-all hover:border-[#C86B1F]/40 focus:outline-none focus:ring-0 focus:ring-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                    >
                        <Avatar user={user} />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    className="w-64 rounded-2xl border border-[#eadfcf] p-2 shadow-xl sm:mt-2"
                    side="bottom"
                    align="end"
                >
                    {user ? (
                        <>
                            <div className="flex items-center gap-3 px-3 py-3">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border-2 border-[#eadfcf]">
                                    <Avatar user={user} />
                                </div>
                                <div className="flex min-w-0 flex-col">
                                    <p className="truncate text-sm font-semibold text-gray-800">
                                        {user.supervisee_name || "Welcome"}
                                    </p>
                                    <p className="truncate text-xs text-gray-500">{user.email}</p>
                                </div>
                            </div>
                            <DropdownMenuSeparator />
                        </>
                    ) : null}

                    {user && premiumUser ? (
                        <DropdownMenuLabel className="flex w-full justify-center py-1">
                            <PremiumBadge currentUserId={user.user_id} displayText />
                        </DropdownMenuLabel>
                    ) : null}

                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Link
                                href={user ? "/home" : "/login"}
                                passHref
                                className="flex w-full flex-row gap-2"
                            >
                                {user ? <HomeIcon size={ICON_SIZE} /> : <LogIn size={ICON_SIZE} />}
                                <span>{user ? "Home" : "Login"}</span>
                            </Link>
                        </DropdownMenuItem>

                        {user ? (
                            <DropdownMenuItem>
                                <Link href="/home/settings" passHref className="flex w-full flex-row gap-2">
                                    <Settings size={ICON_SIZE} />
                                    <span>Profile & Settings</span>
                                </Link>
                            </DropdownMenuItem>
                        ) : null}

                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link href="/pricing" passHref className="flex w-full flex-row gap-2">
                                <CreditCard size={ICON_SIZE} />
                                <span>Pricing</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/pandit" passHref className="flex w-full flex-row gap-2">
                                <Phone size={ICON_SIZE} />
                                <span>Pandit</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Link href="/astrologer" passHref className="flex w-full flex-row gap-2">
                                <Star size={ICON_SIZE} />
                                <span>Astrologer</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />
                    <div className="flex flex-row gap-2">
                        <Link
                            href="/wallet"
                            passHref
                            className="flex flex-1 flex-row items-center gap-2 rounded-lg bg-amber-100 px-2 py-2 text-amber-800 transition-colors hover:bg-yellow-100 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-900/60"
                        >
                            <Wallet size={ICON_SIZE} className="text-amber-600 dark:text-amber-400" />
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-amber-900 dark:text-amber-200">
                                    Wallet
                                </span>
                                <span className="text-xs text-amber-600 dark:text-amber-400">
                                    Balance
                                </span>
                            </div>
                        </Link>
                        <Link
                            href="/pricing"
                            passHref
                            className="flex flex-1 flex-row items-center gap-2 rounded-lg bg-purple-100 px-2 py-2 text-purple-800 transition-colors hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:hover:bg-purple-900/60"
                        >
                            <CreditCard size={ICON_SIZE} className="text-purple-600 dark:text-purple-400" />
                            <div className="flex flex-col items-center">
                                <span className="text-xs font-medium text-purple-900 dark:text-purple-200">
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
