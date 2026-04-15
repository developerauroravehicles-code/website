"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@prisma/client";
import { TiltCard } from "@/components/motion/TiltCard";
import { productImageUrls } from "@/lib/product-utils";
import { spring } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

export function ProductCard({ product }: { product: Product }) {
  const imgs = productImageUrls(product);
  const src = imgs[0];
  const coverId = src ? `product-cover-${product.slug}` : undefined;

  return (
    <TiltCard className="h-full" maxTilt={8}>
      <MotionLink
        layout
        href={`/products/${product.slug}`}
        transition={{ ...spring.premium, layout: spring.layout }}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/90 bg-card/75 shadow-[0_8px_40px_-16px_rgba(0,0,0,0.55),0_0_0_1px_rgba(255,255,255,0.05)_inset]"
        whileHover={{
          boxShadow:
            "0 24px 56px -18px rgba(255, 69, 0, 0.32), 0 0 0 1px rgba(255, 69, 0, 0.14) inset",
          borderColor: "rgba(255, 69, 0, 0.42)",
        }}
        whileTap={{ scale: 0.992 }}
      >
        <motion.div
          layoutId={coverId}
          layout
          transition={{ ...spring.premium, layout: spring.layout }}
          className="relative flex aspect-[3/2] min-h-0 items-center justify-center overflow-hidden bg-zinc-900 p-0.5 sm:p-1"
        >
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt=""
              className="max-h-full max-w-full object-contain transition duration-[0.7s] ease-[cubic-bezier(0.34,1.2,0.64,1)] group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-xs text-muted">No image</div>
          )}
          {product.featured ? (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground shadow-md ring-1 ring-black/20">
              Featured
            </span>
          ) : null}
        </motion.div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          <h3 className="font-[family-name:var(--font-syne)] text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
            {product.name}
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-muted">{product.shortDescription}</p>
          <span className="mt-auto pt-2 text-xs font-semibold uppercase tracking-wide text-accent">
            View details →
          </span>
        </div>
      </MotionLink>
    </TiltCard>
  );
}
