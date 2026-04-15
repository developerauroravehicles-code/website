"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { spring } from "@/lib/motion-presets";

/**
 * Route continuity: `mode="sync"` allows outgoing + incoming to overlap briefly
 * so shared `layoutId` elements can morph instead of waiting for full unmount.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="sync" initial={false}>
      <motion.div
        key={pathname}
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                y: 28,
                scale: 0.985,
              }
        }
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={
          reduceMotion
            ? { opacity: 0 }
            : {
                opacity: 0,
                y: -18,
                scale: 0.99,
              }
        }
        transition={reduceMotion ? { duration: 0.12 } : spring.premium}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
