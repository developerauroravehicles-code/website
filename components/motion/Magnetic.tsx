"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";

type Props = {
  children: React.ReactNode;
  /** 0–1 — pull toward cursor strength */
  strength?: number;
  className?: string;
  as?: "div" | "span";
};

export function Magnetic({ children, strength = 0.32, className, as = "div" }: Props) {
  const ref = useRef<HTMLDivElement | HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 28, mass: 0.82 });
  const sy = useSpring(y, { stiffness: 280, damping: 28, mass: 0.82 });
  const Component = as === "span" ? motion.span : motion.div;

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduceMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      x.set((e.clientX - cx) * strength);
      y.set((e.clientY - cy) * strength);
    },
    [reduceMotion, strength, x, y],
  );

  const onLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <Component
      ref={ref}
      className={className}
      style={reduceMotion ? undefined : { x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </Component>
  );
}
