import Link from "next/link";
import { AuroraCamStoreForm } from "@/components/admin/AuroraCamStoreForm";
import { getAuroraCamStoreUrls } from "@/lib/aurora-cam";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function AdminAuroraCamPage({ searchParams }: Props) {
  const sp = await searchParams;
  const urls = await getAuroraCamStoreUrls();

  const errorMessage =
    sp.error === "play"
      ? "Google Play URL must be a valid https:// link."
      : sp.error === "appstore"
        ? "App Store URL must be a valid https:// link."
        : sp.error === "db"
          ? "Could not save. Run `npx prisma db push` and restart the dev server."
          : undefined;

  return (
    <div className="space-y-10">
      <div>
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
          ← Overview
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">
          AuroraCam
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Store links for the public{" "}
          <a href="/auroracam" className="text-zinc-300 underline-offset-2 hover:underline">
            /auroracam
          </a>{" "}
          page. Leave empty until the app is listed; buttons show “Coming soon” until then.
        </p>
      </div>

      <AuroraCamStoreForm
        playStoreUrl={urls.play}
        appStoreUrl={urls.appStore}
        saved={sp.saved === "1"}
        error={errorMessage}
      />
    </div>
  );
}
