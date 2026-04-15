#!/usr/bin/env node
/**
 * Fail fast with a clear message when DATABASE_URL is missing (common Vercel misconfiguration).
 * Prisma would otherwise error with P1012 during migrate deploy.
 */
const url = process.env.DATABASE_URL?.trim();
if (!url) {
  console.error(`
[build] DATABASE_URL is not set.

On Vercel:
  1. Open your project → Settings → Environment Variables
  2. Add DATABASE_URL with your PostgreSQL connection string (Neon, Supabase, Vercel Postgres, etc.)
  3. Enable it for Production and Preview (and Development if you use it)
  4. Redeploy

Docs: https://vercel.com/docs/projects/environment-variables
`);
  process.exit(1);
}

const hasPostgresProtocol = /^postgres(ql)?:\/\//i.test(url);
if (!hasPostgresProtocol) {
  console.error(`
[build] DATABASE_URL is set but invalid for Prisma PostgreSQL datasource.

Current value does not start with:
  - postgresql://
  - postgres://

Please set DATABASE_URL to a real PostgreSQL connection string in:
  Vercel → Project Settings → Environment Variables

Examples:
  postgresql://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
  postgres://USER:PASSWORD@HOST:5432/DB_NAME?sslmode=require
`);
  process.exit(1);
}
