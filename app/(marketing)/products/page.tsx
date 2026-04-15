import type { Metadata } from "next";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { StaggerProductGrid } from "@/components/marketing/StaggerProductGrid";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Products",
  description: "In-car camera systems — showcase only. No online checkout.",
};

export const revalidate = 120;

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <ScrollReveal>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Catalog</p>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-3xl font-bold tracking-tight sm:text-4xl">
          Products
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          Items below are for display only. We do not list prices or stock, and purchases are not completed on this
          website.
        </p>
      </ScrollReveal>
      <div className="mt-12">
        <StaggerProductGrid products={products} emptyMessage="New products will appear here soon." />
      </div>
    </div>
  );
}
