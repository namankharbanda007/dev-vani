import { redirect } from "next/navigation";
import { Metadata } from "next";
import { getOpenGraphMetadata } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Settings",
    ...getOpenGraphMetadata("Settings"),
};

export default async function Home({
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    redirect("/home");
}
