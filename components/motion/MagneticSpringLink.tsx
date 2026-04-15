"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { RipplePress } from "@/components/motion/RipplePress";
import { spring } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "relative z-10 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_8px_32px_-6px_rgba(255,69,0,0.45),0_0_0_1px_rgba(0,0,0,0.06)_inset] ring-1 ring-black/10 transition-[box-shadow,background-color] duration-200 hover:bg-accent-dim hover:shadow-[0_12px_40px_-4px_rgba(255,69,0,0.55)]",
  secondary:
    "relative z-10 inline-flex items-center justify-center rounded-full border border-border/90 bg-card/70 px-6 py-3 text-sm font-semibold text-foreground shadow-[0_6px_28px_-10px_rgba(0,0,0,0.55)] backdrop-blur-md ring-1 ring-white/[0.04]",
  ghost:
    "relative z-10 inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-foreground shadow-[0_8px_28px_-8px_rgba(255,69,0,0.35)] ring-1 ring-white/10",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  magneticStrength?: number;
};

export function MagneticSpringLink({
  href,
  children,
  variant = "primary",
  className = "",
  magneticStrength = 0.26,
}: Props) {
  return (
    <Magnetic strength={magneticStrength} className="inline-flex">
      <RipplePress className="inline-flex rounded-full">
        <MotionLink
          href={href}
          className={`${styles[variant]} ${className}`}
          whileTap={{ scale: 0.97 }}
          whileHover={
            variant === "secondary"
              ? {
                  borderColor: "rgba(255, 69, 0, 0.55)",
                  boxShadow: "0 12px 40px -12px rgba(255, 69, 0, 0.3)",
                }
              : { scale: 1.02, y: -1 }
          }
          transition={spring.snappy}
        >
          {children}
        </MotionLink>
      </RipplePress>
    </Magnetic>
  );
}
