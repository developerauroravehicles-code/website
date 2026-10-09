-- App store URLs for Nova QR and AuroraCam (safe if columns already exist from db push)
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "novaAppPlayStoreUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "novaAppAppStoreUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "auroraCamPlayStoreUrl" TEXT NOT NULL DEFAULT '';
ALTER TABLE "SiteSetting" ADD COLUMN IF NOT EXISTS "auroraCamAppStoreUrl" TEXT NOT NULL DEFAULT '';
