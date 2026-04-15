"use client";

import { motion } from "framer-motion";
import { TiltCard } from "@/components/motion/TiltCard";
import { staggerContainer, staggerItem, spring } from "@/lib/motion-presets";

type Item = { title: string; body: string };

export function ServiceStaggerGrid({ items }: { items: Item[] }) {
  return (
    <motion.div
      className="mt-12 grid gap-6 md:grid-cols-2"
      variants={staggerContainer(0.1, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px", amount: 0.12 }}
    >
      {items.map((s) => (
        <motion.div key={s.title} variants={staggerItem} className="h-full">
          <TiltCard className="h-full" maxTilt={7}>
            <motion.article
              className="h-full rounded-2xl border border-border/90 bg-card/65 p-6 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.04]"
              whileHover={{
                scale: 1.015,
                y: -5,
                boxShadow:
                  "0 22px 52px -20px rgba(255, 69, 0, 0.26), 0 0 0 1px rgba(255, 69, 0, 0.1) inset",
              }}
              transition={spring.premium}
            >
              <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold">{s.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{s.body}</p>
            </motion.article>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  );
}
