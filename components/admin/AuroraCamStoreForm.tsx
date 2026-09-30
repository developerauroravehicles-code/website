import { updateAuroraCamStoreUrlsAction } from "@/app/actions/aurora-cam";

type Props = {
  playStoreUrl: string;
  appStoreUrl: string;
  saved?: boolean;
  error?: string;
};

const inputClass =
  "h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function AuroraCamStoreForm({ playStoreUrl, appStoreUrl, saved, error }: Props) {
  return (
    <form action={updateAuroraCamStoreUrlsAction} className="mx-auto max-w-3xl space-y-8">
      {saved ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Store links saved. The public AuroraCam page will show active download buttons when URLs are set.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-2">
        <label htmlFor="auroraCamPlayStoreUrl" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Google Play URL
        </label>
        <input
          id="auroraCamPlayStoreUrl"
          name="auroraCamPlayStoreUrl"
          type="url"
          inputMode="url"
          placeholder="https://play.google.com/store/apps/details?id=..."
          defaultValue={playStoreUrl}
          className={inputClass}
          autoComplete="off"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="auroraCamAppStoreUrl" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          App Store URL
        </label>
        <input
          id="auroraCamAppStoreUrl"
          name="auroraCamAppStoreUrl"
          type="url"
          inputMode="url"
          placeholder="https://apps.apple.com/app/id..."
          defaultValue={appStoreUrl}
          className={inputClass}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
      >
        Save store links
      </button>
    </form>
  );
}
