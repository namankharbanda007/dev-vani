import { Button } from "@/components/ui/button";
import { Home, Sparkle, ChevronDown, Dog, Bird, Hop, Plus, Blocks, Gamepad2 } from "lucide-react";
import {
    DropdownMenuSeparator,
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuGroup,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Image from "next/image";

const ICON_SIZE = 22;

interface LeftNavbarButtonsProps {
    user: IUser | null;
}

export default function LeftNavbarButtons({ user }: LeftNavbarButtonsProps) {
    const isDoctor = user?.user_info.user_type === "doctor";
    const pathname = usePathname();

    let firstWordOfHospital = '';
    if (isDoctor) {
        const hospitalName = (user?.user_info.user_metadata as IDoctorMetadata).hospital_name;
        firstWordOfHospital = hospitalName ? hospitalName.split(' ')[0] : '';
    }

    const isRoot = pathname === "/";
    const isHome = pathname.includes("/home");

    const shouldShowHospital = isDoctor && firstWordOfHospital.length && isHome;

    return (
        <div className="flex flex-row gap-4 sm:gap-10 items-center">
            <Button
                variant="ghost"
                className="flex flex-row gap-2 items-center px-2 hover:bg-transparent"
                asChild
                aria-label="Go to Home page"
                title="Click to go to Home page"
            >
                <a href="https://www.smartmurti.com">
                    <p className="flex items-center font-luckiestGuy tracking-widest text-2xl">
                        <span>SMART मूर्ति</span>
                    </p>
                </a>
            </Button>
        </div>
    );
}
