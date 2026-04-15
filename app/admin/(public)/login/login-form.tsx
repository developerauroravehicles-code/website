"use client";

import { useEffect, useState, type FormEvent } from "react";
import { RECAPTCHA_LOGIN_ACTION } from "@/lib/recaptcha-verify";
import { type LoginState } from "./actions";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      enterprise?: {
        ready: (cb: () => void) => void;
        execute: (siteKey: string, options: { action: string }) => Promise<string>;
      };
    };
  }
}

const RECAPTCHA_ONLOAD = "__auroraAdminRecaptchaApiLoad";

function recaptchaEnterpriseEnabled(): boolean {
  return process.env.NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE === "true";
}

function recaptchaScriptBasename(): string {
  return recaptchaEnterpriseEnabled() ? "recaptcha/enterprise.js" : "recaptcha/api.js";
}

function findRecaptchaScriptForKey(siteKey: string) {
  const base = recaptchaScriptBasename();
  return Array.from(document.scripts).find(
    (s) => s.src.includes(base) && (s.src.includes(siteKey) || s.src.includes(encodeURIComponent(siteKey))),
  );
}

/**
 * Loads Enterprise or standard web API and waits until ready-callback chain can run.
 */
function loadRecaptchaApi(siteKey: string, timeoutMs = 35_000): Promise<void> {
  const enterprise = recaptchaEnterpriseEnabled();
  return new Promise((resolve, reject) => {
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (timer !== undefined) clearTimeout(timer);
      delete (window as unknown as Record<string, unknown>)[RECAPTCHA_ONLOAD];
    };

    const fail = (msg: string) => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(msg));
    };

    const succeed = () => {
      if (settled) return;
      if (enterprise) {
        const ge = window.grecaptcha?.enterprise;
        if (typeof ge?.ready !== "function") {
          fail(
            "reCAPTCHA Enterprise did not load. Set NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE=true and use a reCAPTCHA Enterprise site key.",
          );
          return;
        }
        ge.ready(() => {
          if (settled) return;
          settled = true;
          cleanup();
          resolve();
        });
        return;
      }
      const g = window.grecaptcha;
      if (typeof g?.ready !== "function") {
        fail(
          "reCAPTCHA API did not initialize. For Enterprise keys set NEXT_PUBLIC_RECAPTCHA_USE_ENTERPRISE=true; otherwise use a classic v3 key.",
        );
        return;
      }
      g.ready(() => {
        if (settled) return;
        settled = true;
        cleanup();
        resolve();
      });
    };

    timer = setTimeout(() => {
      fail(
        enterprise
          ? "reCAPTCHA Enterprise did not load in time. Check domains in the Enterprise console (auroravehicles.com / www), GCP API key, and that google.com scripts are not blocked."
          : "reCAPTCHA did not load in time. Confirm you created a v3 key, added your domain under Domains, and that scripts from google.com are not blocked.",
      );
    }, timeoutMs);

    if (enterprise) {
      if (typeof window.grecaptcha?.enterprise?.ready === "function") {
        succeed();
        return;
      }
    } else if (typeof window.grecaptcha?.ready === "function") {
      succeed();
      return;
    }

    const existing = findRecaptchaScriptForKey(siteKey);
    if (existing) {
      if (enterprise ? window.grecaptcha?.enterprise?.ready : window.grecaptcha?.ready) {
        succeed();
        return;
      }
      const onLoad = () => succeed();
      const onErr = () =>
        fail("reCAPTCHA script failed. Check the site key and network; try disabling extensions that block Google scripts.");
      existing.addEventListener("load", onLoad, { once: true });
      existing.addEventListener("error", onErr, { once: true });
      return;
    }

    (window as unknown as Record<string, unknown>)[RECAPTCHA_ONLOAD] = () => {
      succeed();
    };

    const path = recaptchaScriptBasename();
    const inject = (host: "www.google.com" | "www.recaptcha.net") => {
      const s = document.createElement("script");
      s.src = `https://${host}/${path}?render=${siteKey}&onload=${RECAPTCHA_ONLOAD}`;
      s.async = true;
      s.defer = true;
      s.onerror = () => {
        if (host === "www.google.com") {
          s.remove();
          inject("www.recaptcha.net");
          return;
        }
        fail("reCAPTCHA could not be loaded from Google. Check firewall / ad blockers.");
      };
      document.head.appendChild(s);
    };

    inject("www.google.com");
  });
}

async function getRecaptchaToken(siteKey: string): Promise<string> {
  await loadRecaptchaApi(siteKey);
  if (recaptchaEnterpriseEnabled()) {
    return window.grecaptcha!.enterprise!.execute(siteKey, { action: RECAPTCHA_LOGIN_ACTION });
  }
  return window.grecaptcha!.execute(siteKey, { action: RECAPTCHA_LOGIN_ACTION });
}

export function LoginForm() {
  const [state, setState] = useState<LoginState>({});
  const [clientError, setClientError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
    if (!siteKey) return;
    loadRecaptchaApi(siteKey).catch(() => {
      /* warm-up; errors shown on submit */
    });
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setClientError(null);
    setState({});
    const form = e.currentTarget;
    const fd = new FormData(form);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
    if (siteKey) {
      try {
        const token = await getRecaptchaToken(siteKey);
        fd.set("recaptchaToken", token);
      } catch (err) {
        setClientError(err instanceof Error ? err.message : "Security check failed. Try again.");
        return;
      }
    }

    setPending(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        body: fd,
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string; ok?: boolean };
      if (!res.ok) {
        setState({ error: data.error ?? "Sign in failed." });
        return;
      }
      window.location.assign("/admin");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur">
      {state.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      {clientError ? (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">{clientError}</p>
      ) : null}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none ring-accent/40 placeholder:text-zinc-600 focus:border-accent focus:ring-2"
          placeholder="your admin email"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="password" className="text-xs font-medium uppercase tracking-wide text-zinc-400">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none ring-accent/40 focus:border-accent focus:ring-2"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="flex h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-background shadow-lg shadow-accent/25 transition hover:bg-accent-dim disabled:opacity-60"
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
      {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim() ? (
        <p className="text-center text-[10px] leading-relaxed text-zinc-600">
          Protected by reCAPTCHA.{" "}
          <a href="https://policies.google.com/privacy" className="text-zinc-500 underline hover:text-zinc-400">
            Privacy
          </a>
          {" · "}
          <a href="https://policies.google.com/terms" className="text-zinc-500 underline hover:text-zinc-400">
            Terms
          </a>
        </p>
      ) : null}
    </form>
  );
}
