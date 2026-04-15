import type { Product } from "@prisma/client";
import { productImageUrls } from "@/lib/product-utils";
import { ImagesField } from "@/components/admin/ImagesField";

type Props = {
  product?: Product;
  action: (formData: FormData) => void | Promise<void>;
};

export function ProductForm({ product, action }: Props) {
  const imagesText = product ? productImageUrls(product).join("\n") : "";

  return (
    <form action={action} className="mx-auto max-w-3xl space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label htmlFor="name" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Product name
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="slug" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            URL slug (optional)
          </label>
          <input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            placeholder="Leave blank to generate from name"
            className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="sortOrder" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
            Sort order
          </label>
          <input
            id="sortOrder"
            name="sortOrder"
            type="number"
            defaultValue={product?.sortOrder ?? 0}
            className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm tabular-nums outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="shortDescription"
            className="text-xs font-medium uppercase tracking-wide text-zinc-400"
          >
            Short description
          </label>
          <input
            id="shortDescription"
            name="shortDescription"
            required
            defaultValue={product?.shortDescription}
            className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="longDescription"
            className="text-xs font-medium uppercase tracking-wide text-zinc-400"
          >
            Details (Markdown supported)
          </label>
          <textarea
            id="longDescription"
            name="longDescription"
            rows={8}
            defaultValue={product?.longDescription}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <ImagesField defaultValue={imagesText} productSlug={product?.slug} />
        </div>
      </div>
      <div className="flex flex-wrap gap-6">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={product?.featured}
            className="size-4 rounded border-zinc-600 bg-zinc-950 accent-accent"
          />
          Featured
        </label>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
          <input
            type="checkbox"
            name="published"
            defaultChecked={product?.published ?? true}
            className="size-4 rounded border-zinc-600 bg-zinc-950 accent-accent"
          />
          Published
        </label>
      </div>
      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
        >
          Save
        </button>
      </div>
    </form>
  );
}
