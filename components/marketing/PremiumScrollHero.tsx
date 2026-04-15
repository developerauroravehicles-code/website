"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { HERO_EASE, HERO_SPRING } from "@/hooks/useHeroAnimation";
import { spring } from "@/lib/motion-presets";

export type PremiumScrollHeroSpec = { label: string; sub: string };

export type PremiumScrollHeroProps = {
  /** Small caps line above title; omit to hide. */
  eyebrow?: string;
  title: string;
  subtitle: string;
  featured?: boolean;
  frontImageSrc: string;
  frontAlt: string;
  specs: PremiumScrollHeroSpec[];
  primaryCta: { href: string; label: string };
  secondaryCta?: { href: string; label: string };
  footer?: React.ReactNode;
};

function LensShimmer({ disabled }: { disabled: boolean }) {
  if (disabled) return null;
  return (
    <motion.div
      className="pointer-events-none absolute left-[48%] top-[42%] z-20 h-[38%] w-[32%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full opacity-70 mix-blend-soft-light"
      aria-hidden
    >
      <motion.div
        className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
        animate={{ x: ["-120%", "220%"] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: HERO_EASE,
          repeatDelay: 0.2,
        }}
      />
    </motion.div>
  );
}

function HeroMagneticCta({
  href,
  children,
  className,
  reduceMotion,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, HERO_SPRING);
  const sy = useSpring(y, HERO_SPRING);

  const onMove = (e: React.MouseEvent) => {
    if (reduceMotion) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const rawX = (e.clientX - cx) * 0.2;
    const rawY = (e.clientY - cy) * 0.2;
    x.set(Math.max(-30, Math.min(30, rawX)));
    y.set(Math.max(-30, Math.min(30, rawY)));
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className="inline-flex"
      style={reduceMotion ? undefined : { x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <Link
        href={href}
        className={
          className ??
          "inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-background shadow-lg transition-colors hover:bg-accent-dim"
        }
      >
        {children}
      </Link>
    </motion.div>
  );
}

export function PremiumScrollHero({
  eyebrow,
  title,
  subtitle,
  featured,
  frontImageSrc,
  frontAlt,
  specs,
  primaryCta,
  secondaryCta,
  footer,
}: PremiumScrollHeroProps) {
  const reduceMotion = useReducedMotion();
  const showEyebrow = Boolean(eyebrow?.trim());
  const headlineTopSpacing = showEyebrow || featured ? "mt-4" : "";

  return (
    <div className="w-full bg-black">
      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="pointer-events-none absolute inset-0 bg-[#000000]" aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_18%,rgba(30,22,12,0.5),transparent_58%),radial-gradient(ellipse_60%_50%_at_80%_80%,rgba(255,69,0,0.07),transparent_50%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_20%_30%,rgba(255,200,140,0.08),transparent_55%)] opacity-90"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.04%22/%3E%3C/svg%3E')] opacity-30 mix-blend-overlay"
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-10 pt-12 text-center sm:px-6 sm:pb-12 sm:pt-16 lg:px-8 lg:pt-20">
          {showEyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{(eyebrow ?? "").trim()}</p>
          ) : null}
          {featured ? (
            <span
              className={`inline-flex rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold ${showEyebrow ? "mt-3" : ""}`}
            >
              Featured
            </span>
          ) : null}
          <h1
            className={`font-[family-name:var(--font-syne)] text-[clamp(2.25rem,6vw,4.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-foreground ${headlineTopSpacing}`}
          >
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>

          <div className="mx-auto mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
            <HeroMagneticCta href={primaryCta.href} reduceMotion={!!reduceMotion}>
              {primaryCta.label}
            </HeroMagneticCta>
            {secondaryCta ? (
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", ...HERO_SPRING }}
              >
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border border-border/90 bg-card/40 px-7 py-3.5 text-sm font-semibold text-foreground shadow-md backdrop-blur-sm transition hover:border-accent/40"
                >
                  {secondaryCta.label}
                </Link>
              </motion.div>
            ) : null}
          </div>

          <div className="relative mx-auto mt-10 w-full max-w-[min(94vw,560px)] sm:mt-12 sm:max-w-[min(92vw,760px)]">
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-950/35 ring-1 ring-white/[0.1] backdrop-blur-[0.5px]">
              <Image
                src={frontImageSrc}
                alt={frontAlt}
                width={1200}
                height={800}
                className="h-full w-full max-h-[min(48vh,520px)] object-contain object-center"
                unoptimized
                priority
              />
              <LensShimmer disabled={!!reduceMotion} />
            </div>
          </div>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-2 sm:mt-10 sm:gap-3">
            {specs.map((s) => (
              <div
                key={s.label}
                className="min-w-0 shrink-0 rounded-2xl border border-white/10 bg-black/55 px-3 py-2.5 text-center shadow-lg backdrop-blur-md sm:px-5 sm:py-3"
              >
                <p className="font-[family-name:var(--font-syne)] text-lg font-bold tracking-tight text-foreground sm:text-xl">
                  {s.label}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted sm:text-xs">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {footer ? (
        <div className="relative z-30 border-t border-white/[0.06] bg-gradient-to-b from-black via-zinc-950/35 to-background">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent opacity-90"
            aria-hidden
          />
          <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-8">
            <AnimatePresence>
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.99 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-48px", amount: 0.2 }}
                transition={spring.premium}
              >
                {footer}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : null}
    </div>
  );
}
