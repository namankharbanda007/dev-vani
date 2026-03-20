"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

type Product = {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    features: string[];
    url: string;
};

const products: Product[] = [
    {
        id: "1",
        name: "SMART Murti Device",
        description: "Bring devotional guidance, bhajans, and spiritual conversations into your home with our AI-powered Smart Murti ecosystem.",
        price: 55,
        url: "https://smartmurti.com/products",
        imageUrl: "/products/device1.webp",
        features: [
            "Daily spiritual guidance and rituals",
            "Voice-led devotional experiences",
            "First month subscription FREE",
            "Easy to set up in minutes",
        ],
    },
    {
        id: "2",
        name: "SMART Murti Smart Base",
        description: "Upgrade your home mandir with a devotional base built for guided pujas, shared family rituals, and immersive faith-tech experiences.",
        price: 65,
        url: "https://smartmurti.com/products/smart-base",
        imageUrl: "/products/devkit1.webp",
        features: [
            "Built for guided pujas",
            "Family-friendly ritual sessions",
            "Pairs with devotional audio and AI guidance",
            "Designed for the Smart Murti ecosystem",
        ],
    },
];

export default function ProductsSection() {
    return (
        <section className="w-full py-12 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 md:px-6 max-w-screen-sm mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
                        Our Product
                    </h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Everything you need to bring faith-tech into your daily spiritual practice
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {products.map((product) => (
                        <Link href={product.url} key={product.id}>
                            <Card
                                key={product.id}
                                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 
                                     transform transition-all duration-300
                                     hover:shadow-xl hover:border-purple-200
                                     relative
                                     before:absolute before:inset-0 before:opacity-0
                                     hover:before:opacity-100 before:transition-opacity
                                     hover:translate-y-[-2px] cursor-pointer"
                            >
                                <CardContent className="p-0 relative">
                                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                        <div className="w-full md:w-2/5 min-h-[200px] h-full relative rounded-xl overflow-hidden border border-purple-100">
                                            <Image
                                                src={product.imageUrl}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        </div>
                                        <div className="w-full md:w-3/5 flex flex-col gap-4 justify-between min-h-[200px]">
                                            <div className="flex-1 flex flex-col items-start md:text-left">
                                                <h3 className="text-xl font-bold text-purple-900 mb-2">
                                                    {product.name}
                                                </h3>
                                                <p className="text-gray-600 mb-4">
                                                    {product.description}
                                                </p>
                                            </div>

                                            <div className="flex flex-row items-center justify-end gap-4">
                                                <p className="text-2xl font-bold text-purple-900">
                                                    ${product.price}
                                                </p>
                                                <Button
                                                    size="lg"
                                                    className="w-full sm:w-auto flex-row items-center gap-2 px-4 bg-purple-600 text-white border-0 text-md"
                                                >
                                                    <ShoppingCart className="h-4 w-4" /> Buy Now
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
