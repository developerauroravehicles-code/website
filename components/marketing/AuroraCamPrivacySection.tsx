import Link from "next/link";
import { AuroraDashcamPrivacyContent } from "@/components/marketing/AuroraDashcamPrivacyContent";
import { AURORACAM_PRIVACY_PAGE_PATH } from "@/lib/aurora-cam";

export function AuroraCamPrivacySection() {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight sm:text-2xl">
            Privacy Policy
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted">
            How Aurora Vehicles Inc. handles information in the Aurora Dashcam mobile application.
          </p>
        </div>
        <Link
          href={AURORACAM_PRIVACY_PAGE_PATH}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent/15"
        >
          View
        </Link>
      </div>
      <div className="mt-8 max-h-[min(70vh,720px)] overflow-y-auto rounded-xl border border-border/80 bg-black/30 p-5 sm:p-6">
        <AuroraDashcamPrivacyContent />
      </div>
    </div>
  );
}
