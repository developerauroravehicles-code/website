"use client";

import { motion } from "framer-motion";
import type { Product } from "@prisma/client";
import { ProductCard } from "@/components/marketing/ProductCard";
import { staggerContainer, staggerItem } from "@/lib/motion-presets";

type Props = {
  products: Product[];
  emptyMessage?: string;
};

export function StaggerProductGrid({ products, emptyMessage }: Props) {
  if (products.length === 0) {
    return <p className="text-sm text-muted">{emptyMessage ?? "Nothing to show yet."}</p>;
  }

  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer(0.095, 0.06)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-48px", amount: 0.2 }}
    >
      {products.map((p) => (
        <motion.div key={p.id} variants={staggerItem} className="h-full">
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
