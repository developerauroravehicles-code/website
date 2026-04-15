import { NextResponse } from "next/server";
import { verifyLoginBotGuard } from "@/lib/admin-login-bot-guard";
import { loginWithPassword } from "@/lib/auth-server";

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const bot = verifyLoginBotGuard(formData);
  if (!bot.ok) {
    return NextResponse.json({ error: bot.error }, { status: 400 });
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await loginWithPassword(email, password);
  if (!result.ok) {
    return NextResponse.json({ error: result.message }, { status: 401 });
  }

  return NextResponse.json({ ok: true as const }, { status: 200 });
}
