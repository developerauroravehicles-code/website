"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function pick(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export async function updateHomeHeroStatsAction(formData: FormData) {
  await requireAdmin();

  const homeStat1Label = pick(formData, "homeStat1Label");
  const homeStat1Sub = pick(formData, "homeStat1Sub");
  const homeStat2Label = pick(formData, "homeStat2Label");
  const homeStat2Sub = pick(formData, "homeStat2Sub");
  const homeStat3Label = pick(formData, "homeStat3Label");
  const homeStat3Sub = pick(formData, "homeStat3Sub");

  if (!homeStat1Label || !homeStat1Sub || !homeStat2Label || !homeStat2Sub || !homeStat3Label || !homeStat3Sub) {
    redirect("/admin/home-hero?error=missing");
  }

  await prisma.siteSetting.upsert({
    where: { id: 1 },
    create: {
      id: 1,
      homeStat1Label,
      homeStat1Sub,
      homeStat2Label,
      homeStat2Sub,
      homeStat3Label,
      homeStat3Sub,
    },
    update: {
      homeStat1Label,
      homeStat1Sub,
      homeStat2Label,
      homeStat2Sub,
      homeStat3Label,
      homeStat3Sub,
    },
  });

  revalidatePath("/");
  redirect("/admin/home-hero?saved=1");
}

export async function updateSignatureProductsAction(formData: FormData) {
  await requireAdmin();

  const id1 = pick(formData, "signatureProduct1Id");
  const id2 = pick(formData, "signatureProduct2Id");
  const id3 = pick(formData, "signatureProduct3Id");
  const slots = [id1, id2, id3];

  for (const id of slots) {
    if (!id) continue;
    const product = await prisma.product.findUnique({ where: { id }, select: { published: true } });
    if (!product?.published) {
      redirect("/admin/home-hero?sigError=invalid");
    }
  }

  const s1 = id1 || null;
  const s2 = id2 || null;
  const s3 = id3 || null;

  // Raw upsert avoids PrismaClientValidationError when the dev bundle uses a stale generated client
  // (same class of issue as home hero + Turbopack). DB columns come from `prisma db push` / migrate.
  try {
    await prisma.$executeRaw`
      INSERT INTO "SiteSetting" (
        "id",
        "homeStat1Label", "homeStat1Sub", "homeStat2Label", "homeStat2Sub", "homeStat3Label", "homeStat3Sub",
        "signatureProduct1Id", "signatureProduct2Id", "signatureProduct3Id",
        "updatedAt"
      )
      VALUES (
        1,
        'UHD', '4K pipeline', 'f/1.8', 'Low-light glass', '140°', 'Wide FOV',
        ${s1}, ${s2}, ${s3},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT ("id") DO UPDATE SET
        "signatureProduct1Id" = EXCLUDED."signatureProduct1Id",
        "signatureProduct2Id" = EXCLUDED."signatureProduct2Id",
        "signatureProduct3Id" = EXCLUDED."signatureProduct3Id",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  } catch {
    redirect("/admin/home-hero?sigError=db");
  }

  revalidatePath("/");
  redirect("/admin/home-hero?sig=1");
}
