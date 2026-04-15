type SiteVerifyJson = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/**
 * Verifies a reCAPTCHA token (v3 recommended; v2 keys return success without score).
 * If RECAPTCHA_SECRET_KEY is unset: production → fail; development → allow (local dev without keys).
 */
export async function verifyAdminLoginRecaptcha(token: string | null | undefined): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "reCAPTCHA is not configured on the server." };
    }
    return { ok: true };
  }

  const t = typeof token === "string" ? token.trim() : "";
  if (!t) {
    return { ok: false, error: "Security verification failed. Please refresh and try again." };
  }

  const body = new URLSearchParams({ secret, response: t });
  let data: SiteVerifyJson;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    data = (await res.json()) as SiteVerifyJson;
  } catch {
    return { ok: false, error: "Could not verify reCAPTCHA. Try again." };
  }

  if (!data.success) {
    return { ok: false, error: "Security verification failed. Please try again." };
  }

  const minScore = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  if (typeof data.score === "number" && Number.isFinite(minScore) && data.score < minScore) {
    return { ok: false, error: "Security check failed. Please try again." };
  }

  if (data.action && data.action !== "admin_login") {
    return { ok: false, error: "Invalid security verification." };
  }

  return { ok: true };
}
