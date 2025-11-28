import { Metadata } from "next";
import { getOpenGraphMetadata } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Login",
    ...getOpenGraphMetadata("Login"),
};

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-white">
            {children}
        </div>
    );
}
