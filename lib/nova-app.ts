import { prisma } from "@/lib/db";
import type { NovaAppStoreUrls } from "@/lib/nova-app-chooser-html";

export const NOVA_APP_QR_PATH = "/products/nova/app";

export function getNovaAppPublicUrl(): string {
  const base = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  return `${base}${NOVA_APP_QR_PATH}`;
}

type NovaUrlRow = {
  novaAppPlayStoreUrl: string;
  novaAppAppStoreUrl: string;
};

/** Reads store URLs from SiteSetting id=1 (raw SQL fallback for stale Prisma client bundles). */
export async function getNovaAppStoreUrls(): Promise<NovaAppStoreUrls> {
  try {
    const rows = await prisma.$queryRaw<NovaUrlRow[]>`
      SELECT "novaAppPlayStoreUrl", "novaAppAppStoreUrl"
      FROM "SiteSetting"
      WHERE "id" = 1
      LIMIT 1
    `;
    const row = rows[0];
    return {
      play: row?.novaAppPlayStoreUrl?.trim() ?? "",
      appStore: row?.novaAppAppStoreUrl?.trim() ?? "",
    };
  } catch {
    try {
      const row = await prisma.siteSetting.findUnique({
        where: { id: 1 },
        select: { novaAppPlayStoreUrl: true, novaAppAppStoreUrl: true },
      });
      return {
        play: row?.novaAppPlayStoreUrl?.trim() ?? "",
        appStore: row?.novaAppAppStoreUrl?.trim() ?? "",
      };
    } catch {
      return { play: "", appStore: "" };
    }
  }
}

export type MobileStoreTarget = "play" | "appstore" | "chooser";

export function detectMobileStoreTarget(userAgent: string | null): MobileStoreTarget {
  const ua = userAgent ?? "";
  const isIOS =
    /iPhone|iPad|iPod/i.test(ua) || (/\bMacintosh\b/i.test(ua) && /\bMobile\b/i.test(ua));
  if (isIOS) return "appstore";
  if (/Android/i.test(ua)) return "play";
  return "chooser";
}

export function isValidStoreUrl(value: string): boolean {
  try {
    const u = new URL(value);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}
