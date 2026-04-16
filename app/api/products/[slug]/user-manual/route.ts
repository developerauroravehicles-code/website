import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

/** Stored value may be full https URL (Blob) or a site-relative path from local uploads. */
function toAbsoluteManualUrl(stored: string, request: Request): string {
  const t = stored.trim();
  if (/^https?:\/\//i.test(t)) return t;
  const origin = new URL(request.url).origin;
  const path = t.startsWith("/") ? t : `/${t}`;
  return new URL(path, origin).toString();
}

const UPSTREAM_FETCH: RequestInit = {
  cache: "no-store",
  headers: {
    // Some CDNs / Blob edges reject bare server fetches without a UA
    Accept: "application/pdf,application/octet-stream,*/*",
    "User-Agent": "AuroraVehicles-manual-proxy/1.0",
  },
  signal: AbortSignal.timeout(60_000),
};

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    select: { userManualUrl: true },
  });
  const stored = product?.userManualUrl?.trim();
  if (!product || !stored) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const absoluteUrl = toAbsoluteManualUrl(stored, request);

  let upstream: Response;
  try {
    upstream = await fetch(absoluteUrl, UPSTREAM_FETCH);
  } catch (e) {
    console.error("[user-manual] fetch failed:", absoluteUrl, e);
    return NextResponse.redirect(absoluteUrl, 307);
  }

  if (!upstream.ok) {
    console.error("[user-manual] upstream status:", upstream.status, absoluteUrl);
    return NextResponse.redirect(absoluteUrl, 307);
  }

  const ctype = upstream.headers.get("content-type") || "";
  if (!ctype.includes("pdf") && !ctype.includes("octet-stream")) {
    console.warn("[user-manual] unexpected content-type:", ctype, absoluteUrl);
  }

  const fname = `${slug}-user-manual.pdf`;
  const asciiName = fname.replace(/[^\x20-\x7E]/g, "_");

  const headers = new Headers({
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fname)}`,
    "Cache-Control": "private, max-age=3600",
  });

  if (upstream.body) {
    return new NextResponse(upstream.body, { status: 200, headers });
  }

  const buf = await upstream.arrayBuffer();
  return new NextResponse(buf, { status: 200, headers });
}
