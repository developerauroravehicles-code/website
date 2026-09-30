import { AURORACAM_PRIVACY_PDF_PATH } from "@/lib/aurora-cam";

export function AuroraCamPrivacySection() {
  const pdfUrl = AURORACAM_PRIVACY_PDF_PATH;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-6 sm:p-8">
      <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight sm:text-2xl">
        Privacy Policy
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted">
        How Aurora Vehicles Inc. handles information in the Aurora Dashcam mobile application. Effective date and updates
        are listed in the document below.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-accent/40 bg-accent/10 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:border-accent hover:bg-accent/15"
        >
          View
        </a>
        <a
          href={pdfUrl}
          download
          className="inline-flex items-center justify-center rounded-xl border border-border/80 px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-border hover:text-foreground"
        >
          Download PDF
        </a>
      </div>
      <p className="mt-4 text-xs text-muted">
        View opens the privacy policy in a new browser tab.
      </p>
    </div>
  );
}
