const WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILURES = 5;

type Entry = { failures: number; resetAt: number };

/** Per-instance only: Vercel may run several instances, so pair this with a Vercel Firewall rate-limit rule. */
const store = new Map<string, Entry>();

function current(key: string, now: number): Entry | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (entry.resetAt <= now) {
    store.delete(key);
    return null;
  }
  return entry;
}

export function loginRateLimitKeys(ip: string, email: string): string[] {
  return [`ip:${ip}`, `email:${email.trim().toLowerCase()}`];
}

export function getRetryAfterSeconds(keys: string[]): number {
  const now = Date.now();
  let retryAt = 0;
  for (const key of keys) {
    const entry = current(key, now);
    if (entry && entry.failures >= MAX_FAILURES) {
      retryAt = Math.max(retryAt, entry.resetAt);
    }
  }
  return retryAt ? Math.ceil((retryAt - now) / 1000) : 0;
}

export function recordLoginFailure(keys: string[]): void {
  const now = Date.now();
  for (const key of keys) {
    const entry = current(key, now);
    if (entry) {
      entry.failures += 1;
    } else {
      store.set(key, { failures: 1, resetAt: now + WINDOW_MS });
    }
  }
  if (store.size > 5000) {
    for (const [key, entry] of store) {
      if (entry.resetAt <= now) store.delete(key);
    }
  }
}

export function clearLoginFailures(keys: string[]): void {
  for (const key of keys) store.delete(key);
}
