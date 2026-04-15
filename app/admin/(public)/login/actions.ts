"use server";

import { redirect } from "next/navigation";
import { loginWithPassword } from "@/lib/auth-server";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const result = await loginWithPassword(email, password);
  if (!result.ok) {
    return { error: result.message };
  }
  redirect("/admin");
}
