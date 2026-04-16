"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Passed to IntersectionObserver (e.g. pre-trigger before element hits viewport). */
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
};

/**
 * Reliable “in view” signal for Framer Motion + Next.js client navigations.
 * `whileInView` alone can miss the first intersection when the subtree is already visible on mount.
 */
export function useElementInView<T extends HTMLElement = HTMLDivElement>(options?: Options) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  const { rootMargin = "0px 0px 12% 0px", threshold = 0, once = true } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) io.disconnect();
            break;
          }
        }
      },
      { root: null, rootMargin, threshold },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [inView, rootMargin, once, threshold]);

  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;

    const geometryKick = () => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const overlapsViewport = r.bottom > 8 && r.top < vh - 8 && r.right > 8 && r.left < vw - 8;
      if (overlapsViewport) setInView(true);
    };

    geometryKick();
    const raf = requestAnimationFrame(() => requestAnimationFrame(geometryKick));
    const t1 = window.setTimeout(geometryKick, 0);
    const t2 = window.setTimeout(geometryKick, 120);
    const t3 = window.setTimeout(geometryKick, 400);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [inView]);

  return { ref, inView };
}
