import { Button } from "@/components/ui/button";
import { Home, Sparkle, ChevronDown, Dog, Bird, Hop, Plus, Blocks, Gamepad2, Link } from "lucide-react";
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
            variant="outline"
            className="flex flex-row gap-2 items-center px-4 py-2 rounded-lg"
            asChild
            aria-label="Go to Home page"
            title="Click to go to Home page"
        >
            <a href="https://www.Smartmurti.com">
                <Link size={18} className="mr-1" />
                <span className="text-md font-normal mr-1">Worlds First</span>
                <p className="text-xl text-gray-600 text-center max-w-[600px]">
                    <span className="text-black font-bold">SMART</span>
                    <span className="text-orange-600 font-devanagari text-2xl ml-1">मूर्ति</span>
                </p>
                <span className="text-xl"></span>
            </a>
        </Button>
    </div>
    );
}
