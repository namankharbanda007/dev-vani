import { notFound } from "next/navigation";
import PujaSessionClient from "./PujaSessionClient";

// Hardcoded map connecting friendly URLs to Supabase personality IDs and rich metadata
const PUJA_METADATA: Record<string, any> = {
    "sundarkand-path": {
        personalityId: "2b5253c2-a23d-4762-8eac-e0b0788cb4f0",
        title: "Sundarkand Path",
        aartiSrc: "/audio/hanuman-aarti.mp3", // Assuming user to provide this later, we set up the structure
        samagriList: [
            { id: "s1", name: "Chameli Tel Diya", icon: "flame" },
            { id: "s2", name: "Sindoor & Chola", icon: "box" },
            { id: "s3", name: "Tulsi Dal & Phool", icon: "flower" },
            { id: "s4", name: "Jal (Water)", icon: "water" },
            { id: "s5", name: "Besan Ladoo Prasad", icon: "box" },
        ]
    },
    "navagraha-shanti": {
        personalityId: "8622d9e6-3271-45df-b3c0-0b9eba1b0301",
        title: "Navagraha Shanti Havan",
        // Aarti might not be specifically needed, but we provide it just in case
        samagriList: [
            { id: "n1", name: "Havan Kund", icon: "flame" },
            { id: "n2", name: "Navagraha Samidha (Wood)", icon: "box" },
            { id: "n3", name: "Ghee", icon: "water" },
            { id: "n4", name: "Havan Samagri", icon: "box" },
            { id: "n5", name: "Jal, Akshat, Phool", icon: "flower" },
        ]
    },
    "satyanarayan-puja": {
        personalityId: "5b7415d8-b68a-489f-bdc3-273a7cae9629",
        title: "Shri Satyanarayan Puja",
        aartiSrc: "/audio/om-jai-jagdish.mp3", // Placeholder for actual audio
        samagriList: [
            { id: "sp1", name: "Chowki & Peela Vastra", icon: "box" },
            { id: "sp2", name: "Kalash, Nariyal, Aam Patte", icon: "water" },
            { id: "sp3", name: "Panchamrit", icon: "water" },
            { id: "sp4", name: "Panjiri Prasad", icon: "box" },
            { id: "sp5", name: "108 Tulsi Dal", icon: "flower" },
        ]
    },
    "ganpati-havan": {
        // We use the first ID returned for Ganpati (ignoring the duplicate for now)
        personalityId: "5363b8f9-cf59-4c91-ba4e-c2433cc591cf",
        title: "Ganpati Havan",
        aartiSrc: "/audio/jai-ganesh-deva.mp3", // Placeholder
        samagriList: [
            { id: "g1", name: "Havan Kund", icon: "flame" },
            { id: "g2", name: "Aam Ki Lakdi", icon: "box" },
            { id: "g3", name: "Ghee", icon: "water" },
            { id: "g4", name: "Durva Grass", icon: "flower" },
            { id: "g5", name: "Gud (Jaggery)", icon: "box" },
        ]
    }
};

export default function PujaPage({ params }: { params: { ritualId: string } }) {
    const metadata = PUJA_METADATA[params.ritualId];

    if (!metadata) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <PujaSessionClient metadata={metadata} />
        </div>
    );
}
