import type { Metadata } from "next";
import { ServicePointsSection } from "@/components/marketing/ServicePointsSection";
import { ScrollFade, ScrollReveal } from "@/components/motion/ScrollReveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Aurora Vehicles for installation and product questions.",
};

/** Metro Vancouver & Fraser Valley service coverage — aligned with auroravehicles.com contact. */
const SERVICE_POINTS: { city: string; region: string; lat: number; lng: number }[] = [
  { city: "Vancouver", region: "British Columbia, Canada", lat: 49.2827, lng: -123.1207 },
  { city: "Chilliwack", region: "British Columbia, Canada", lat: 49.1579, lng: -121.9515 },
  { city: "Abbotsford", region: "British Columbia, Canada", lat: 49.0504, lng: -122.3045 },
  { city: "Mission", region: "British Columbia, Canada", lat: 49.1329, lng: -122.3262 },
  { city: "Langley", region: "British Columbia, Canada", lat: 49.1044, lng: -122.6604 },
  { city: "Surrey", region: "British Columbia, Canada", lat: 49.1913, lng: -122.849 },
  { city: "White Rock", region: "British Columbia, Canada", lat: 49.0253, lng: -122.8026 },
  { city: "Delta", region: "British Columbia, Canada", lat: 49.0847, lng: -123.0586 },
  { city: "Richmond", region: "British Columbia, Canada", lat: 49.1666, lng: -123.1336 },
  { city: "New Westminster", region: "British Columbia, Canada", lat: 49.2057, lng: -122.911 },
  { city: "Burnaby", region: "British Columbia, Canada", lat: 49.2488, lng: -122.9805 },
  { city: "Coquitlam", region: "British Columbia, Canada", lat: 49.2838, lng: -122.7932 },
  { city: "Port Coquitlam", region: "British Columbia, Canada", lat: 49.2625, lng: -122.7813 },
  { city: "Port Moody", region: "British Columbia, Canada", lat: 49.283, lng: -122.8526 },
  { city: "Maple Ridge", region: "British Columbia, Canada", lat: 49.2194, lng: -122.6019 },
  { city: "Pitt Meadows", region: "British Columbia, Canada", lat: 49.2212, lng: -122.6896 },
  { city: "West Vancouver", region: "British Columbia, Canada", lat: 49.328, lng: -123.1602 },
  { city: "North Vancouver", region: "British Columbia, Canada", lat: 49.3203, lng: -123.0724 },
];

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl text-center">
        <ScrollReveal>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Get in touch</p>
          <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl">
            Contact
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            For appointments and product guidance, reach us using the details below.
          </p>
        </ScrollReveal>
        <div className="mt-12">
          <ScrollFade delay={0.05}>
            <div className="space-y-6 rounded-2xl border border-border/90 bg-card/50 p-8 shadow-[0_12px_48px_-24px_rgba(0,0,0,0.45)]">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p>
                <a
                  href="mailto:support@auroravehicles.com"
                  className="mt-1 block font-semibold text-foreground underline decoration-foreground/80 underline-offset-2 hover:text-accent hover:decoration-accent"
                >
                  support@auroravehicles.com
                </a>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 sm:text-center">
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Address</p>
                  <p className="mt-1 text-sm font-semibold leading-relaxed text-foreground">
                    Metro Vancouver B.C
                    <br />
                    Canada
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</p>
                  <a
                    href="tel:+16048335801"
                    className="mt-1 block text-sm font-semibold text-foreground hover:text-accent hover:underline"
                  >
                    604-833-5801
                  </a>
                </div>
              </div>
            </div>
          </ScrollFade>
        </div>
      </div>

      <ScrollReveal className="mt-16 lg:mt-20" delay={0.06}>
        <ServicePointsSection points={SERVICE_POINTS} />
      </ScrollReveal>
    </div>
  );
}
