const MESSAGES: Record<string, string> = {
  missing: "Product name is required.",
  manual: "User manual must be uploaded here (Vercel Blob) or be a /products/... path.",
};

export function ProductFormError({ code }: { code?: string }) {
  const message = code ? MESSAGES[code] : undefined;
  if (!message) return null;
  return (
    <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
      {message}
    </p>
  );
}
