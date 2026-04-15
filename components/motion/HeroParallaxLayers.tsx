"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ensureGsap } from "@/lib/gsap-client";

type Props = {
  sectionRef: React.RefObject<HTMLElement | null>;
};

/**
 * Multi-layer parallax: background (slow), mid (medium), foreground (fast).
 * ScrollTrigger scrub — scroll-linked, not a one-shot reveal.
 */
export function HeroParallaxLayers({ sectionRef }: Props) {
  const reduceMotion = useReducedMotion();
  const bgRef = useRef<HTMLDivElement>(null);
  const midRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const section = sectionRef.current;
    const bg = bgRef.current;
    const mid = midRef.current;
    const fg = fgRef.current;
    if (!section || !bg || !mid || !fg) return;

    const gsap = ensureGsap();

    const ctx = gsap.context(() => {
      const stBase = {
        trigger: section,
        start: "top top",
        end: "bottom top",
        invalidateOnRefresh: true,
      };

      gsap.fromTo(
        bg,
        { yPercent: 0 },
        {
          yPercent: -10,
          ease: "none",
          scrollTrigger: { ...stBase, scrub: 0.7 },
        },
      );
      gsap.fromTo(
        mid,
        { yPercent: 0, scale: 1 },
        {
          yPercent: -22,
          scale: 1.04,
          ease: "none",
          scrollTrigger: { ...stBase, scrub: 0.52 },
        },
      );
      gsap.fromTo(
        fg,
        { yPercent: 0, opacity: 0.55 },
        {
          yPercent: -38,
          opacity: 0.88,
          ease: "none",
          scrollTrigger: { ...stBase, scrub: 0.32 },
        },
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, reduceMotion]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <div
        ref={bgRef}
        className="absolute -inset-[20%] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,69,0,0.22),transparent_55%)] blur-3xl"
      />
      <div
        ref={midRef}
        className="absolute -inset-[15%] bg-[radial-gradient(ellipse_70%_50%_at_70%_100%,rgba(209,180,123,0.14),transparent_50%)] blur-2xl"
      />
      <div
        ref={fgRef}
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,transparent_40%,rgba(0,0,0,0.55)_100%),linear-gradient(180deg,transparent_0%,rgba(255,69,0,0.05)_50%,transparent_100%)]"
      />
    </div>
  );
}
