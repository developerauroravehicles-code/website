"use client";

import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Product } from "@prisma/client";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MagneticSpringLink } from "@/components/motion/MagneticSpringLink";
import { MagneticTextLink } from "@/components/motion/MagneticTextLink";
import { ProductImageGallery } from "@/components/marketing/ProductImageGallery";
import { productImageUrls } from "@/lib/product-utils";

export function ProductDetailMotion({
  product,
  belowScrollHero = false,
}: {
  product: Product;
  /** When true, skip the title block (already shown in `PremiumProductHero`). */
  belowScrollHero?: boolean;
}) {
  const imgs = useMemo(() => productImageUrls(product), [product.images]);
  const coverId = imgs[0] ? `product-cover-${product.slug}` : undefined;

  return (
    <>
      <MagneticTextLink href="/products" className="text-sm text-muted hover:text-accent">
        ← Back to products
      </MagneticTextLink>
      <div
        className={`grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-14 ${belowScrollHero ? "mt-8" : "mt-6"}`}
      >
        {belowScrollHero ? (
          <ScrollReveal y={14} className="lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Product</p>
            <h2 className="mt-3 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight sm:text-3xl">
              Gallery &amp; details
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Explore every angle, read the full breakdown, and see what ships with this setup.
            </p>
          </ScrollReveal>
        ) : null}
        <div className="min-w-0">
          {imgs.length === 0 ? (
            <div className="flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-card text-sm text-muted shadow-[0_8px_32px_-16px_rgba(0,0,0,0.45)]">
              No image
            </div>
          ) : (
            <ProductImageGallery images={imgs} productName={product.name} coverLayoutId={coverId} />
          )}
        </div>
        <div className="min-w-0">
          {belowScrollHero ? null : (
            <ScrollReveal y={18}>
              {product.featured ? (
                <span className="inline-flex rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-gold">
                  Featured
                </span>
              ) : null}
              <h1 className="mt-3 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl">
                {product.name}
              </h1>
              <p className="mt-4 text-lg text-muted">{product.shortDescription}</p>
            </ScrollReveal>
          )}
          <ScrollReveal
            className={`prose-product ${belowScrollHero ? "mt-0" : "mt-8"}`}
            delay={belowScrollHero ? 0.06 : 0.08}
          >
            <ReactMarkdown>{product.longDescription || ""}</ReactMarkdown>
          </ScrollReveal>
          <ScrollReveal delay={0.12}>
            <div className="mt-10 rounded-2xl border border-accent/25 bg-accent/5 p-6 shadow-[0_8px_32px_-16px_rgba(255,69,0,0.2)]">
              <p className="font-semibold text-foreground">Installation & info</p>
              <p className="mt-2 text-sm text-muted">
                Want a quote or help checking fitment for this setup? We&apos;re happy to help.
              </p>
              <div className="mt-4 inline-flex">
                <MagneticSpringLink href="/contact" variant="ghost" magneticStrength={0.26}>
                  Get in touch
                </MagneticSpringLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </>
  );
}
