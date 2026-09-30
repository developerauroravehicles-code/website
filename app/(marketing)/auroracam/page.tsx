import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { AuroraCamDownloadSection } from "@/components/marketing/AuroraCamDownloadSection";
import { AuroraCamPrivacySection } from "@/components/marketing/AuroraCamPrivacySection";
import { getAuroraCamStoreUrls } from "@/lib/aurora-cam";

export const metadata: Metadata = {
  title: "AuroraCam",
  description:
    "Aurora Dashcam mobile app for iOS and Android — view footage, manage your dashcam, and stay connected on the road.",
};

export default async function AuroraCamPage() {
  const urls = await getAuroraCamStoreUrls();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <ScrollReveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">AuroraCam</p>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Your dashcam, in your pocket
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
          AuroraCam is the companion app for Aurora dashcam systems. Available on{" "}
          <strong className="font-medium text-foreground">Android</strong> and{" "}
          <strong className="font-medium text-foreground">iOS</strong> — connect to your device, review clips, and manage
          settings with the same attention to clarity we bring to every install.
        </p>
      </ScrollReveal>

      <ScrollReveal className="mt-12" delay={0.06}>
        <AuroraCamDownloadSection playUrl={urls.play} appStoreUrl={urls.appStore} />
      </ScrollReveal>

      <ScrollReveal className="mt-10" delay={0.1}>
        <AuroraCamPrivacySection />
      </ScrollReveal>
    </div>
  );
}
