"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

type Stat = { label: string; value: string; detail?: string };

const stats: Stat[] = [
  { label: "Experience", value: "8+ years" },
  { label: "Trusted by", value: "3000+", detail: "Customers" },
  { label: "Trusted by", value: "50+", detail: "Dealers" },
  { label: "Focus", value: "Pro install & accessories" },
];

export function HomeStats() {
  return (
    <motion.div
      className="mx-auto mt-6 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 sm:gap-6"
      role="list"
      aria-label="Company highlights"
      variants={staggerContainer(0.12, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px", amount: 0.2 }}
    >
      {stats.map((s, index) => (
        <motion.article
          key={`${s.label}-${index}`}
          role="listitem"
          variants={staggerItem}
          className="min-w-0 rounded-2xl border border-border/80 bg-card/50 p-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-[box-shadow,border-color,transform] duration-500 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_16px_40px_-14px_rgba(255,69,0,0.12)]"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted">{s.label}</p>
          <p className="mt-1 font-[family-name:var(--font-syne)] text-2xl font-bold tabular-nums sm:text-[1.35rem]">
            {s.value}
          </p>
          {s.detail ? <p className="mt-1 text-sm font-normal text-muted">{s.detail}</p> : null}
        </motion.article>
      ))}
    </motion.div>
  );
}




