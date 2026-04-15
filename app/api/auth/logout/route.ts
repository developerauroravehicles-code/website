import { NextResponse } from "next/server";
import { logoutSession } from "@/lib/auth-server";

export async function POST(request: Request) {
  await logoutSession();
  return NextResponse.redirect(new URL("/admin/login", request.url));
}
