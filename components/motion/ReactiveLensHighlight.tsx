"use client";

import { useEffect, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";

type Props = {
  /** Element whose bounds define pointer coordinates (usually the hero section). */
  trackRef: React.RefObject<HTMLElement | null>;
  className?: string;
  top?: string;
  left?: string;
  size?: number;
  /** If true, show on narrow viewports too (e.g. product gallery). */
  showOnSmallScreens?: boolean;
  /** Max parallax offset in px (smaller = stays closer to lens anchor). */
  maxOffsetPx?: number;
  /** Max tilt in degrees. */
  maxTiltDeg?: number;
};

/**
 * Soft “lens glint” that intensifies on hover, follows the pointer slightly,
 * and tilts for a light3D read. Attach pointer tracking to `trackRef`.
 */
export function ReactiveLensHighlight({
  trackRef,
  className = "",
  top = "40%",
  left = "60%",
  size = 80,
  showOnSmallScreens = false,
  maxOffsetPx = 26,
  maxTiltDeg = 8,
}: Props) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const follow = { stiffness: 320, damping: 32, mass: 0.55 };
  const tilt = { stiffness: 220, damping: 28, mass: 0.5 };

  const sx = useSpring(x, follow);
  const sy = useSpring(y, follow);
  const srx = useSpring(rotateX, tilt);
  const sry = useSpring(rotateY, tilt);

  useEffect(() => {
    if (reduceMotion) return;
    const el = trackRef.current;
    if (!el) return;

    const reset = () => {
      setHovered(false);
      x.set(0);
      y.set(0);
      rotateX.set(0);
      rotateY.set(0);
    };

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) return;
      const px = ((e.clientX - r.left) / r.width) * 2 - 1;
      const py = ((e.clientY - r.top) / r.height) * 2 - 1;
      setHovered(true);
      x.set(px * maxOffsetPx);
      y.set(py * maxOffsetPx);
      rotateX.set(-py * maxTiltDeg);
      rotateY.set(px * maxTiltDeg);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [trackRef, reduceMotion, x, y, rotateX, rotateY, maxOffsetPx, maxTiltDeg]);

  const centerWhite = hovered ? 0.72 : 0.42;
  const midWhite = hovered ? 0.22 : 0.12;
  const blurPx = hovered ? 7 : 6;

  if (reduceMotion) {
    return (
      <div
        className={`pointer-events-none absolute z-[6] ${className}`}
        style={{ top, left, transform: "translate(-50%, -50%)" }}
        aria-hidden
      >
        <div
          className="rounded-full"
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle, rgba(255,255,255,0.38) 0%, rgba(255,255,255,0.06) 42%, transparent 70%)`,
            filter: "blur(6px)",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`pointer-events-none absolute z-[6] ${showOnSmallScreens ? "" : "hidden md:block"} ${className}`}
      style={{
        top,
        left,
        transform: "translate(-50%, -50%)",
        perspective: 1100,
      }}
      aria-hidden
    >
      <motion.div
        className="rounded-full will-change-transform"
        style={{
          width: size,
          height: size,
          x: sx,
          y: sy,
          rotateX: srx,
          rotateY: sry,
          transformStyle: "preserve-3d",
          background: `radial-gradient(circle, rgba(255,255,255,${centerWhite}) 0%, rgba(255,255,255,${midWhite}) 38%, transparent 72%)`,
          filter: `blur(${blurPx}px)`,
          boxShadow: hovered
            ? "0 0 42px -8px rgba(255,255,255,0.35), 0 0 24px -4px rgba(255,69,0,0.25)"
            : "0 0 28px -10px rgba(255,255,255,0.15)",
        }}
        animate={{
          scale: hovered ? 1.14 : 1,
        }}
        transition={{
          scale: { type: "spring", stiffness: 400, damping: 28 },
        }}
      />
    </div>
  );
}
