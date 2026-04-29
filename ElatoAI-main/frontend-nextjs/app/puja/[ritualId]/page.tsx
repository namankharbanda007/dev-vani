import { notFound } from "next/navigation";
import PujaSessionClient from "./PujaSessionClient";
import { getLivePujaRitual, isLivePujaRitualId } from "@/lib/livePujaRituals";

export default function PujaPage({ params }: { params: { ritualId: string } }) {
    const metadata = isLivePujaRitualId(params.ritualId)
        ? getLivePujaRitual(params.ritualId)
        : null;

    if (!metadata) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <PujaSessionClient metadata={metadata} />
        </div>
    );
}
