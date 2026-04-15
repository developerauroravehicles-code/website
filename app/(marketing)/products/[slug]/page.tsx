import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PremiumProductHero } from "@/components/marketing/PremiumProductHero";
import { ProductDetailMotion } from "@/components/marketing/ProductDetailMotion";
import { prisma } from "@/lib/db";
import { productImageUrls } from "@/lib/product-utils";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 120;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
  });
  if (!product) {
    return { title: "Product" };
  }
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: productImageUrls(product).slice(0, 1).map((url) => ({ url })),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
  });
  if (!product) notFound();

  return (
    <>
      <PremiumProductHero product={product} />
      <div className="border-t border-border bg-background">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <ProductDetailMotion product={product} belowScrollHero />
        </div>
      </div>
    </>
  );
}
