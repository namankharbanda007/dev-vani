import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Airplay, Check, MonitorSmartphone, Phone, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { getPersonalityImageSrc } from "@/lib/utils";
import { EmojiComponent } from "./EmojiImage";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { deletePersonalityAction } from "@/app/actions";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ModifyCharacterSheetProps {
    openPersonality: IPersonality;
    isCurrentPersonality: boolean;
    children: React.ReactNode;
    onPersonalityPicked: (personalityIdPicked: string) => void;
    languageState: string;
    disableButtons: boolean;
}

const ModifyCharacterSheet: React.FC<ModifyCharacterSheetProps> = ({
    openPersonality,
    isCurrentPersonality,
    children,
    onPersonalityPicked,
    languageState,
    disableButtons,
}) => {
    const [isSent, setIsSent] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const isPersonalCharacter = openPersonality.creator_id !== null;
    const isDoctor = openPersonality.is_doctor;

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deletePersonalityAction(openPersonality.personality_id!);
            if (result.error) {
                toast({ title: "Error", description: result.error, variant: "destructive" });
            } else {
                toast({ title: "Success", description: "Character deleted successfully!" });
                router.refresh();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete character.", variant: "destructive" });
        } finally {
            setIsDeleting(false);
        }
    };

    const ButtonsComponent = () => {
        return (
            <div className="flex flex-col gap-3 p-4">
                <div className="flex flex-row gap-4">
                    <Button
                        size="lg"
                        className={`w-full rounded-full text-sm md:text-lg flex flex-row items-center gap-1 md:gap-2 transition-colors duration-300 ${isSent || isCurrentPersonality
                            ? "bg-green-500 hover:bg-green-600"
                            : ""
                            }`}
                        variant={disableButtons ? "upsell_primary" : "default"}
                        disabled={isCurrentPersonality || disableButtons}
                        onClick={() => {
                            setIsSent(true);
                            onPersonalityPicked(openPersonality.personality_id!);
                            setTimeout(() => setIsSent(false), 10000);
                        }}
                    >
                        <Check className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6" />
                        {isSent || isCurrentPersonality
                            ? "Live character"
                            : "Click to chat"}
                    </Button>
                    {/* Edit button available for all characters */}
                    <Link href={`/home/create?edit=true&id=${openPersonality.personality_id}`} className="w-full">
                        <Button
                            size="lg"
                            variant="outline"
                            className="w-full rounded-full text-sm md:text-lg flex flex-row items-center gap-1 md:gap-2"
                        >
                            <Edit className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6" />
                            Edit
                        </Button>
                    </Link>
                </div>
                {/* Delete button with confirmation */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button
                            size="lg"
                            variant="destructive"
                            className="w-full rounded-full text-sm md:text-lg flex flex-row items-center gap-1 md:gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <Loader2 className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                            ) : (
                                <Trash2 className="flex-shrink-0 h-5 w-5 md:h-6 md:w-6" />
                            )}
                            {isDeleting ? "Deleting..." : "Delete Character"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Character?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to delete "{openPersonality.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                                Delete
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        );
    };

    const PersonalCharacterComponent = () => {
        return (
            <>
                {/* <p className="text-gray-400">
                    {"Character prompt"}
                </p>
                <p className="text-gray-600 whitespace-pre-line">
                    {openPersonality.character_prompt}
                </p>
                <p className="text-gray-400">
                    {"First message prompt"}
                </p>
                <p className="text-gray-600">
                    {openPersonality.first_message_prompt}
                </p>
                <p className="text-gray-400">
                    {"Voice prompt"}
                </p>
                <p className="text-gray-600">
                    {openPersonality.voice_prompt}
                </p> */}
            </>
        );
    };

    const ContentComponent = () => {
        return (
            <div className="container mx-auto p-4 max-w-4xl">
                <div className="flex flex-col items-center gap-6">
                    {openPersonality.subtitle && openPersonality.subtitle.startsWith('http') ? (
                        <div className="relative w-full h-[300px] sm:h-[400px]">
                            <Image
                                src={openPersonality.subtitle}
                                alt={openPersonality.title}
                                className="rounded-lg object-top sm:object-center object-cover"
                                fill
                            />
                        </div>
                    ) : isPersonalCharacter ? (
                        <div className="relative w-full h-[100px] sm:h-[200px] flex items-center justify-center">
                            <EmojiComponent personality={openPersonality} size={100} />
                        </div>
                    ) : (
                        <div className="relative w-full h-[300px] sm:h-[400px]">
                            <Image
                                src={getPersonalityImageSrc(openPersonality.key)}
                                alt={openPersonality.title}
                                className="rounded-lg object-top sm:object-center object-cover"
                                fill
                            // style={{
                            //     objectFit: "cover",
                            //     objectPosition: "top sm:center",
                            // }}
                            />
                        </div>
                    )}
                    <div className="space-y-2 text-left w-full relative">
                        {/* <div className="absolute top-0 right-0">
                    <Badge variant="outline">
                        {openPersonality.provider}
                    </Badge>
                </div> */}
                        <div className="flex flex-row items-center gap-2">
                            <h3 className="text-xl font-semibold">
                                {openPersonality.title}
                            </h3>
                        </div>

                        {!openPersonality.subtitle?.startsWith('http') && (
                            <p className="text-gray-400">
                                {openPersonality.subtitle}
                            </p>
                        )}
                        <p className="text-gray-600">
                            {openPersonality.short_description}
                        </p>
                        {(isPersonalCharacter || isDoctor) && (
                            <PersonalCharacterComponent />
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (isDesktop) {
        return (
            <Sheet>
                <SheetTrigger asChild>{children}</SheetTrigger>
                <SheetContent
                    className="rounded-tl-xl gap-0 rounded-bl-xl overflow-y-auto p-0"
                    style={{ maxWidth: "500px" }}
                    side="right"
                >
                    <div className="min-h-[100dvh] flex flex-col">
                        <div className="flex-1">
                            <ContentComponent />
                        </div>
                        <div className="sticky bottom-0 w-full bg-background border-t">
                            <ButtonsComponent />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Drawer>
            <DrawerTrigger asChild>{children}</DrawerTrigger>
            <DrawerContent className="h-[70vh]">
                <div className="flex flex-col h-full overflow-y-auto">
                    <div className="flex-shrink-0">
                        <ButtonsComponent />
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        <ContentComponent />
                    </div>
                </div>
            </DrawerContent>
        </Drawer>
    );
};

export default ModifyCharacterSheet;
