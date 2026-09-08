import { prisma } from "@/lib/db";
import type { NovaAppStoreUrls } from "@/lib/nova-app-chooser-html";

export const NOVA_APP_QR_PATH = "/products/nova/app";

/** Normalize public site base URL (QR target). Fixes common typos like `wwww.` and http on production hosts. */
export function normalizePublicSiteUrl(raw: string | undefined): string {
  let base = (raw ?? "http://localhost:3000").trim().replace(/\/$/, "");
  if (!base) base = "http://localhost:3000";

  // Typo: four w's → www
  base = base.replace(/^(https?:\/\/)wwww\./i, "$1www.");

  const isLocal = /localhost|127\.0\.0\.1/i.test(base);
  if (!isLocal && base.startsWith("http://")) {
    base = `https://${base.slice("http://".length)}`;
  }

  return base;
}

export function getNovaAppPublicUrl(): string {
  const base = normalizePublicSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
  return `${base}${NOVA_APP_QR_PATH}`;
}

export function getPublicSiteUrlWarnings(raw: string | undefined): string[] {
  const warnings: string[] = [];
  const value = raw?.trim() ?? "";
  if (!value) {
    warnings.push("NEXT_PUBLIC_SITE_URL is not set — QR uses localhost (phones cannot open it).");
    return warnings;
  }
  if (/wwww\./i.test(value)) {
    warnings.push('Hostname contains "wwww" (four w’s). Use https://www.auroravehicles.com');
  }
  if (/^http:\/\//i.test(value) && !/localhost|127\.0\.0\.1/i.test(value)) {
    warnings.push("Production URL should use https://, not http://.");
  }
  if (/localhost|127\.0\.0\.1/i.test(value)) {
    warnings.push("localhost URLs only work on your computer — re-scan QR after deploying with the live domain.");
  }
  return warnings;
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
