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
import { FaTiktok } from "react-icons/fa";
import {
    businessDemoLink,
    feedbackFormLink,
    tiktokLink,
} from "@/lib/data";
import PremiumBadge from "../PremiumBadge";
import { useEffect, useState } from "react";
import { isPremiumUser } from "@/app/actions";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { usePathname } from "next/navigation";
interface NavbarMenuButtonProps {
    user: IUser | null;
}
const ICON_SIZE = 22;

export function NavbarDropdownMenu({ user }: NavbarMenuButtonProps) {
    const [premiumUser, setPremiumUser] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const setUserPremium = async () => {
            if (user) {
                const isPremium = await isPremiumUser(user.user_id);
                setPremiumUser(isPremium ?? false);
            }
        };
        setUserPremium();
    }, [user]);

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
        <DropdownMenu
            onOpenChange={(open) => {
                if (!open) {
                    // Remove focus from any active element when dropdown closes
                    document.activeElement instanceof HTMLElement &&
                        document.activeElement.blur();
                }
            }}
        >
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex flex-row gap-2 items-center rounded-full 
                    focus:outline-none focus:ring-0 focus:ring-transparent 
                    focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent 
                    shadow-none focus:shadow-none focus-visible:shadow-none"                    >
                    <Menu size={20} />
                    <span className="hidden sm:flex font-normal">
                        {user ? "Home" : "Login"}
                    </span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-60 p-2 sm:mt-2 rounded-lg"
                side="bottom"
                align="end"
            >
                {!!user && premiumUser ? (
                    <DropdownMenuLabel className="flex w-full justify-center">
                        <PremiumBadge currentUserId={user.user_id} displayText />
                    </DropdownMenuLabel>
                ) : null}
                <DropdownMenuGroup>
                    {user ? <LoggedInItems /> : <LoggedOutItems />}
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
    );
}
