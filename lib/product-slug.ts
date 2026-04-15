import { prisma } from "@/lib/db";

export async function allocateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base || "product";
  let counter = 1;
  for (;;) {
    const existing = await prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    if (!existing) return slug;
    counter += 1;
    slug = `${base}-${counter}`;
  }
}
