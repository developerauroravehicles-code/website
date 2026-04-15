import Link from "next/link";
import { createProductAction } from "@/app/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/products" className="text-sm text-zinc-400 hover:text-white">
          ← Product list
        </Link>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">
          New product
        </h1>
      </div>
      <ProductForm action={createProductAction} />
    </div>
  );
}
