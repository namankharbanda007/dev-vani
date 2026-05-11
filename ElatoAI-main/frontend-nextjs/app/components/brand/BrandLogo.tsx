import Link from "next/link";
import { companyInfo } from "@/app/lib/company";

type BrandLogoProps = {
    href?: string;
    size?: "sm" | "md" | "lg" | "xl";
    tone?: "dark" | "light" | "muted";
    className?: string;
};

const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-7xl",
};

const toneClasses = {
    dark: "text-[#24170f]",
    light: "text-white",
    muted: "text-[#6a5542]",
};

function joinClasses(...classes: Array<string | undefined>) {
    return classes.filter(Boolean).join(" ");
}

export default function BrandLogo({
    href,
    size = "md",
    tone = "dark",
    className,
}: BrandLogoProps) {
    const logoClassName = joinClasses(
        "inline-flex items-baseline whitespace-nowrap font-lora font-bold leading-none tracking-normal",
        sizeClasses[size],
        toneClasses[tone],
        className,
    );

    if (href) {
        return (
            <Link href={href} className={logoClassName} aria-label={`${companyInfo.brandName} home`}>
                {companyInfo.brandName}
            </Link>
        );
    }

    return (
        <span className={logoClassName} aria-label={companyInfo.brandName}>
            {companyInfo.brandName}
        </span>
    );
}
