"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useCallback, useRef } from "react";

type Props = {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
};

export function TiltCard({ children, className, maxTilt = 9 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const springX = useSpring(rx, { stiffness: 320, damping: 32, mass: 0.75 });
  const springY = useSpring(ry, { stiffness: 320, damping: 32, mass: 0.75 });

  const onMove = useCallback(
    (e: React.MouseEvent) => {
      if (reduceMotion) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      ry.set((px - 0.5) * maxTilt * 2);
      rx.set((0.5 - py) * maxTilt * 2);
    },
    [maxTilt, reduceMotion, rx, ry],
  );

  const onLeave = useCallback(() => {
    rx.set(0);
    ry.set(0);
  }, [rx, ry]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        transformPerspective: 1200,
        rotateX: reduceMotion ? 0 : springX,
        rotateY: reduceMotion ? 0 : springY,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </motion.div>
  );
}
