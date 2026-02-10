import Image from "next/image";
import { LoginForm } from "./login-form";

interface LoginProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Login({ searchParams }: LoginProps) {

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-purple-900">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-black/20 z-10" />
        <Image
          src="/login-hero.jpg"
          alt="SMART मूर्ति Family"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute bottom-0 left-0 right-0 p-12 z-20 bg-gradient-to-t from-black/80 to-transparent text-white">
          <h2 className="text-4xl font-bold font-lora mb-4">Spirituality Meets Companionship</h2>
          <p className="text-lg text-gray-200 max-w-md">
            Join thousands of families discovering the magic of AI-powered spiritual guidance and companionship.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <LoginForm searchParams={searchParams} />
      </div>
    </div>
  );
}
