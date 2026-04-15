"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { spring } from "@/lib/motion-presets";

type Props = {
  images: string[];
  productName: string;
  coverLayoutId?: string;
};

const ORGANIC = {
  x: [0, 4, -3, 5, -2, 2, 0],
  y: [0, -3, 4, -2, 3, -4, 0],
  transition: {
    duration: 24,
    repeat: Infinity,
    ease: [0.45, 0, 0.55, 1] as [number, number, number, number],
    times: [0, 0.15, 0.32, 0.48, 0.62, 0.82, 1],
  },
};

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      className="size-3 sm:size-3.5"
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === "left" ? <path d="M7.5 2.5 4 6l3.5 3.5" /> : <path d="m4.5 2.5L8 6 4.5 9.5" />}
    </svg>
  );
}

function GalleryLensLayer({
  stageHovered,
  cursorX,
  cursorY,
}: {
  stageHovered: boolean;
  cursorX: MotionValue<number>;
  cursorY: MotionValue<number>;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-2xl">
      <motion.div
        className="absolute left-[54%] top-[46%] -translate-x-1/2 -translate-y-1/2"
        animate={{ x: ORGANIC.x, y: ORGANIC.y }}
        transition={ORGANIC.transition}
      >
        <motion.div
          className="relative size-[2.75rem] sm:size-[3.25rem]"
          style={{ x: cursorX, y: cursorY }}
          animate={{
            opacity: stageHovered ? 0.36 : 0.24,
            scale: stageHovered ? 1.05 : 1,
          }}
          transition={spring.gallery}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 38%, transparent 70%)",
              filter: "blur(8px)",
            }}
            animate={{
              boxShadow: stageHovered
                ? [
                    "0 0 22px rgba(255,69,0,0.26)",
                    "0 0 30px rgba(255,69,0,0.34)",
                    "0 0 22px rgba(255,69,0,0.26)",
                  ]
                : "0 0 20px rgba(255,69,0,0.22)",
            }}
            transition={{
              boxShadow: { duration: 3.4, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export function ProductImageGallery({ images, productName, coverLayoutId }: Props) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageHovered, setStageHovered] = useState(false);
  const activeIndexRef = useRef(0);
  activeIndexRef.current = activeIndex;

  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const lensCx = useSpring(0, { stiffness: 200, damping: 32 });
  const lensCy = useSpring(0, { stiffness: 200, damping: 32 });

  const shX = useSpring(useTransform(mx, [-0.5, 0.5], [10, -10]), { stiffness: 70, damping: 24 });
  const shY = useSpring(useTransform(my, [-0.5, 0.5], [14, 6]), { stiffness: 70, damping: 24 });
  const dynamicShadow = useMotionTemplate`0 ${shY}px 48px -18px rgba(0,0,0,0.55), ${shX}px ${shY}px 36px -24px rgba(255,69,0,0.08)`;

  const onStageMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    mx.set(px);
    my.set(py);
    if (activeIndexRef.current === 0) {
      lensCx.set(px * 14);
      lensCy.set(py * 14);
    }
  };

  const onStageLeave = () => {
    mx.set(0);
    my.set(0);
    lensCx.set(0);
    lensCy.set(0);
    setStageHovered(false);
  };

  const setIndex = useCallback((i: number) => {
    setActiveIndex(Math.min(images.length - 1, Math.max(0, i)));
  }, [images.length]);

  useEffect(() => {
    const btn = thumbRefs.current[activeIndex];
    if (!btn) return;
    btn.scrollIntoView({ inline: "center", block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }, [activeIndex, reduceMotion]);

  useEffect(() => {
    if (activeIndex !== 0) {
      lensCx.set(0);
      lensCy.set(0);
    }
  }, [activeIndex, lensCx, lensCy]);

  const go = (dir: -1 | 1) => setIndex(activeIndex + dir);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const mainLayoutId = activeIndex === 0 ? coverLayoutId ?? "pg-view-0" : `pg-view-${activeIndex}`;
  const thumbLayoutIdFor = (i: number) =>
    i === activeIndex && !(activeIndex === 0 && coverLayoutId) ? `pg-view-${activeIndex}` : undefined;

  const showLens = activeIndex === 0 && !reduceMotion;

  if (images.length === 0) {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted">
        No image
      </div>
    );
  }

  return (
    <LayoutGroup id={`gallery-${productName.replace(/\s+/g, "-")}`}>
      <div
        className="relative rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        role="region"
        aria-roledescription="carousel"
        aria-label={`${productName} photo gallery`}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <motion.div
          className="relative mx-auto w-full max-w-7xl"
          onMouseEnter={() => setStageHovered(true)}
          onMouseMove={onStageMove}
          onMouseLeave={onStageLeave}
        >
          <motion.div
            className="relative overflow-hidden rounded-2xl border border-border/90 bg-zinc-900 ring-1 ring-white/[0.06]"
            style={{
              boxShadow: reduceMotion ? "0 24px 48px -20px rgba(0,0,0,0.55)" : dynamicShadow,
            }}
          >
            <div className="relative aspect-[3/2] w-full sm:aspect-[5/3]">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeIndex}
                  className="absolute inset-0 flex min-h-0 min-w-0 items-center justify-center overflow-hidden p-0"
                  initial={{ opacity: 0.84, scale: 1.016 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.8, scale: 0.992 }}
                  transition={{
                    ...spring.gallery,
                    opacity: { duration: 0.52, ease: [0.22, 1, 0.36, 1] },
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <motion.img
                    layoutId={mainLayoutId}
                    src={images[activeIndex]}
                    alt={`${productName} — photo ${activeIndex + 1} of ${images.length}`}
                    className="relative z-0 max-h-full max-w-full origin-center scale-[1.17] object-contain object-center"
                    draggable={false}
                    loading={activeIndex === 0 ? "eager" : "lazy"}
                    initial={{ filter: reduceMotion ? "blur(0px)" : "blur(6px)" }}
                    animate={{ filter: "blur(0px)" }}
                    exit={{ filter: reduceMotion ? "blur(0px)" : "blur(5px)" }}
                    transition={{
                      ...spring.gallery,
                      duration: 0.52,
                      layout: spring.galleryLayout,
                    }}
                  />
                </motion.div>
              </AnimatePresence>

              {showLens ? (
                <GalleryLensLayer stageHovered={stageHovered} cursorX={lensCx} cursorY={lensCy} />
              ) : null}
            </div>
          </motion.div>
        </motion.div>

        {images.length > 1 ? (
          <>
            <div
              className="mt-5 flex justify-center gap-2.5 overflow-x-auto pb-1 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="tablist"
              aria-label="Gallery thumbnails"
            >
              {images.map((src, i) => {
                const active = i === activeIndex;
                return (
                  <motion.button
                    key={src}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    aria-label={`Photo ${i + 1} of ${images.length}`}
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    onClick={() => setIndex(i)}
                    layout
                    whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    className={`relative shrink-0 overflow-hidden rounded-xl border-2 ${
                      active
                        ? "border-accent shadow-[0_0_26px_-6px_rgba(255,69,0,0.45)] ring-2 ring-accent/35"
                        : "border-border/70 opacity-[0.82] hover:border-accent/45 hover:opacity-100"
                    }`}
                    animate={active ? { scale: reduceMotion ? 1 : 1.06 } : { scale: 1 }}
                    transition={{ ...spring.gallery, layout: spring.galleryLayout }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <motion.img
                      layoutId={thumbLayoutIdFor(i)}
                      src={src}
                      alt=""
                      className="h-16 w-24 object-cover brightness-[0.98] sm:h-[4.75rem] sm:w-[7.25rem]"
                      draggable={false}
                      whileHover={reduceMotion ? undefined : { filter: "brightness(1.12)" }}
                      transition={{ ...spring.soft, layout: spring.galleryLayout }}
                    />
                    {active ? (
                      <span
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-accent to-orange-400"
                        aria-hidden
                      />
                    ) : null}
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-5 flex items-center justify-center gap-4">
              <motion.button
                type="button"
                aria-label="Previous photo"
                disabled={activeIndex <= 0}
                onClick={() => go(-1)}
                whileTap={{ scale: 0.94 }}
                className="flex size-10 items-center justify-center rounded-full border border-border/90 bg-card/95 text-foreground shadow-lg transition hover:border-accent/50 hover:text-accent disabled:pointer-events-none disabled:opacity-25"
              >
                <Chevron dir="left" />
              </motion.button>
              <span className="min-w-[3.5rem] tabular-nums text-center text-xs font-medium tracking-wide text-muted">
                {activeIndex + 1} · {images.length}
              </span>
              <motion.button
                type="button"
                aria-label="Next photo"
                disabled={activeIndex >= images.length - 1}
                onClick={() => go(1)}
                whileTap={{ scale: 0.94 }}
                className="flex size-10 items-center justify-center rounded-full border border-border/90 bg-card/95 text-foreground shadow-lg transition hover:border-accent/50 hover:text-accent disabled:pointer-events-none disabled:opacity-25"
              >
                <Chevron dir="right" />
              </motion.button>
            </div>
          </>
        ) : null}
      </div>
    </LayoutGroup>
  );
}
