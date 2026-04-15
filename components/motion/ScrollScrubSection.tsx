"use client";

import { useLayoutEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { ensureGsap } from "@/lib/gsap-client";

type Props = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Scroll-scrubbed depth: content shifts and clarifies as it crosses the viewport.
 */
export function ScrollScrubSection({ children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    const gsap = ensureGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 36, opacity: 0.88, scale: 0.992 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "top 48%",
            scrub: 0.62,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduceMotion]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
