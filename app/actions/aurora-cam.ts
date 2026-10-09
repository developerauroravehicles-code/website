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

  const play = playRaw;
  const appStore = appStoreRaw;

  if (play && !isValidStoreUrl(play)) {
    redirect("/admin/auroracam?error=play");
  }
  if (appStore && !isValidStoreUrl(appStore)) {
    redirect("/admin/auroracam?error=appstore");
  }

  try {
    const updated = await prisma.$executeRaw`
      UPDATE "SiteSetting"
      SET
        "auroraCamPlayStoreUrl" = ${play},
        "auroraCamAppStoreUrl" = ${appStore},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE "id" = 1
    `;
    if (updated === 0) {
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
      `;
    }
  } catch {
    redirect("/admin/auroracam?error=db");
  }

  revalidatePath("/auroracam", "page");
  revalidatePath("/auroracam", "layout");
  redirect("/admin/auroracam?saved=1");
}
