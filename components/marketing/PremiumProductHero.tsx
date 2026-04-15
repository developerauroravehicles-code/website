"use client";

import { useMemo } from "react";
import type { Product } from "@prisma/client";
import { PremiumScrollHero } from "@/components/marketing/PremiumScrollHero";
import { productImageUrls } from "@/lib/product-utils";

const DEFAULT_SPECS = [
  { label: "UHD", sub: "4K pipeline" },
  { label: "f/1.8", sub: "Low-light glass" },
  { label: "140°", sub: "Wide FOV" },
];

const FALLBACK_FRONT = "/products/lynx-eye/1.png";

export function PremiumProductHero({ product }: { product: Product }) {
  const imgs = useMemo(() => productImageUrls(product), [product.images]);
  const front = imgs[0] ?? FALLBACK_FRONT;

  return (
    <PremiumScrollHero
      featured={product.featured}
      title={product.name}
      subtitle={product.shortDescription}
      frontImageSrc={front}
      frontAlt={product.name}
      specs={DEFAULT_SPECS}
      primaryCta={{ href: "/contact", label: "Get a quote" }}
      secondaryCta={{ href: "/products", label: "All products" }}
    />
  );
}
