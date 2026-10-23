import { NextResponse } from "next/server";
import { verifyLoginBotGuard } from "@/lib/admin-login-bot-guard";
import { loginWithPassword } from "@/lib/auth-server";
import {
  clearLoginFailures,
  getRetryAfterSeconds,
  loginRateLimitKeys,
  recordLoginFailure,
} from "@/lib/login-rate-limit";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const keys = loginRateLimitKeys(clientIp(request), email);

  const retryAfter = getRetryAfterSeconds(keys);
  if (retryAfter > 0) {
    return NextResponse.json(
      { error: `Too many failed attempts. Try again in ${Math.ceil(retryAfter / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  const bot = verifyLoginBotGuard(formData);
  if (!bot.ok) {
    return NextResponse.json({ error: bot.error }, { status: 400 });
  }

  const result = await loginWithPassword(email, password);
  if (!result.ok) {
    recordLoginFailure(keys);
    return NextResponse.json({ error: result.message }, { status: 401 });
  }

  clearLoginFailures(keys);
  return NextResponse.json({ ok: true as const }, { status: 200 });
}
