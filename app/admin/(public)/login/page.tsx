import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center px-4">
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
          <p className="mx-auto mt-3 max-w-sm text-[11px] leading-relaxed text-zinc-500">
            Use the same <span className="text-zinc-400">ADMIN_EMAIL</span> and{" "}
            <span className="text-zinc-400">ADMIN_PASSWORD</span> as in your environment. Create the account with{" "}
            <code className="whitespace-nowrap rounded bg-zinc-800/80 px-1 py-0.5 text-[10px] text-zinc-300">
              npm run db:seed:admin
            </code>{" "}
            (or full <code className="whitespace-nowrap rounded bg-zinc-800/80 px-1 py-0.5 text-[10px] text-zinc-300">db:seed</code>
            ) against your database.
          </p>
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
