"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { usePathname } from "next/navigation";
import { MagneticSpringLink } from "@/components/motion/MagneticSpringLink";
import { spring } from "@/lib/motion-presets";

const nav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function NavPillLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className="relative z-0 rounded-xl px-3 py-2 text-sm font-medium">
      {active ? (
        <motion.span
          layoutId="nav-active-pill"
          className="absolute inset-0 -z-10 rounded-xl bg-white/[0.09] shadow-[0_0_28px_-6px_rgba(255,69,0,0.4)] ring-1 ring-white/[0.08]"
          transition={spring.layout}
        />
      ) : null}
      <span className={`relative z-10 transition-colors ${active ? "text-foreground" : "text-muted"}`}>
        {label}
      </span>
    </Link>
  );
}

export function AnimatedSiteHeader() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(useTransform(scrollYProgress, [0, 1], [0.04, 1]), {
    stiffness: 140,
    damping: 42,
    mass: 0.35,
  });

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring.soft}
      className="sticky top-0 z-50 border-b border-border/80 bg-background/88 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.5)] backdrop-blur-xl"
    >
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-accent/90 via-gold/50 to-accent/30"
          style={{ scaleX }}
        />
      ) : null}
      <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <motion.div whileHover={reduceMotion ? undefined : { scale: 1.03 }} whileTap={{ scale: 0.98 }} transition={spring.snappy}>
          <Link
            href="/"
            className="group flex items-center outline-none ring-offset-2 ring-offset-background focus-visible:ring-2 focus-visible:ring-accent"
          >
            <span className="font-[family-name:var(--font-syne)] text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-accent sm:text-lg">
              Aurora Vehicles Inc.
            </span>
          </Link>
        </motion.div>
        <nav className="hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <NavPillLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>
        <MagneticSpringLink
          href="/contact"
          variant="primary"
          className="px-4 py-2 text-xs sm:text-sm"
          magneticStrength={0.3}
        >
          Book install
        </MagneticSpringLink>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-border/60 px-4 pb-3 md:hidden">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium text-muted ring-1 ring-border/80"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </motion.header>
  );
}
