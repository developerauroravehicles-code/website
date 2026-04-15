export function productImageUrls(product: { images: string }): string[] {
  try {
    const raw = JSON.parse(product.images) as unknown;
    if (!Array.isArray(raw)) return [];
    return raw.filter((u): u is string => typeof u === "string" && u.length > 0);
  } catch {
    return [];
  }
}

export function stringifyImageUrls(urls: string[]): string {
  return JSON.stringify(urls.filter((u) => u.trim().length > 0));
}
