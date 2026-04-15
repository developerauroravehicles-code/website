import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MotionAccentLink } from "@/components/marketing/MotionAccentLink";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Aurora Vehicles — Vancouver dashcam specialists. Professional installation, quality equipment, and a mission to keep every journey recorded and protected.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <ScrollReveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">About us</p>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          About Us
        </h1>
        <p className="mt-6 max-w-2xl text-xl font-medium leading-snug text-foreground sm:text-2xl">
          Focus on the road, we&apos;ve got it all on tape!
        </p>
      </ScrollReveal>

      <div className="mt-12 max-w-3xl space-y-8 text-muted">
        <ScrollReveal>
          <p className="text-base leading-relaxed">
            Aurora Vehicles specializes in dashcam sales and installation services in{" "}
            <strong className="font-medium text-foreground">Vancouver</strong>. We provide the latest technology
            solutions to enhance your road safety. Our experienced team ensures professional and reliable installation
            for all vehicle types. With a focus on customer satisfaction, we deliver fast and affordable services.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.05}>
          <p className="text-base leading-relaxed">
            On this website, our product pages are for <strong className="font-medium text-foreground">showcase and inquiry</strong>{" "}
            — contact us for current models, install quotes, and what&apos;s in stock.
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <h2 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-foreground">
            Our Story
          </h2>
          <p className="mt-4 text-base leading-relaxed">
            The story of Aurora Vehicles was inspired by a real-life event. One day, our founder witnessed a close
            friend being wrongly blamed for a traffic accident. With no clear evidence at the scene, proving their
            innocence became impossible. That moment sparked an idea — the right technology could protect drivers and
            their rights.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Motivated by this experience, Aurora Vehicles was established in Vancouver with a mission to enhance vehicle
            safety. Our goal is to help drivers not only protect themselves but also safeguard their loved ones and
            their rights. With cutting-edge dashcam systems, we ensure that every driver is prepared and secure on the
            road.
          </p>
          <p className="mt-4 text-base leading-relaxed">
            Today, we are proud to serve hundreds of drivers with professional installation services and high-quality
            equipment. Because a safe journey starts with the right moments being recorded!
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="text-base leading-relaxed">
            For service areas and up-to-date contact details, visit our{" "}
            <MotionAccentLink href="/contact" className="font-medium text-accent underline-offset-4 hover:underline">
              contact
            </MotionAccentLink>{" "}
            page — or explore{" "}
            <MotionAccentLink href="/services" className="font-medium text-accent underline-offset-4 hover:underline">
              our services
            </MotionAccentLink>
            .
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-16" delay={0.06}>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-border/90 bg-card/50 p-5 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Experience</p>
            <p className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">5+ years</p>
            <p className="mt-1 text-sm text-muted">Technicians you can trust</p>
          </div>
          <div className="rounded-2xl border border-border/90 bg-card/50 p-5 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.45)]">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Trusted by</p>
            <p className="mt-2 font-[family-name:var(--font-syne)] text-2xl font-bold text-foreground">50+</p>
            <p className="mt-1 text-sm text-muted">Dealers and counting</p>
          </div>
          <div className="rounded-2xl border border-border/90 bg-card/50 p-5 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.45)] sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Focus</p>
            <p className="mt-2 text-lg font-semibold text-foreground">Best quality service</p>
            <p className="mt-1 text-sm text-muted">From consult to clean install</p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mt-12" delay={0.08}>
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight text-foreground">
          What we do
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-muted">
          <li className="rounded-xl border border-border/80 bg-background/40 px-4 py-3">Auto dash cams</li>
          <li className="rounded-xl border border-border/80 bg-background/40 px-4 py-3">Dash cam batteries & accessories</li>
          <li className="rounded-xl border border-border/80 bg-background/40 px-4 py-3 sm:col-span-2">
            Dash cam installation
          </li>
        </ul>
      </ScrollReveal>
    </div>
  );
}
