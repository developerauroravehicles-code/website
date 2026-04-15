"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Magnetic } from "@/components/motion/Magnetic";
import { RipplePress } from "@/components/motion/RipplePress";
import { spring } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function MotionAccentLink({ href, children, className = "" }: Props) {
  return (
    <Magnetic strength={0.2} as="span" className="inline-flex">
      <RipplePress as="span" className="inline-flex rounded-md align-baseline">
        <MotionLink
          href={href}
          className={className}
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={spring.snappy}
        >
          {children}
        </MotionLink>
      </RipplePress>
    </Magnetic>
  );
}
