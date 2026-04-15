import Link from "next/link";
import { prisma } from "@/lib/db";
import { getHomeHeroProductId } from "@/lib/home-hero";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { setHomeHeroProductAction } from "@/app/actions/products";

type Props = { searchParams?: Promise<{ q?: string }> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = params?.q?.trim();
  const [products, activeHeroProductId] = await Promise.all([
    prisma.product.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { slug: { contains: q } },
              { shortDescription: { contains: q } },
            ],
          }
        : undefined,
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    }),
    getHomeHeroProductId(),
  ]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">
            Products
          </h1>
          <p className="mt-2 text-sm text-zinc-400">Manage items shown on the public site.</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex h-10 items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
        >
          New product
        </Link>
      </div>

      <form method="get" className="flex max-w-md gap-2">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search…"
          className="h-10 flex-1 rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="rounded-lg border border-zinc-700 px-4 text-sm text-zinc-200 transition hover:bg-zinc-800"
        >
          Search
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/30">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/60 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Featured</th>
              <th className="hidden px-4 py-3 font-medium lg:table-cell">Homepage hero</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">
                  No records yet. Add a product.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-zinc-900/50">
                  <td className="px-4 py-3 font-medium text-zinc-100">{p.name}</td>
                  <td className="hidden px-4 py-3 text-zinc-500 md:table-cell">{p.slug}</td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-300">
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-200">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="hidden px-4 py-3 text-zinc-400 sm:table-cell">
                    {p.featured ? "Yes" : "No"}
                  </td>
                  <td className="hidden px-4 py-3 lg:table-cell">
                    {activeHeroProductId === p.id ? (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-medium text-accent">
                        Active
                      </span>
                    ) : (
                      <form action={setHomeHeroProductAction.bind(null, p.id)}>
                        <button type="submit" className="text-xs text-zinc-300 underline-offset-2 hover:text-white hover:underline">
                          Vitrine al
                        </button>
                      </form>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-accent hover:underline">
                        Edit
                      </Link>
                      <DeleteProductButton productId={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
