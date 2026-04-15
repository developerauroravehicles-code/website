import { PrismaClient } from "@prisma/client";

function getDatabaseUrl(): string {
  const raw = process.env.DATABASE_URL?.trim();
  if (!raw) {
    throw new Error(
      "[db] DATABASE_URL is not set. Add a PostgreSQL URL to `.env` (copy from `.env.example`). Local: Neon/Supabase free tier or Docker Postgres.",
    );
  }
  if (!/^postgres(ql)?:\/\//i.test(raw)) {
    throw new Error(
      "[db] DATABASE_URL must start with postgresql:// or postgres:// (not https:// or a placeholder).",
    );
  }
  return raw;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: { db: { url: getDatabaseUrl() } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

/** Reuse one client per runtime (dev HMR + Vercel warm serverless invocations). */
globalForPrisma.prisma = prisma;
