"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ScrollFade } from "@/components/motion/ScrollReveal";
import { EASE_IN_OUT } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

export function AnimatedSiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card/40 shadow-[0_-8px_40px_-20px_rgba(0,0,0,0.35)]">
      <ScrollFade>
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 lg:flex-row lg:justify-between lg:px-8">
          <div className="max-w-md space-y-4">
            <Link
              href="/"
              className="inline-block outline-none ring-offset-2 ring-offset-card/40 focus-visible:ring-2 focus-visible:ring-accent"
            >
              <span className="font-[family-name:var(--font-syne)] text-xl font-bold tracking-tight text-foreground transition-colors hover:text-accent">
                Aurora Vehicles Inc.
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-muted">
              Premium in-car camera solutions and professional installation. Crisp recording and concealed wiring for
              peace of mind on every drive.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3">
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Explore</p>
              <ul className="space-y-1.5 text-muted">
                <li>
                  <MotionLink href="/services" className="inline-block hover:text-accent" whileHover={{ x: 4 }} transition={{ duration: 0.4, ease: EASE_IN_OUT }}>
                    Services
                  </MotionLink>
                </li>
                <li>
                  <MotionLink href="/products" className="inline-block hover:text-accent" whileHover={{ x: 4 }} transition={{ duration: 0.4, ease: EASE_IN_OUT }}>
                    Products
                  </MotionLink>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Company</p>
              <ul className="space-y-1.5 text-muted">
                <li>
                  <MotionLink href="/about" className="inline-block hover:text-accent" whileHover={{ x: 4 }} transition={{ duration: 0.4, ease: EASE_IN_OUT }}>
                    About
                  </MotionLink>
                </li>
                <li>
                  <MotionLink href="/contact" className="inline-block hover:text-accent" whileHover={{ x: 4 }} transition={{ duration: 0.4, ease: EASE_IN_OUT }}>
                    Contact
                  </MotionLink>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Note</p>
              <p className="text-muted">We do not sell online; products on this site are for showcase only.</p>
            </div>
          </div>
        </div>
      </ScrollFade>
      <div className="border-t border-border/80 py-4 text-center text-xs text-muted">
        © {new Date().getFullYear()} Aurora Vehicles Inc. All rights reserved.
      </div>
    </footer>
  );
}
