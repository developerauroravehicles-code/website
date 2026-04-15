import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { getSessionCookieName, signSessionToken, verifySessionToken, type SessionPayload } from "@/lib/jwt";

const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function getSession(): Promise<SessionPayload | null> {
  const jar = await cookies();
  const token = jar.get(getSessionCookieName())?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function loginWithPassword(
  email: string,
  password: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return { ok: false, message: "Invalid email or password." };
  }
  const token = await signSessionToken(
    { sub: user.id, email: user.email, role: user.role },
    MAX_AGE,
  );
  const jar = await cookies();
  jar.set(getSessionCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
  return { ok: true };
}

export async function logoutSession(): Promise<void> {
  const jar = await cookies();
  jar.set(getSessionCookieName(), "", { httpOnly: true, path: "/", maxAge: 0 });
}
