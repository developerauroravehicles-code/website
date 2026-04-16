import type { Product } from "@prisma/client";
import { prisma } from "@/lib/db";

export const DEFAULT_HOME_HERO_SPECS = [
  { label: "UHD", sub: "4K pipeline" },
  { label: "f/1.8", sub: "Low-light glass" },
  { label: "140°", sub: "Wide FOV" },
] as const;

export type HomeHeroSpec = { label: string; sub: string };

/** Stat tiles under the home hero image — from `SiteSetting` row id=1, with fallbacks. */
export async function getHomeHeroSpecs(): Promise<HomeHeroSpec[]> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (!row) return [...DEFAULT_HOME_HERO_SPECS];
    return [
      {
        label: row.homeStat1Label.trim() || DEFAULT_HOME_HERO_SPECS[0].label,
        sub: row.homeStat1Sub.trim() || DEFAULT_HOME_HERO_SPECS[0].sub,
      },
      {
        label: row.homeStat2Label.trim() || DEFAULT_HOME_HERO_SPECS[1].label,
        sub: row.homeStat2Sub.trim() || DEFAULT_HOME_HERO_SPECS[1].sub,
      },
      {
        label: row.homeStat3Label.trim() || DEFAULT_HOME_HERO_SPECS[2].label,
        sub: row.homeStat3Sub.trim() || DEFAULT_HOME_HERO_SPECS[2].sub,
      },
    ];
  } catch {
    return [...DEFAULT_HOME_HERO_SPECS];
  }
}

const SIGNATURE_FALLBACK_ORDER = [
  { featured: "desc" as const },
  { sortOrder: "asc" as const },
  { name: "asc" as const },
];

type SignatureIdsRow = {
  signatureProduct1Id: string | null;
  signatureProduct2Id: string | null;
  signatureProduct3Id: string | null;
};

/**
 * Home “Signature” grid: three products in order (large left, top-right, bottom-right).
 * Uses admin-picked slots when set and published; fills remaining slots from the catalog.
 *
 * Reads slot IDs with `$queryRaw` so a Turbopack-cached stale Prisma client (missing `signatureProduct*`
 * relations on `findUnique`/`include`) cannot throw PrismaClientValidationError.
 */
export async function getSignatureSectionProducts(): Promise<Product[]> {
  let slotIds: [string | null, string | null, string | null] = [null, null, null];
  try {
    const rows = await prisma.$queryRaw<SignatureIdsRow[]>`
      SELECT "signatureProduct1Id", "signatureProduct2Id", "signatureProduct3Id"
      FROM "SiteSetting"
      WHERE "id" = 1
      LIMIT 1
    `;
    if (rows[0]) {
      slotIds = [
        rows[0].signatureProduct1Id,
        rows[0].signatureProduct2Id,
        rows[0].signatureProduct3Id,
      ];
    }
  } catch {
    slotIds = [null, null, null];
  }

  const picked: Product[] = [];
  const seen = new Set<string>();

  const distinctIds = [...new Set(slotIds.filter((id): id is string => Boolean(id)))];
  if (distinctIds.length > 0) {
    const found = await prisma.product.findMany({ where: { id: { in: distinctIds } } });
    const byId = new Map(found.map((p) => [p.id, p]));
    for (const id of slotIds) {
      if (!id) continue;
      const p = byId.get(id);
      if (p?.published && !seen.has(p.id)) {
        picked.push(p);
        seen.add(p.id);
      }
    }
  }

  if (picked.length >= 3) return picked.slice(0, 3);

  const need = 3 - picked.length;
  const fallback = await prisma.product.findMany({
    where: { published: true, id: { notIn: [...seen] } },
    orderBy: SIGNATURE_FALLBACK_ORDER,
    take: need,
  });

  return [...picked, ...fallback].slice(0, 3);
}
