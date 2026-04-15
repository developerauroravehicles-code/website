import { ServicePointsLeafletMap } from "@/components/marketing/ServicePointsLeafletMap";

type ServicePoint = {
  city: string;
  region: string;
  lat: number;
  lng: number;
};

type Props = {
  points: ServicePoint[];
};

export function ServicePointsSection({ points }: Props) {
  return (
    <section className="service-points-premium relative overflow-hidden rounded-3xl ring-1 ring-white/[0.08]" aria-labelledby="service-points-heading">
      <div className="service-points-premium__map-shell relative aspect-[21/10] min-h-[220px] w-full sm:aspect-[21/9] sm:min-h-[280px] lg:min-h-[320px]">
        <ServicePointsLeafletMap
          points={points}
          className="service-points-premium__leaflet absolute inset-0 z-0 min-h-0 scale-[1.02] [&.leaflet-container]:h-full [&.leaflet-container]:min-h-full [&.leaflet-container]:w-full [&.leaflet-container]:bg-[#1a1a1a]"
        />
        <div className="pointer-events-none absolute bottom-3 left-3 z-[2000] rounded-md bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-zinc-400 backdrop-blur-sm">
          Coverage area
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] bg-transparent px-4 py-10 sm:px-6 sm:py-12 lg:px-10">
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#ff9b7a]">Coverage</p>
          <h2
            id="service-points-heading"
            className="mt-3 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-[2rem] lg:leading-tight"
          >
            Service points
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            We serve customers across Metro Vancouver and the Fraser Valley. Below are the areas we regularly cover for
            installs and support.
          </p>

          <ul
            className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {points.map((point) => (
              <li
                key={point.city}
                className="group relative bg-[#16181f] p-4 transition-[background-color,box-shadow] duration-300 ease-[var(--ease-premium)] hover:bg-[#1c1f2a] hover:shadow-[inset_0_0_0_1px_rgba(255,69,0,0.12)] sm:p-5"
              >
                <div className="flex gap-3.5">
                  <span
                    className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#2a1510] ring-1 ring-[#ff4500]/35"
                    aria-hidden
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-5 text-[#ea4335]"
                      fill="currentColor"
                      aria-hidden
                    >
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">Service point</p>
                    <p className="mt-1.5 text-sm leading-snug">
                      <span className="font-semibold text-zinc-100">{point.city}</span>
                      <span className="text-zinc-500">, {point.region}</span>
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
