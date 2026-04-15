import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { ScrollScrubSection } from "@/components/motion/ScrollScrubSection";
import { MagneticSpringLink } from "@/components/motion/MagneticSpringLink";
import { ServiceStaggerGrid } from "@/components/marketing/ServiceStaggerGrid";

export const metadata: Metadata = {
  title: "Services",
  description: "Dashcam installation, accessories, and professional vehicle integration.",
};

const services = [
  {
    title: "Dashcam installation",
    body: "Front, cabin, and multi-channel setups with concealed wiring, fuse taps, and tidy cable channels.",
  },
  {
    title: "Parking mode & power",
    body: "Battery-safe modules and secure electrical integration for recording while parked—planned per vehicle.",
  },
  {
    title: "Accessories & upkeep",
    body: "Memory cards, mounts, harnesses, and periodic checks. We focus on install and guidance rather than web sales.",
  },
  {
    title: "Consulting",
    body: "Camera selection, image quality, and awareness for fleets and private owners—clear, practical advice.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <ScrollScrubSection className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Expert team</p>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl">
          Services
        </h1>
        <div className="mx-auto mt-4 max-w-3xl space-y-4 text-muted">
          <p>
            During the installation process, we are committed to maintaining the integrity of your vehicle&apos;s original
            wiring harness. The &quot;Add-a-Circuit&quot; (fuse splitter) device integrated into the existing fuse holder
            creates a completely independent, safe, and professional power line for the dashcam system. This approach
            maintains the integrity of the vehicle&apos;s electrical system while safeguarding the manufacturer&apos;s
            warranty.
          </p>
          <p>
            The dashcam solutions we use intelligently detect the vehicle&apos;s ignition status and automatically switch
            between driving and parking modes. The vehicle&apos;s battery voltage is subject to continuous monitoring while
            the vehicle is parked. This ensures uninterrupted and secure recording while protecting the battery.
            Consequently, optimal safety and performance are ensured at all times, both during operation and when
            stationary.
          </p>
        </div>
      </ScrollScrubSection>
      <ServiceStaggerGrid items={services} />
      <ScrollReveal className="mt-14" delay={0.08}>
        <div className="relative rounded-3xl bg-gradient-to-br from-accent/45 via-gold/25 to-white/[0.08] p-px shadow-[0_28px_80px_-36px_rgba(255,69,0,0.45),0_0_0_1px_rgba(255,255,255,0.04)_inset]">
          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[radial-gradient(90%_120%_at_50%_-30%,rgba(255,69,0,0.12),transparent_52%),linear-gradient(165deg,#0d0d12_0%,#060608_45%,#030304_100%)] px-8 py-12 text-center sm:px-14 sm:py-16">
            <div
              className="pointer-events-none absolute -left-24 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-accent/[0.12] blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -right-16 -top-28 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
              aria-hidden
            />
            <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gold">Get in touch</p>
            <h2 className="relative mt-4 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Ready to get started?
            </h2>
            <p className="relative mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
              Contact us for installation and product guidance.
            </p>
            <div className="relative mt-10 flex justify-center">
              <MagneticSpringLink href="/contact" variant="primary">
                Contact
              </MagneticSpringLink>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
