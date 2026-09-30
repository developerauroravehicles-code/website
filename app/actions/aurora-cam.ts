"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/auth-server";
import { isValidStoreUrl } from "@/lib/nova-app";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function pick(fd: FormData, key: string): string {
  return String(fd.get(key) ?? "").trim();
}

export async function updateAuroraCamStoreUrlsAction(formData: FormData) {
  await requireAdmin();

  const playRaw = pick(formData, "auroraCamPlayStoreUrl");
  const appStoreRaw = pick(formData, "auroraCamAppStoreUrl");

  const play = playRaw || null;
  const appStore = appStoreRaw || null;

  if (play && !isValidStoreUrl(play)) {
    redirect("/admin/auroracam?error=play");
  }
  if (appStore && !isValidStoreUrl(appStore)) {
    redirect("/admin/auroracam?error=appstore");
  }

  try {
    await prisma.$executeRaw`
      INSERT INTO "SiteSetting" (
        "id",
        "homeStat1Label", "homeStat1Sub", "homeStat2Label", "homeStat2Sub", "homeStat3Label", "homeStat3Sub",
        "auroraCamPlayStoreUrl", "auroraCamAppStoreUrl",
        "updatedAt"
      )
      VALUES (
        1,
        'UHD', '4K pipeline', 'f/1.8', 'Low-light glass', '140°', 'Wide FOV',
        ${play}, ${appStore},
        CURRENT_TIMESTAMP
      )
      ON CONFLICT ("id") DO UPDATE SET
        "auroraCamPlayStoreUrl" = EXCLUDED."auroraCamPlayStoreUrl",
        "auroraCamAppStoreUrl" = EXCLUDED."auroraCamAppStoreUrl",
        "updatedAt" = EXCLUDED."updatedAt"
    `;
  } catch {
    redirect("/admin/auroracam?error=db");
  }

  revalidatePath("/auroracam");
  redirect("/admin/auroracam?saved=1");
}
