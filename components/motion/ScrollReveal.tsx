"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion-presets";

type Props = HTMLMotionProps<"div"> & {
  children: React.ReactNode;
  delay?: number;
  y?: number;
};

/** Scroll-linked entrance with spring + depth (scale), not a flat fade-only. */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 32,
  ...rest
}: Props) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y, scale: 0.98, rotateX: 2, transformPerspective: 900 }
      }
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, y: 0, scale: 1, rotateX: 0, transformPerspective: 900 }
      }
      viewport={{ once: true, margin: "-48px", amount: 0.2 }}
      transition={{ ...spring.premium, delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function ScrollFade({ children, className, delay = 0 }: Omit<Props, "y">) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.99 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px", amount: 0.15 }}
      transition={{ ...spring.soft, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
