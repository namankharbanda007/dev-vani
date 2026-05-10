import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LeftNavbarButtonsProps {
    user: IUser | null;
}

export default function LeftNavbarButtons({ user }: LeftNavbarButtonsProps) {
    return (
        <div className="flex flex-row items-center gap-4 sm:gap-10">
            <Button
                variant="ghost"
                className="flex flex-row items-center gap-2 px-2 hover:bg-transparent"
                asChild
                aria-label="Go to home page"
                title="Click to go to home page"
            >
                <Link href={user ? "/home" : "/"}>
                    <p className="flex items-center font-luckiestGuy text-2xl tracking-widest">
                        <span>SMART मूर्ति</span>
                    </p>
                </Link>
            </Button>
        </div>
    );
}
