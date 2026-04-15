import { prisma } from "@/lib/db";

type HomeHeroRow = { homeHeroProductId: string | null };

export async function getHomeHeroProductId(): Promise<string | null> {
  try {
    const rows = await prisma.$queryRaw<HomeHeroRow[]>`
      SELECT "homeHeroProductId"
      FROM "SiteSetting"
      WHERE "id" = 1
      LIMIT 1
    `;
    return rows[0]?.homeHeroProductId ?? null;
  } catch {
    return null;
  }
}

export async function setHomeHeroProductId(productId: string): Promise<void> {
  await prisma.$executeRaw`
    INSERT INTO "SiteSetting" ("id", "homeHeroProductId", "updatedAt")
    VALUES (1, ${productId}, CURRENT_TIMESTAMP)
    ON CONFLICT ("id")
    DO UPDATE SET
      "homeHeroProductId" = EXCLUDED."homeHeroProductId",
      "updatedAt" = EXCLUDED."updatedAt"
  `;
}
