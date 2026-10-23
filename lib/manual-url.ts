const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";

/** Manual PDFs may only live in Vercel Blob or under /products/ (local uploads). */
export function isAllowedManualUrl(value: string): boolean {
  const t = value.trim();
  if (!t) return true;
  if (t.startsWith("/")) {
    return t.startsWith("/products/") && !t.includes("..") && !t.startsWith("//");
  }
  try {
    const u = new URL(t);
    return u.protocol === "https:" && u.hostname.endsWith(BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}
