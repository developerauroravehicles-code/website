"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { HeroParallaxLayers } from "@/components/motion/HeroParallaxLayers";
import { ReactiveLensHighlight } from "@/components/motion/ReactiveLensHighlight";
import { MagneticSpringLink } from "@/components/motion/MagneticSpringLink";
import { HomeStats } from "@/components/marketing/HomeStats";
import { spring, staggerContainer, staggerItem } from "@/lib/motion-presets";

const headline = "Crisp footage. Flawless installs.".split(" ");

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  return (
    <section ref={sectionRef} className="relative overflow-hidden border-b border-border">
      {!reduceMotion ? (
        <>
          <HeroParallaxLayers sectionRef={sectionRef} />
          <ReactiveLensHighlight trackRef={sectionRef} top="36%" left="min(88%, calc(100% - 3rem))" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,69,0,0.14),_transparent_55%)]" aria-hidden />
      )}
      <div className="relative z-10 mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <motion.p
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring.soft, delay: 0.04 }}
          className="text-xs font-semibold uppercase tracking-[0.25em] text-gold"
        >
          Safety on every drive
        </motion.p>
        <motion.h1
          className="mt-4 flex max-w-3xl flex-wrap gap-x-2 gap-y-1 font-[family-name:var(--font-syne)] text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:gap-x-2.5 lg:text-6xl"
          variants={staggerContainer(0.065, 0.1)}
          initial="hidden"
          animate="visible"
        >
          {headline.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              variants={staggerItem}
              className="inline-block"
              style={{ willChange: "opacity, transform" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
        <motion.p
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.99 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...spring.premium, delay: 0.48 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted"
        >
          Premium dashcam hardware and experienced technicians for clean, concealed wiring. Our catalog is for
          showcase only—reach out for installation and guidance.
        </motion.p>
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring.premium, delay: 0.62 }}
          className="mt-10 flex flex-wrap gap-4"
        >
          <MagneticSpringLink href="/products" variant="primary" magneticStrength={0.28}>
            Browse products
          </MagneticSpringLink>
          <MagneticSpringLink href="/contact" variant="secondary" magneticStrength={0.24}>
            Book installation
          </MagneticSpringLink>
        </motion.div>
        <HomeStats />
      </div>
    </section>
  );
}
