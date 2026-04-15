import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4">
      {recaptchaSiteKey ? (
        <Script
          src={`https://www.google.com/recaptcha/api.js?render=${recaptchaSiteKey}`}
          strategy="afterInteractive"
        />
      ) : null}
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/aurora-logo.png"
              alt="Aurora Vehicles — Auto dash cam and accessories"
              width={280}
              height={120}
              className="h-20 w-auto object-contain opacity-95"
            />
          </div>
          <h1 className="mt-5 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight">Admin</h1>
          <p className="mt-2 text-sm text-zinc-400">Sign in to continue.</p>
        </div>
        <LoginForm />
        <p className="text-center text-xs text-zinc-500">
          <Link href="/" className="text-accent hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
