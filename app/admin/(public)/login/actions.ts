"use server";

import { redirect } from "next/navigation";
import { loginWithPassword } from "@/lib/auth-server";
import { verifyAdminLoginRecaptcha } from "@/lib/recaptcha-verify";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const recaptcha = await verifyAdminLoginRecaptcha(String(formData.get("recaptchaToken") ?? ""));
  if (!recaptcha.ok) {
    return { error: recaptcha.error };
  }

  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await loginWithPassword(email, password);
  if (!result.ok) {
    return { error: result.message };
  }
  redirect("/admin");
}
