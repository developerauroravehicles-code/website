import { NextResponse } from "next/server";
import { renderNovaAppChooserHtml } from "@/lib/nova-app-chooser-html";
import { detectMobileStoreTarget, getNovaAppStoreUrls } from "@/lib/nova-app";

export const runtime = "nodejs";

const NO_INDEX = { "X-Robots-Tag": "noindex, nofollow" };

export async function GET(request: Request) {
  const urls = await getNovaAppStoreUrls();
  const target = detectMobileStoreTarget(request.headers.get("user-agent"));

  if (target === "play" && urls.play) {
    return NextResponse.redirect(urls.play, 302);
  }
  if (target === "appstore" && urls.appStore) {
    return NextResponse.redirect(urls.appStore, 302);
  }

  const html = renderNovaAppChooserHtml(urls);
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
      ...NO_INDEX,
    },
  });
}
