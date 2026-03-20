import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { businessDemoLink } from "@/lib/data";
import { NavbarDropdownMenu } from "./NavbarDropdownMenu";
import PremiumBadge from "../PremiumBadge";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { usePathname } from "next/navigation";
import { Users, Settings, Music, CreditCard, Sparkles, Phone } from "lucide-react";

interface NavbarButtonsProps {
    user: IUser | null;
    isHome: boolean;
}

const NavbarButtons: React.FC<NavbarButtonsProps> = ({
    user,
    isHome,
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");
    const pathname = usePathname();

    return (
        <div
            className={`flex flex-row sm:gap-2 ${isHome ? "gap-2" : ""
                } items-center font-bold text-sm `}
        >
            {isHome && user && (
                <div className="flex flex-row gap-4 items-center mr-4">
                    {!isMobile && (
                        <>
                            <Link href="/home" passHref>
                                <Button
                                    variant="ghost"
                                    className={`flex flex-row gap-2 items-center ${pathname === "/home" ? "text-primary" : "text-muted-foreground"}`}
                                >
                                    <Users size={20} />
                                    <span>Guides</span>
                                </Button>
                            </Link>
                            <Link href="/bhajan" passHref>
                                <Button
                                    variant="ghost"
                                    className={`flex flex-row gap-2 items-center ${pathname === "/bhajan" ? "text-primary" : "text-muted-foreground"}`}
                                >
                                    <Music size={20} />
                                    <span>Bhajan</span>
                                </Button>
                            </Link>
                            <Link href="/wallet" passHref>
                                <Button
                                    variant="ghost"
                                    className={`flex flex-row gap-2 items-center ${pathname === "/wallet" ? "text-primary" : "text-muted-foreground"}`}
                                >
                                    <CreditCard size={20} />
                                    <span>Wallet</span>
                                </Button>
                            </Link>
                            <Link href="/home/settings" passHref>
                                <Button
                                    variant="ghost"
                                    className={`flex flex-row gap-2 items-center ${pathname === "/home/settings" ? "text-primary" : "text-muted-foreground"}`}
                                >
                                    <Settings size={20} />
                                    <span>Settings</span>
                                </Button>
                            </Link>
                        </>
                    )}
                    <PremiumBadge currentUserId={user.user_id} />
                </div>
            )}

            {!isHome && !isMobile && (
                <>
                    <Link href="/pandit" passHref tabIndex={-1}>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="flex flex-row gap-2 items-center rounded-full text-muted-foreground"
                        >
                            <Phone size={18} />
                            <span className="hidden sm:flex font-normal">
                                Pandit
                            </span>
                        </Button>
                    </Link>
                    <Link href="/astrologer" passHref tabIndex={-1}>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="flex flex-row gap-2 items-center rounded-full text-muted-foreground"
                        >
                            <Sparkles size={18} />
                            <span className="hidden sm:flex font-normal">
                                Astrologer
                            </span>
                        </Button>
                    </Link>
                    <Link href="/pricing" passHref tabIndex={-1}>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="flex flex-row gap-2 items-center rounded-full bg-nav-bar focus:shadow-none focus-visible:shadow-none"
                        >
                            <CreditCard size={20} />
                            <span className="hidden sm:flex font-normal">
                                Pricing
                            </span>
                        </Button>
                    </Link>
                </>
            )}
            <NavbarDropdownMenu user={user} />
        </div>
    );
};

export default NavbarButtons;
