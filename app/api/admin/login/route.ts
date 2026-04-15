import { NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/auth-server";
import { verifyAdminLoginRecaptcha } from "@/lib/recaptcha-verify";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const recaptcha = await verifyAdminLoginRecaptcha(String(formData.get("recaptchaToken") ?? ""));
  if (!recaptcha.ok) {
    return NextResponse.json({ error: recaptcha.error }, { status: 400 });
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await loginWithPassword(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true as const }, { status: 200 });
}
