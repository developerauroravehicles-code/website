import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

const PREFIX = "aurora-admin-login";
const CHALLENGE_TTL_MS = 15 * 60 * 1000;

export type LoginBotChallenge = {
  a: number;
  b: number;
  ts: number;
  mac: string;
};

function signChallenge(secret: string, a: number, b: number, ts: number): string {
  return createHmac("sha256", secret).update(`${PREFIX}:${a}:${b}:${ts}`).digest("base64url");
}

function safeEqualMac(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a, "base64url");
    const bb = Buffer.from(b, "base64url");
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}

/** Call from the admin login Server Component (use `dynamic = "force-dynamic"` on that route). */
export function createLoginBotChallenge(): LoginBotChallenge {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be set (min 32 chars) for admin login.");
  }
  const a = randomInt(2, 21);
  const b = randomInt(2, 21);
  const ts = Date.now();
  const mac = signChallenge(secret, a, b, ts);
  return { a, b, ts, mac };
}

/**
 * Honeypot + signed math challenge. Tuned for casual bots; not a substitute for WAF / rate limits.
 */
export function verifyLoginBotGuard(formData: FormData): { ok: true } | { ok: false; error: string } {
  const honeypot = String(formData.get("website") ?? "").trim();
  if (honeypot !== "") {
    return { ok: false, error: "Could not sign in." };
  }

  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "Server configuration error." };
    }
    return { ok: true };
  }

  const a = Number.parseInt(String(formData.get("bot_a") ?? ""), 10);
  const b = Number.parseInt(String(formData.get("bot_b") ?? ""), 10);
  const ts = Number.parseInt(String(formData.get("bot_ts") ?? ""), 10);
  const mac = String(formData.get("bot_mac") ?? "").trim();
  const answerRaw = String(formData.get("bot_answer") ?? "").trim();
  const answer = Number.parseInt(answerRaw, 10);

  if (!Number.isFinite(a) || !Number.isFinite(b) || !Number.isFinite(ts) || !mac) {
    return { ok: false, error: "Complete the verification question below." };
  }

  const now = Date.now();
  if (now - ts > CHALLENGE_TTL_MS) {
    return { ok: false, error: "Verification expired. Refresh the page and try again." };
  }
  if (ts > now + 60_000) {
    return { ok: false, error: "Invalid verification. Refresh the page." };
  }

  if (!safeEqualMac(mac, signChallenge(secret, a, b, ts))) {
    return { ok: false, error: "Invalid verification. Refresh the page." };
  }

  if (!Number.isFinite(answer) || answer !== a + b) {
    return { ok: false, error: "Incorrect answer to the verification question." };
  }

  return { ok: true };
}
