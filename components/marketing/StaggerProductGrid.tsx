"use client";

import { motion } from "framer-motion";
import type { Product } from "@prisma/client";
import { ProductCard } from "@/components/marketing/ProductCard";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";
import { useElementInView } from "@/lib/use-element-in-view";

type Props = {
  products: Product[];
  emptyMessage?: string;
};

export function StaggerProductGrid({ products, emptyMessage }: Props) {
  const { ref, inView } = useElementInView<HTMLDivElement>({
    rootMargin: "0px 0px 18% 0px",
    threshold: 0,
    once: true,
  });

  if (products.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage ?? "Nothing to show yet."}</p>;
  }

  return (
    <motion.div
      ref={ref}
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer(0.095, 0.06)}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
      {products.map((p, i) => (
        <motion.div key={p.id} variants={staggerItem} className="h-full">
          <ProductCard product={p} imagePriority={i === 0} />
        </motion.div>
      ))}
    </motion.div>
  );
}
