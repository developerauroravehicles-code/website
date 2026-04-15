import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { updateProductAction } from "@/app/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  const boundUpdate = updateProductAction.bind(null, product.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/products" className="text-sm text-zinc-400 hover:text-white">
          ← Product list
        </Link>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">
          Edit product
        </h1>
        <p className="text-sm text-zinc-500">{product.name}</p>
      </div>
      <ProductForm product={product} action={boundUpdate} />
    </div>
  );
}
