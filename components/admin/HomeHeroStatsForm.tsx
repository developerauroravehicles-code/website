import { DEFAULT_HOME_HERO_SPECS } from "@/lib/site-settings";
import { updateHomeHeroStatsAction } from "@/app/actions/site-settings";

type Row = {
  homeStat1Label: string;
  homeStat1Sub: string;
  homeStat2Label: string;
  homeStat2Sub: string;
  homeStat3Label: string;
  homeStat3Sub: string;
};

type Props = {
  values: Row | null;
  saved?: boolean;
  error?: string;
};

const inputClass =
  "h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

export function HomeHeroStatsForm({ values, saved, error }: Props) {
  const v = values ?? {
    homeStat1Label: DEFAULT_HOME_HERO_SPECS[0].label,
    homeStat1Sub: DEFAULT_HOME_HERO_SPECS[0].sub,
    homeStat2Label: DEFAULT_HOME_HERO_SPECS[1].label,
    homeStat2Sub: DEFAULT_HOME_HERO_SPECS[1].sub,
    homeStat3Label: DEFAULT_HOME_HERO_SPECS[2].label,
    homeStat3Sub: DEFAULT_HOME_HERO_SPECS[2].sub,
  };

  return (
    <form action={updateHomeHeroStatsAction} className="mx-auto max-w-3xl space-y-10">
      {saved ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Saved. Home page stat tiles are updated.
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}

      {(
        [
          { n: 1, labelName: "homeStat1Label" as const, subName: "homeStat1Sub" as const, labelVal: v.homeStat1Label, subVal: v.homeStat1Sub },
          { n: 2, labelName: "homeStat2Label" as const, subName: "homeStat2Sub" as const, labelVal: v.homeStat2Label, subVal: v.homeStat2Sub },
          { n: 3, labelName: "homeStat3Label" as const, subName: "homeStat3Sub" as const, labelVal: v.homeStat3Label, subVal: v.homeStat3Sub },
        ] as const
      ).map((box) => (
        <fieldset key={box.n} className="space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
          <legend className="text-sm font-semibold text-zinc-200">Stat box {box.n}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor={box.labelName} className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Heading
              </label>
              <input
                id={box.labelName}
                name={box.labelName}
                required
                defaultValue={box.labelVal}
                className={inputClass}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor={box.subName} className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Subtext
              </label>
              <input
                id={box.subName}
                name={box.subName}
                required
                defaultValue={box.subVal}
                className={inputClass}
                autoComplete="off"
              />
            </div>
          </div>
        </fieldset>
      ))}

      <button
        type="submit"
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
      >
        Save
      </button>
    </form>
  );
}
