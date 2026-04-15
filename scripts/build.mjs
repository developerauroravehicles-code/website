#!/usr/bin/env node
import { spawnSync } from "node:child_process";

const isPgUrl = (value) => /^postgres(ql)?:\/\//i.test((value ?? "").trim());

const candidates = [
  process.env.DATABASE_URL?.trim(),
  process.env.POSTGRES_PRISMA_URL?.trim(),
  process.env.POSTGRES_URL?.trim(),
  process.env.DATABASE_URL_UNPOOLED?.trim(),
  process.env.POSTGRES_URL_NON_POOLING?.trim(),
].filter(Boolean);

const selected = candidates.find((value) => isPgUrl(value));

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
`);
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: selected };
if (!process.env.DATABASE_URL || !isPgUrl(process.env.DATABASE_URL)) {
  console.log("[build] DATABASE_URL was invalid/missing; using fallback from Vercel Postgres variables.");
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
