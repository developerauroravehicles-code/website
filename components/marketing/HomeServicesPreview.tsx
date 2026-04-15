"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { TiltCard } from "@/components/motion/TiltCard";
import { staggerContainer, staggerItem, spring } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

const items = [
  {
    title: "Installation",
    body: "Clean routing that respects your interior, with quality-first workmanship.",
  },
  {
    title: "Accessories",
    body: "Power modules, storage, and connectivity—matched to your vehicle and camera.",
  },
];

export function HomeServicesPreview() {
  return (
    <motion.ul
      className="space-y-4 text-sm text-muted"
      variants={staggerContainer(0.12, 0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px", amount: 0.2 }}
    >
      {items.map((item) => (
        <motion.li key={item.title} variants={staggerItem}>
          <TiltCard maxTilt={6}>
            <div className="rounded-2xl border border-border/90 bg-background/55 p-4 shadow-[0_8px_32px_-18px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.04] transition-shadow hover:shadow-[0_12px_40px_-16px_rgba(255,69,0,0.16)]">
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="mt-1">{item.body}</p>
            </div>
          </TiltCard>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function HomeServicesCta() {
  return (
    <MotionLink
      href="/services"
      className="mt-6 inline-flex text-sm font-semibold text-accent"
      whileHover={{ x: 8 }}
      whileTap={{ scale: 0.98 }}
      transition={spring.snappy}
    >
      Learn more →
    </MotionLink>
  );
}
