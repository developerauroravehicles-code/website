"use client";

import { useEffect, useMemo, useRef } from "react";

export type ServicePoint = {
  city: string;
  region: string;
  lat: number;
  lng: number;
};

/** Match prior OSM embed bbox for default framing */
const MAP_BOUNDS = {
  minLng: -123.55,
  maxLng: -121.75,
  minLat: 49.02,
  maxLat: 49.38,
};

type Props = {
  points: ServicePoint[];
  className?: string;
};

function markerDivIconHtml(): string {
  return `<div class="service-points-premium__marker flex h-7 w-7 items-center justify-center rounded-full bg-black/35"><svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="#ff4500" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" /><circle cx="12" cy="9" r="3" fill="#0D0D0D" /></svg></div>`;
}

export function ServicePointsLeafletMap({ points, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsKey = useMemo(
    () =>
      points
        .map((p) => `${p.city}\0${p.region}\0${p.lat}\0${p.lng}`)
        .sort()
        .join("|"),
    [points],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let cancelled = false;
    let map: import("leaflet").Map | null = null;

    void (async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      if (cancelled || containerRef.current !== el) return;

      const instance = L.map(el, {
        zoomControl: true,
        scrollWheelZoom: true,
      });

      if (cancelled) {
        instance.remove();
        return;
      }
      map = instance;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(instance);

      const sw = L.latLng(MAP_BOUNDS.minLat, MAP_BOUNDS.minLng);
      const ne = L.latLng(MAP_BOUNDS.maxLat, MAP_BOUNDS.maxLng);
      instance.fitBounds(L.latLngBounds(sw, ne), { padding: [18, 18] });

      if (cancelled) {
        instance.remove();
        return;
      }

      const icon = L.divIcon({
        className: "service-points-leaflet-divicon",
        html: markerDivIconHtml(),
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      for (const p of points) {
        L.marker([p.lat, p.lng], { icon })
          .addTo(instance)
          .bindPopup(`<strong>${p.city}</strong><br />${p.region}`);
      }
    })();

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        map = null;
      }
    };
  }, [pointsKey]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label="Interactive service coverage map"
      role="application"
    />
  );
}
