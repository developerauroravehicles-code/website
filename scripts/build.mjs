#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const isPgUrl = (value) => /^postgres(ql)?:\/\//i.test((value ?? "").trim());
const isPlaceholder = (value) => {
  const raw = (value ?? "").trim().toLowerCase();
  if (!raw) return true;
  return raw.includes("user:pass@host") || raw.includes("://user:pass@");
};

const namedCandidates = [
  ["DATABASE_URL", process.env.DATABASE_URL?.trim()],
  ["POSTGRES_PRISMA_URL", process.env.POSTGRES_PRISMA_URL?.trim()],
  ["POSTGRES_URL", process.env.POSTGRES_URL?.trim()],
  ["DATABASE_URL_UNPOOLED", process.env.DATABASE_URL_UNPOOLED?.trim()],
  ["POSTGRES_URL_NON_POOLING", process.env.POSTGRES_URL_NON_POOLING?.trim()],
].filter(([, value]) => Boolean(value));

const selectedEntry = namedCandidates.find(([, value]) => isPgUrl(value) && !isPlaceholder(value));
const selected = selectedEntry?.[1];
const selectedName = selectedEntry?.[0];

if (!selected) {
  console.error(`
[build] No valid PostgreSQL URL found for Prisma.

Checked env vars:
  - DATABASE_URL
  - POSTGRES_PRISMA_URL
  - POSTGRES_URL
  - DATABASE_URL_UNPOOLED
  - POSTGRES_URL_NON_POOLING

At least one must start with:
  - postgresql://
  - postgres://

Avoid placeholder values like:
  postgresql://user:pass@host:5432/db?sslmode=require
`);
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: selected };
if (selectedName !== "DATABASE_URL") {
  console.log(`[build] Using ${selectedName} as DATABASE_URL for Prisma commands.`);
} else if (isPlaceholder(process.env.DATABASE_URL)) {
  console.log("[build] DATABASE_URL appears to be a placeholder; falling back to another Postgres variable.");
}

const npxCmd = process.platform === "win32" ? "npx.cmd" : "npx";

const run = (args) => {
  const result = spawnSync(npxCmd, args, {
    stdio: "inherit",
    env,
    shell: false,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
};

run(["prisma", "generate"]);
run(["prisma", "migrate", "deploy"]);
run(["next", "build"]);
