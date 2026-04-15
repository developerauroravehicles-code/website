"use client";

import { startTransition, useActionState, useState, type FormEvent } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "./actions";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

function waitForGrecaptcha(timeoutMs = 12_000): Promise<void> {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      if (typeof window !== "undefined" && window.grecaptcha?.ready) {
        window.grecaptcha.ready(() => resolve());
        return;
      }
      if (Date.now() - start > timeoutMs) {
        reject(new Error("reCAPTCHA script did not load."));
        return;
      }
      requestAnimationFrame(tick);
    };
    tick();
  });
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex h-11 w-full items-center justify-center rounded-lg bg-accent px-4 text-sm font-semibold text-background shadow-lg shadow-accent/25 transition hover:bg-accent-dim disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

const initialState: LoginState = {};

export function LoginForm() {
  const [state, formAction] = useActionState(loginAction, initialState);
  const [clientError, setClientError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setClientError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY?.trim();
    if (siteKey) {
      try {
        await waitForGrecaptcha();
        const token = await window.grecaptcha!.execute(siteKey, { action: "admin_login" });
        fd.set("recaptchaToken", token);
      } catch {
        setClientError("Could not load security check. Disable blockers and try again.");
        return;
      }
    }
    startTransition(() => {
      formAction(fd);
    });
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
      <SubmitButton />
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
