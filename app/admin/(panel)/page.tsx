import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [total, published, drafts] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { published: true } }),
    prisma.product.count({ where: { published: false } }),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">Overview</h1>
        <p className="mt-2 text-sm text-zinc-400">Your public catalog and drafts.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Total products</p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold tabular-nums">{total}</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Published</p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold tabular-nums text-emerald-400">
            {published}
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">Draft</p>
          <p className="mt-2 font-[family-name:var(--font-syne)] text-3xl font-bold tabular-nums text-amber-300">
            {drafts}
          </p>
        </div>
      </div>
      <Link
        href="/admin/products"
        className="inline-flex items-center rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
      >
        Manage products
      </Link>
    </div>
  );
}
