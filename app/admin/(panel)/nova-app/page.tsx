import Link from "next/link";
import { NovaAppQrPreview } from "@/components/admin/NovaAppQrPreview";
import { NovaAppStoreForm } from "@/components/admin/NovaAppStoreForm";
import { getNovaAppPublicUrl, getNovaAppStoreUrls } from "@/lib/nova-app";

type Props = { searchParams: Promise<{ saved?: string; error?: string }> };

export default async function AdminNovaAppPage({ searchParams }: Props) {
  const sp = await searchParams;
  const urls = await getNovaAppStoreUrls();
  const targetUrl = getNovaAppPublicUrl();

  const errorMessage =
    sp.error === "play"
      ? "Google Play URL must be a valid https:// link."
      : sp.error === "appstore"
        ? "App Store URL must be a valid https:// link."
        : sp.error === "db"
          ? "Could not save. Run `npx prisma db push` and restart the dev server."
          : undefined;

  return (
    <div className="space-y-16">
      <div>
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
          ← Overview
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">
          Nova app (QR)
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Hidden URL for QR codes. Android phones go straight to Google Play; iPhones to the App Store. Other devices
          see a minimal page with both store buttons.
        </p>
      </div>

      <NovaAppQrPreview targetUrl={targetUrl} />

      <NovaAppStoreForm
        playStoreUrl={urls.play}
        appStoreUrl={urls.appStore}
        saved={sp.saved === "1"}
        error={errorMessage}
      />
    </div>
  );
}
