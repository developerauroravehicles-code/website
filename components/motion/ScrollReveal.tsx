"use client";

import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { spring } from "@/lib/motion-presets";
import { useElementInView } from "@/lib/use-element-in-view";

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
  const { ref, inView } = useElementInView<HTMLDivElement>({
    rootMargin: "0px 0px 14% 0px",
    threshold: 0,
    once: true,
  });

  const hidden = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, y, scale: 0.98, rotateX: 2, transformPerspective: 900 };
  const visible = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, y: 0, scale: 1, rotateX: 0, transformPerspective: 900 };

  return (
    <motion.div
      ref={ref}
      initial={hidden}
      animate={inView ? visible : hidden}
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
  const { ref, inView } = useElementInView<HTMLDivElement>({
    rootMargin: "0px 0px 12% 0px",
    threshold: 0,
    once: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.99 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: reduceMotion ? 1 : 0.99 }}
      transition={{ ...spring.soft, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
