import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findFirst({
    where: { slug, published: true },
    select: { userManualUrl: true },
  });
  const url = product?.userManualUrl?.trim();
  if (!product || !url) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let upstream: Response;
  try {
    upstream = await fetch(url, { cache: "no-store" });
  } catch {
    return NextResponse.json({ error: "Manual unavailable" }, { status: 502 });
  }

  if (!upstream.ok) {
    return NextResponse.json({ error: "Manual unavailable" }, { status: 502 });
  }

  const ctype = upstream.headers.get("content-type") || "";
  if (!ctype.includes("pdf") && !ctype.includes("octet-stream")) {
    console.warn("[user-manual] unexpected content-type:", ctype);
  }

  const buf = await upstream.arrayBuffer();
  const fname = `${slug}-user-manual.pdf`;
  const asciiName = fname.replace(/[^\x20-\x7E]/g, "_");

  return new NextResponse(buf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(fname)}`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
