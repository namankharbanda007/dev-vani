import { Button } from "@/components/ui/button";
import { NavbarDropdownMenu } from "./NavbarDropdownMenu";
import PremiumBadge from "../PremiumBadge";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface NavbarButtonsProps {
    user: IUser | null;
    stars: number | null;
    isHome: boolean;
}

const NavbarButtons: React.FC<NavbarButtonsProps> = ({
    user,
    stars,
    isHome,
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <div
            className={`flex flex-row sm:gap-2 ${
                isHome ? "gap-2" : ""
            } items-center font-bold text-sm `}
        >
            {isHome && user && (
                <div className="mr-2">
                    <PremiumBadge currentUserId={user.user_id} />
                </div>
            )}
            {/* Removed public GitHub and Business demo buttons for security/privacy reasons. */}
            <NavbarDropdownMenu user={user} stars={stars} />
        </div>
    );
};

export default NavbarButtons;
