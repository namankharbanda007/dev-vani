export type NriPackage = {
    name: string;
    price: number;
    description: string;
    bestFor: string;
    cta: string;
};

export const nriLaunchPackages: NriPackage[] = [
    {
        name: "Daily Guidance Pack",
        price: 11,
        description: "Text or short voice guidance with Smart Pandit for everyday questions, sankalp, and family calm.",
        bestFor: "First-time NRI families",
        cta: "Start with $11",
    },
    {
        name: "Digital Puja Guide",
        price: 21,
        description: "Step-by-step puja guidance, samagri prep, mantras, and family-ready instructions.",
        bestFor: "Small home pujas",
        cta: "Choose $21",
    },
    {
        name: "Live Family Puja",
        price: 51,
        description: "A shared real-time AI Pandit room where relatives can join from different countries.",
        bestFor: "Family rituals across time zones",
        cta: "Book $51",
    },
    {
        name: "Premium Havan",
        price: 101,
        description: "Deeper ritual flow for protection, graha shanti, healing sankalp, and major family moments.",
        bestFor: "High-intent rituals",
        cta: "Reserve $101",
    },
];

export function formatUsd(amount: number) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(amount);
}
