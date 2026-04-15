"use client";

import { motion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

type Stat = { label: string; value: string; detail?: string };

const stats: Stat[] = [
  { label: "Experience", value: "5+ yrs" },
  { label: "Trusted by", value: "50+", detail: "Dealers and counting" },
  { label: "Focus", value: "Pro install & accessories" },
];

export function HomeStats() {
  return (
    <motion.dl
      className="mx-auto mt-6 grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6"
      variants={staggerContainer(0.12, 0.1)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px", amount: 0.2 }}
    >
      {stats.map((s) => (
        <motion.div
          key={s.label}
          variants={staggerItem}
          className="min-w-0 rounded-2xl border border-border/80 bg-card/50 p-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.5)] backdrop-blur-sm transition-[box-shadow,border-color,transform] duration-500 ease-[var(--ease-premium)] hover:-translate-y-0.5 hover:border-accent/25 hover:shadow-[0_16px_40px_-14px_rgba(255,69,0,0.12)]"
        >
          <dt className="text-xs font-medium uppercase tracking-wide text-muted">{s.label}</dt>
          <dd className="mt-1 font-[family-name:var(--font-syne)] text-2xl font-bold tabular-nums sm:text-[1.35rem]">
            {s.value}
          </dd>
          {s.detail ? (
            <dd className="mt-1 text-sm font-normal text-muted">{s.detail}</dd>
          ) : null}
        </motion.div>
      ))}
    </motion.dl>
  );
}
