import { prisma } from "@/lib/db";

/** Public HTML policy (Google Play / App Store). */
export const AURORACAM_PRIVACY_PAGE_PATH = "/privacy";

/** Archived copy in repo; not linked from the public site. */
export const AURORACAM_PRIVACY_PDF_PATH = "/auroracam/aurora-dashcam-privacy-policy.pdf";

export type AuroraCamStoreUrls = {
  play: string;
  appStore: string;
};

type AuroraCamUrlRow = {
  auroraCamPlayStoreUrl: string;
  auroraCamAppStoreUrl: string;
};

export async function getAuroraCamStoreUrls(): Promise<AuroraCamStoreUrls> {
  try {
    const rows = await prisma.$queryRaw<AuroraCamUrlRow[]>`
      SELECT "auroraCamPlayStoreUrl", "auroraCamAppStoreUrl"
      FROM "SiteSetting"
      WHERE "id" = 1
      LIMIT 1
    `;
    const row = rows[0];
    return {
      play: row?.auroraCamPlayStoreUrl?.trim() ?? "",
      appStore: row?.auroraCamAppStoreUrl?.trim() ?? "",
    };
  } catch {
    try {
      const row = await prisma.siteSetting.findUnique({
        where: { id: 1 },
        select: { auroraCamPlayStoreUrl: true, auroraCamAppStoreUrl: true },
      });
      return {
        play: row?.auroraCamPlayStoreUrl?.trim() ?? "",
        appStore: row?.auroraCamAppStoreUrl?.trim() ?? "",
      };
    } catch {
      return { play: "", appStore: "" };
    }
  }
}
