"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { spring } from "@/lib/motion-presets";

const pillars = [
  {
    title: "Installation",
    line: "Discrete routing, factory-grade finishes, systems tuned to how you drive.",
  },
  {
    title: "Power & parking",
    line: "Battery health, parking mode, and clean power—without compromise.",
  },
  {
    title: "Accessories",
    line: "Storage, connectivity, and hardware matched to your vehicle and cameras.",
  },
];

const MotionLink = motion.create(Link);

export function EliteHomeServices() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none absolute -left-[min(8vw,4rem)] top-1/2 hidden h-[min(70%,28rem)] w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-accent/35 to-transparent lg:block"
        aria-hidden
      />
      <motion.ul
        className="space-y-0"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-48px", amount: 0.25 }}
        variants={{
          visible: { transition: { staggerChildren: 0.09 } },
          hidden: {},
        }}
      >
        {pillars.map((item, i) => (
          <motion.li
            key={item.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: spring.premium },
            }}
            className="border-t border-white/[0.08] py-8 first:border-t-0 first:pt-0 last:pb-0 sm:py-10"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:gap-10 lg:gap-16">
              <span className="shrink-0 font-[family-name:var(--font-syne)] text-[13px] tabular-nums text-gold/90 sm:w-8">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-[0.9375rem]">{item.line}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </motion.ul>
      <MotionLink
        href="/services"
        className="mt-10 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-accent"
        whileHover={{ x: 6 }}
        whileTap={{ scale: 0.98 }}
        transition={spring.snappy}
      >
        Full capability
        <span aria-hidden>→</span>
      </MotionLink>
    </div>
  );
}
