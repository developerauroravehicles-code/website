"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/motion/Magnetic";
import { RipplePress } from "@/components/motion/RipplePress";
import { spring } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

type Props = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export function MagneticTextLink({ href, children, className = "" }: Props) {
  return (
    <Magnetic strength={0.2} className="inline-flex">
      <RipplePress className="inline-flex rounded-lg">
        <MotionLink
          href={href}
          className={className}
          whileTap={{ scale: 0.98 }}
          whileHover={{ x: -3 }}
          transition={spring.snappy}
        >
          {children}
        </MotionLink>
      </RipplePress>
    </Magnetic>
  );
}
