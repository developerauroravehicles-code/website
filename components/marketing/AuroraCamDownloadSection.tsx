type Props = {
  playUrl: string;
  appStoreUrl: string;
};

function StoreButton({
  href,
  label,
  sublabel,
}: {
  href: string | null;
  label: string;
  sublabel: string;
}) {
  const base =
    "inline-flex min-w-[10rem] flex-1 flex-col items-center justify-center rounded-2xl border px-6 py-4 text-center transition sm:min-w-[12rem]";
  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${base} border-accent/40 bg-accent/10 text-foreground hover:border-accent hover:bg-accent/15`}
      >
        <span className="text-sm font-semibold">{label}</span>
        <span className="mt-1 text-xs text-muted">{sublabel}</span>
      </a>
    );
  }
  return (
    <span
      className={`${base} cursor-not-allowed border-border/80 bg-zinc-950/50 text-muted opacity-80`}
      aria-disabled
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-1 text-xs">Coming soon</span>
    </span>
  );
}

export function AuroraCamDownloadSection({ playUrl, appStoreUrl }: Props) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/40 p-6 sm:p-8">
      <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight sm:text-2xl">
        Get the app
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        AuroraCam is available for Android and iOS. Download links appear here once the app is live on each store.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-start">
        <StoreButton href={playUrl || null} label="Google Play" sublabel="Android" />
        <StoreButton href={appStoreUrl || null} label="App Store" sublabel="iPhone & iPad" />
      </div>
    </div>
  );
}
