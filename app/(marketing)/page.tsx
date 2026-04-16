import type { ReactNode } from "react";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { PremiumDashcamHero } from "@/components/marketing/PremiumDashcamHero";
import { MotionAccentLink } from "@/components/marketing/MotionAccentLink";
import { EliteHomeCollection } from "@/components/marketing/EliteHomeCollection";
import { EliteHomeServices } from "@/components/marketing/EliteHomeServices";
import { getSignatureSectionProducts } from "@/lib/site-settings";

export const revalidate = 120;

function SectionEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gold">{children}</p>
  );
}

export default async function HomePage() {
  const featured = await getSignatureSectionProducts();

  return (
    <main className="overflow-x-hidden">
      <PremiumDashcamHero />

      <section className="marketing-section border-t border-white/[0.06] bg-background">
        <div className="marketing-section__ambient" aria-hidden />
        <div className="marketing-section__content">
          <div className="marketing-divider opacity-80" aria-hidden />
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <ScrollReveal>
                <SectionEyebrow>Signature</SectionEyebrow>
                <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.5rem] lg:leading-[1.12]">
                  Systems chosen for clarity, restraint, and long-term trust.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  A curated line—GPS, night vision, parking mode—presented without noise.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.06} className="sm:self-end">
                <MotionAccentLink
                  href="/products"
                  className="text-[11px] font-semibold uppercase tracking-[0.24em] text-accent underline-offset-4 hover:underline"
                >
                  View collection
                </MotionAccentLink>
              </ScrollReveal>
            </div>
            <div className="mt-12 lg:mt-16">
              <EliteHomeCollection
                products={featured}
                emptyMessage="No published products yet. Add and publish products from the admin panel."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="marketing-section border-t border-white/[0.06] bg-card/30">
        <div className="marketing-section__ambient marketing-section__ambient--soft" aria-hidden />
        <div className="marketing-section__content">
          <div className="marketing-divider opacity-70" aria-hidden />
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
              <ScrollReveal className="lg:col-span-5">
                <SectionEyebrow>Capability</SectionEyebrow>
                <h2 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.25rem] lg:leading-[1.15]">
                  Installation and support, distilled.
                </h2>
                <p className="mt-5 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">
                  Concealed cabling, parking-mode power, and accessories aligned to your vehicle—executed with the same
                  care as the hardware we recommend.
                </p>
              </ScrollReveal>
              <div className="lg:col-span-7 lg:pl-4">
                <EliteHomeServices />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
