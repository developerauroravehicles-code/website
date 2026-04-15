"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { setHomeHeroProductId } from "@/lib/home-hero";
import { getSession } from "@/lib/auth-server";
import { slugify } from "@/lib/slug";
import { stringifyImageUrls } from "@/lib/product-utils";
import { allocateUniqueSlug } from "@/lib/product-slug";

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    throw new Error("Unauthorized");
  }
}

function parseImageLines(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect("/admin/products/new?error=missing");
  }
  const slugInput = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(slugInput || name);
  const slug = await allocateUniqueSlug(baseSlug);
  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const images = stringifyImageUrls(parseImageLines(String(formData.get("images") ?? "")));
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;

  await prisma.product.create({
    data: {
      name,
      slug,
      shortDescription,
      longDescription,
      images,
      featured,
      published,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function updateProductAction(productId: string, formData: FormData) {
  await requireAdmin();
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) {
    redirect("/admin/products?error=notfound");
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    redirect(`/admin/products/${productId}/edit?error=missing`);
  }
  const slugInput = String(formData.get("slug") ?? "").trim();
  const baseSlug = slugify(slugInput || name);
  const slug =
    baseSlug === existing.slug ? existing.slug : await allocateUniqueSlug(baseSlug, existing.id);

  const shortDescription = String(formData.get("shortDescription") ?? "").trim();
  const longDescription = String(formData.get("longDescription") ?? "").trim();
  const images = stringifyImageUrls(parseImageLines(String(formData.get("images") ?? "")));
  const featured = formData.get("featured") === "on";
  const published = formData.get("published") === "on";
  const sortOrder = Number.parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      slug,
      shortDescription,
      longDescription,
      images,
      featured,
      published,
      sortOrder,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${existing.slug}`);
  revalidatePath(`/products/${slug}`);
  redirect("/admin/products");
}

export async function deleteProductAction(productId: string) {
  await requireAdmin();
  const existing = await prisma.product.findUnique({ where: { id: productId } });
  if (!existing) return;
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${existing.slug}`);
}

export async function deleteProductFormAction(formData: FormData) {
  const productId = String(formData.get("id") ?? "");
  if (!productId) redirect("/admin/products");
  await deleteProductAction(productId);
  redirect("/admin/products");
}

export async function setHomeHeroProductAction(productId: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) {
    redirect("/admin/products?error=notfound");
  }

  await setHomeHeroProductId(productId);

  revalidatePath("/");
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
