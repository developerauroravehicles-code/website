"use client";

import { useState, type FormEvent } from "react";
import { type LoginState } from "./actions";

type LoginBotChallengeProps = {
  a: number;
  b: number;
  ts: number;
  mac: string;
};

type Props = {
  challenge: LoginBotChallengeProps | null;
};

export function LoginForm({ challenge }: Props) {
  const [state, setState] = useState<LoginState>({});
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState({});
    const form = e.currentTarget;
    const fd = new FormData(form);

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

  if (!challenge) {
    return (
      <div className="rounded-2xl border border-red-500/30 bg-red-950/30 p-6 text-center text-sm text-red-200">
        Admin sign-in is not available: set a strong <code className="text-red-100">AUTH_SECRET</code> (32+
        characters) in the environment and reload.
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-xl backdrop-blur"
    >
      {state.error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      {/* Honeypot: leave empty; bots often fill visible-off fields */}
      <div className="pointer-events-none absolute -left-[9999px] top-0 opacity-0" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <input type="hidden" name="bot_a" value={challenge.a} />
      <input type="hidden" name="bot_b" value={challenge.b} />
      <input type="hidden" name="bot_ts" value={challenge.ts} />
      <input type="hidden" name="bot_mac" value={challenge.mac} />

      <div className="space-y-1.5 rounded-lg border border-zinc-700/80 bg-zinc-950/60 px-3 py-3">
        <label htmlFor="bot_answer" className="text-xs font-medium text-zinc-400">
          Verification: what is {challenge.a} + {challenge.b}?
        </label>
        <input
          id="bot_answer"
          name="bot_answer"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          required
          autoComplete="off"
          className="h-10 w-full rounded-md border border-zinc-600 bg-zinc-900 px-3 text-sm outline-none ring-accent/30 focus:border-accent focus:ring-2"
          placeholder="Answer"
        />
      </div>

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
      <p className="text-center text-[10px] leading-relaxed text-zinc-600">
        Simple bot checks only — use a strong password and HTTPS in production.
      </p>
    </form>
  );
}
