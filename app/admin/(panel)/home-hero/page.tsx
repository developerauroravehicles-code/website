import Link from "next/link";
import { HomeHeroStatsForm } from "@/components/admin/HomeHeroStatsForm";
import { SignatureProductsForm } from "@/components/admin/SignatureProductsForm";
import { prisma } from "@/lib/db";

type Props = {
  searchParams: Promise<{ saved?: string; error?: string; sig?: string; sigError?: string }>;
};

export default async function AdminHomeHeroPage({ searchParams }: Props) {
  const sp = await searchParams;
  const [row, publishedProducts] = await Promise.all([
    prisma.siteSetting.findUnique({ where: { id: 1 } }),
    prisma.product.findMany({
      where: { published: true },
      select: { id: true, name: true },
      orderBy: [{ name: "asc" }],
    }),
  ]);

  const values = row
    ? {
        homeStat1Label: row.homeStat1Label,
        homeStat1Sub: row.homeStat1Sub,
        homeStat2Label: row.homeStat2Label,
        homeStat2Sub: row.homeStat2Sub,
        homeStat3Label: row.homeStat3Label,
        homeStat3Sub: row.homeStat3Sub,
      }
    : null;

  const signatureIds: [string | null, string | null, string | null] = row
    ? [row.signatureProduct1Id, row.signatureProduct2Id, row.signatureProduct3Id]
    : [null, null, null];

  return (
    <div className="space-y-16">
      <div>
        <Link href="/admin" className="text-sm text-zinc-400 hover:text-white">
          ← Overview
        </Link>
        <h1 className="mt-4 font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight md:text-3xl">
          Home page
        </h1>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Stat tiles under the hero image, Signature product grid, and the hero product image (from the product list →
          “Set as home hero”).
        </p>
      </div>

      <HomeHeroStatsForm
        values={values}
        saved={sp.saved === "1"}
        error={sp.error === "missing" ? "All six fields are required." : undefined}
      />

      <div className="border-t border-zinc-800 pt-16">
        <SignatureProductsForm
          products={publishedProducts}
          selectedIds={signatureIds}
          saved={sp.sig === "1"}
          error={
            sp.sigError === "invalid"
              ? "Each selected product must be published."
              : sp.sigError === "db"
                ? "Could not save (database or schema mismatch). Run `npx prisma db push` and restart the dev server."
                : undefined
          }
        />
      </div>
    </div>
  );
}
