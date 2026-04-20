import Image from "next/image";
import { LoginForm } from "./login-form";

interface LoginProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Login({ searchParams }: LoginProps) {
  return (
    <div className="flex min-h-screen w-full bg-[#faf4ea]">
      <div className="relative hidden overflow-hidden border-r border-[#eadfcf] bg-[#2a1f18] lg:flex lg:w-[52%]">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2a1f18]/35 via-[#6d5128]/25 to-black/40" />
        <Image
          src="/login-hero.jpg"
          alt="SMART मूर्ति family spiritual guidance"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-12 text-white">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-[#f3c97c]">
            SMART मूर्ति
          </p>
          <h2 className="mb-4 max-w-xl font-lora text-4xl font-bold leading-tight">
            Talk to Smart Pandit now. Bring your family in when the moment gets bigger.
          </h2>
          <p className="max-w-lg text-lg leading-8 text-[#f2eadf]">
            Instant spiritual guidance, multilingual rituals, and live family puja access for Hindu families anywhere in the world.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm font-medium text-[#f8f2e8]">
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              Live multilingual guidance
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2">
              Family can join from anywhere
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-[linear-gradient(180deg,#fffaf3_0%,#fff6eb_48%,#f8efe3_100%)] p-6 md:p-10">
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  );
}
