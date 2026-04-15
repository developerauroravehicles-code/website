"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Product } from "@prisma/client";
import { productImageUrls } from "@/lib/product-utils";
import { staggerContainer, staggerItem, spring } from "@/lib/motion-presets";

const MotionLink = motion.create(Link);

function EliteProductLink({
  product,
  className,
  imageClassName,
  compact,
}: {
  product: Product;
  className?: string;
  imageClassName?: string;
  compact?: boolean;
}) {
  const src = productImageUrls(product)[0];
  const href = `/products/${product.slug}`;

  return (
    <MotionLink
      href={href}
      layoutId={`elite-cover-${product.slug}`}
      transition={{ ...spring.premium, layout: spring.layout }}
      className={[
        "group relative flex flex-col overflow-hidden border border-white/[0.08] bg-zinc-950/40 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.03] transition-[border-color,box-shadow] duration-500",
        "hover:border-accent/25 hover:shadow-[0_40px_100px_-40px_rgba(255,69,0,0.18)]",
        className ?? "",
      ].join(" ")}
      whileHover={{ y: compact ? -2 : -4 }}
      whileTap={{ scale: 0.995 }}
    >
      <div
        className={[
          "relative overflow-hidden bg-zinc-900",
          compact ? "aspect-[4/3]" : "min-h-[280px] flex-1 sm:min-h-[340px] lg:min-h-[420px]",
          imageClassName ?? "",
        ].join(" ")}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="size-full object-cover transition duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full min-h-[200px] items-center justify-center text-[11px] uppercase tracking-[0.2em] text-muted/80">
            No image
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-90" />
        {product.featured ? (
          <span className="absolute left-4 top-4 text-[10px] font-semibold uppercase tracking-[0.35em] text-gold">
            Signature
          </span>
        ) : null}
      </div>
      <div className={compact ? "p-4 sm:p-5" : "p-6 sm:p-8"}>
        <h3
          className={[
            "font-[family-name:var(--font-syne)] font-semibold tracking-tight text-foreground transition-colors group-hover:text-gold",
            compact ? "text-base sm:text-lg" : "text-xl sm:text-2xl",
          ].join(" ")}
        >
          {product.name}
        </h3>
        <p
          className={[
            "mt-2 leading-relaxed text-muted",
            compact ? "line-clamp-2 text-xs sm:text-sm" : "max-w-md text-sm sm:text-[0.9375rem]",
          ].join(" ")}
        >
          {product.shortDescription}
        </p>
        <span className="mt-4 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-accent">
          Explore
          <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </MotionLink>
  );
}

type Props = {
  products: Product[];
  emptyMessage: string;
};

export function EliteHomeCollection({ products, emptyMessage }: Props) {
  if (products.length === 0) {
    return (
      <p className="border border-dashed border-white/[0.12] px-6 py-16 text-center text-sm text-muted">{emptyMessage}</p>
    );
  }

  const [primary, ...rest] = products;
  const secondary = rest.slice(0, 2);

  return (
    <motion.div
      className="grid gap-6 lg:grid-cols-12 lg:gap-8 lg:items-stretch"
      variants={staggerContainer(0.08, 0.05)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-56px", amount: 0.15 }}
    >
      <motion.div variants={staggerItem} className="lg:col-span-7">
        <EliteProductLink product={primary} className="h-full min-h-[480px] lg:min-h-0" />
      </motion.div>
      {secondary.length > 0 ? (
        <motion.div variants={staggerItem} className="flex flex-col gap-6 lg:col-span-5">
          {secondary.map((p) => (
            <EliteProductLink key={p.id} product={p} compact className="flex-1" />
          ))}
        </motion.div>
      ) : null}
    </motion.div>
  );
}
