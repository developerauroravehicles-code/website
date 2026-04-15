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
