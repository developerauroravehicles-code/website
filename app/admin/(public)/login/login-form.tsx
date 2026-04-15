"use client";

import { useState, type FormEvent } from "react";
import { type LoginState } from "./actions";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function recaptchaScriptSrc(siteKey: string) {
  return `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
}

/** Ensures api.js is on the page and grecaptcha.ready has fired. */
function ensureRecaptchaReady(siteKey: string, timeoutMs = 28_000): Promise<void> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const ok = () => {
      if (settled) return;
      settled = true;
      resolve();
    };
    const fail = (msg: string) => {
      if (settled) return;
      settled = true;
      reject(new Error(msg));
    };

    const runReady = () => {
      const g = window.grecaptcha;
      if (typeof g?.ready !== "function") return false;
      g.ready(() => ok());
      return true;
    };

    if (runReady()) return;

    const src = recaptchaScriptSrc(siteKey);
    const el = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);

    const deadline = Date.now() + timeoutMs;
    const poll = () => {
      if (settled) return;
      if (runReady()) return;
      if (Date.now() > deadline) {
        fail(
          "reCAPTCHA did not load. Allow scripts from google.com, disable blockers for this site, and add your domain (including www) in the Google reCAPTCHA admin console.",
        );
        return;
      }
      window.setTimeout(poll, 80);
    };

    if (el) {
      el.addEventListener("load", poll);
      el.addEventListener("error", () => fail("reCAPTCHA script was blocked or failed to load."));
      poll();
      return;
    }

    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.defer = true;
    s.addEventListener("load", poll);
    s.addEventListener("error", () => fail("reCAPTCHA script was blocked or failed to load."));
    document.head.appendChild(s);
    poll();
  });
}

async function getRecaptchaToken(siteKey: string): Promise<string> {
  await ensureRecaptchaReady(siteKey);
  return window.grecaptcha!.execute(siteKey, { action: "admin_login" });
}

export function LoginForm() {
  const [state, setState] = useState<LoginState>({});
  const [clientError, setClientError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
