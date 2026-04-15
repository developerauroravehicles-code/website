"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

/** Cinematic hero physics — weighted, mechanical feel */
export const HERO_SPRING = {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
} as const;

export const HERO_EASE = [0.22, 1, 0.36, 1] as const;

export type HeroAnimationValues = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  progress: MotionValue<number>;
  narrow: boolean;
  heroTitleOpacity: MotionValue<number>;
  heroTitleScale: MotionValue<number>;
  heroSubOpacity: MotionValue<number>;
  heroTitleY: MotionValue<number>;
  productScale: MotionValue<number>;
  rotateY: MotionValue<number>;
  specBlurPx: MotionValue<number>;
  specOpacity: MotionValue<number>;
  specTranslateY: MotionValue<number>;
  bgTextY: MotionValue<number>;
  productParallaxY: MotionValue<number>;
  overlayParallaxY: MotionValue<number>;
  deviceShadow: MotionValue<string>;
};

/**
 * Maps scrollYProgress of `containerRef` (full-height scroll track) to hero phases:
 * 0–20% intro zoom, 20–100% parallax + spec callouts (single product view only).
 */
export function useHeroAnimation(): HeroAnimationValues {
  const containerRef = useRef<HTMLDivElement>(null);
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setNarrow(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const progress = useSpring(scrollYProgress, HERO_SPRING);

  const heroTitleOpacity = useTransform(progress, [0, 0.14, 0.22], [1, 0.45, 0]);
  const heroTitleScale = useTransform(progress, [0, 0.2], [1, 1.08]);
  const heroSubOpacity = useTransform(progress, [0, 0.12, 0.2], [1, 0.25, 0]);
  const heroTitleY = useTransform(progress, [0, 0.2], [0, -24]);

  const productScale = useTransform(progress, [0, 0.2], [0.8, 1.2]);

  const rotateY = useTransform(progress, (p) => {
    if (narrow) return 0;
    if (p <= 0.2) return 0;
    if (p >= 0.5) return 12;
    return ((p - 0.2) / 0.3) * 12;
  });

  const specBlurPx = useTransform(progress, (p) => {
    if (p < 0.22) return 20;
    if (p > 0.46) return 0;
    return 20 - ((p - 0.22) / 0.24) * 20;
  });

  const specTranslateY = useTransform(progress, [0.2, 0.42], [32, 0]);

  const specOpacity = useTransform(progress, [0.24, 0.38], [0, 1]);

  const bgTextY = useTransform(progress, [0, 1], [0, -110]);
  /** Keep product / spec layers separated so pills never slide up into the lens. */
  const productParallaxY = useTransform(progress, [0, 1], [0, -340]);
  const overlayParallaxY = useTransform(progress, [0, 1], [0, -200]);

  const deviceShadow = useTransform(progress, (p) => {
    const lift = 44 + p * 18;
    const spread = -30 - p * 12;
    const warm = 0.12 + Math.sin(p * Math.PI) * 0.16 + p * 0.08;
    const glow = 36 + p * 48;
    return `0 ${lift}px ${lift * 2.1}px ${spread}px rgba(0,0,0,0.6), 0 0 ${glow}px -10px rgba(255,69,0,${Math.min(0.32, warm)})`;
  });

  return {
    containerRef,
    progress,
    narrow,
    heroTitleOpacity,
    heroTitleScale,
    heroSubOpacity,
    heroTitleY,
    productScale,
    rotateY,
    specBlurPx,
    specOpacity,
    specTranslateY,
    bgTextY,
    productParallaxY,
    overlayParallaxY,
    deviceShadow,
  };
}
