type SiteVerifyJson = {
  success: boolean;
  score?: number;
  action?: string;
  "error-codes"?: string[];
};

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/** Must match `action` in `grecaptcha.enterprise.execute` / `grecaptcha.execute` on the client. */
export const RECAPTCHA_LOGIN_ACTION = "LOGIN" as const;

type EnterpriseAssessmentJson = {
  tokenProperties?: { valid?: boolean; action?: string };
  riskAnalysis?: { score?: number };
  error?: { code?: number; message?: string; status?: string };
};

function enterpriseConfigured(): boolean {
  return Boolean(
    process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID?.trim() && process.env.RECAPTCHA_ENTERPRISE_API_KEY?.trim(),
  );
}

function siteKeyForVerify(): string | undefined {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
}

async function verifyEnterpriseAssessment(
  token: string,
  request: Request,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const projectId = process.env.RECAPTCHA_ENTERPRISE_PROJECT_ID!.trim();
  const apiKey = process.env.RECAPTCHA_ENTERPRISE_API_KEY!.trim();
  const siteKey = siteKeyForVerify();
  if (!siteKey) {
    return { ok: false, error: "reCAPTCHA site key is not configured." };
  }

  const url = `https://recaptchaenterprise.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/assessments?key=${encodeURIComponent(apiKey)}`;
  const forwarded = request.headers.get("x-forwarded-for");
  const userIp = forwarded?.split(",")[0]?.trim() || undefined;
  const userAgent = request.headers.get("user-agent") || undefined;

  let data: EnterpriseAssessmentJson;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: {
          token,
          siteKey,
          expectedAction: RECAPTCHA_LOGIN_ACTION,
          ...(userIp ? { userIpAddress: userIp } : {}),
          ...(userAgent ? { userAgent } : {}),
        },
      }),
      cache: "no-store",
    });
    data = (await res.json()) as EnterpriseAssessmentJson;
    if (!res.ok) {
      return { ok: false, error: "Could not verify reCAPTCHA. Try again." };
    }
  } catch {
    return { ok: false, error: "Could not verify reCAPTCHA. Try again." };
  }

  if (data.tokenProperties?.valid !== true) {
    return { ok: false, error: "Security verification failed. Please try again." };
  }

  const action = data.tokenProperties?.action;
  if (action && action !== RECAPTCHA_LOGIN_ACTION) {
    return { ok: false, error: "Invalid security verification." };
  }

  const minScore = Number.parseFloat(process.env.RECAPTCHA_MIN_SCORE ?? "0.5");
  const score = data.riskAnalysis?.score;
  if (typeof score === "number" && Number.isFinite(minScore) && score < minScore) {
    return { ok: false, error: "Security check failed. Please try again." };
  }

  return { ok: true };
}

/**
 * Verifies admin login reCAPTCHA:
 * - **Enterprise:** `RECAPTCHA_ENTERPRISE_PROJECT_ID` + `RECAPTCHA_ENTERPRISE_API_KEY` (Google Cloud Assessments API).
 * - **Classic v3:** `RECAPTCHA_SECRET_KEY` + POST to siteverify.
 *
 * If neither path is configured: production → fail; development → allow (local dev without keys).
 */
export async function verifyAdminLoginRecaptcha(
  token: string | null | undefined,
  request: Request,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const t = typeof token === "string" ? token.trim() : "";
  if (!t) {
    return { ok: false, error: "Security verification failed. Please refresh and try again." };
  }

  if (enterpriseConfigured()) {
    return verifyEnterpriseAssessment(t, request);
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "reCAPTCHA is not configured on the server." };
    }
    return { ok: true };
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

  if (data.action && data.action !== RECAPTCHA_LOGIN_ACTION) {
    return { ok: false, error: "Invalid security verification." };
  }

  return { ok: true };
}
