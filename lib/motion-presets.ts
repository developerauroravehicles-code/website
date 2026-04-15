/** Premium motion tokens — springs + selective easing for GSAP / legacy */

export const EASE_IN_OUT = [0.42, 0, 0.58, 1] as const;

export const DURATION = {
  fast: 0.45,
  normal: 0.6,
  slow: 0.75,
} as const;

/** Physics-first springs (Framer Motion) */
export const spring = {
  /** Default UI — balanced, Linear-like */
  premium: { type: "spring" as const, stiffness: 320, damping: 36, mass: 0.92 },
  /** Softer settles */
  soft: { type: "spring" as const, stiffness: 220, damping: 32, mass: 1 },
  /** Buttons / micro */
  snappy: { type: "spring" as const, stiffness: 440, damping: 42, mass: 0.72 },
  /** Shared layout / layoutId morphs */
  layout: { type: "spring" as const, stiffness: 340, damping: 34, mass: 0.88 },
  /** Product gallery — slow, weighty, Apple-like */
  gallery: { type: "spring" as const, stiffness: 200, damping: 32, mass: 1.08 },
  /** Gallery shared-element morph — smooth, not snappy */
  galleryLayout: { type: "spring" as const, stiffness: 260, damping: 36, mass: 0.98 },
} as const;

/** layout prop transition (shared element) */
export const layoutSpringTransition = {
  layout: spring.layout,
} as const;

export const transition = {
  default: spring.premium,
  fast: spring.snappy,
  slow: spring.soft,
} as const;

export const fadeSlideUp = {
  hidden: { opacity: 0, y: 28, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: spring.premium,
  },
};

export const staggerContainer = (stagger = 0.085, delayChildren = 0.05) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
      when: "beforeChildren" as const,
    },
  },
});

export const staggerItem = {
  hidden: {
    opacity: 0,
    y: 22,
    scale: 0.97,
    filter: "blur(6px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: spring.premium,
  },
};
