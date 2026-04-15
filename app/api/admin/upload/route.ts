import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { slugify } from "@/lib/slug";
import { MAX_IMAGE_UPLOAD_BYTES, MAX_IMAGE_UPLOAD_MB } from "@/lib/upload-limits";

export const runtime = "nodejs";

const MAX_PER_FILE = MAX_IMAGE_UPLOAD_BYTES;
const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

function extFor(mime: string): string | undefined {
  return ALLOWED.get(mime);
}

function mimeHintFromFilename(name: string): string | undefined {
  const lower = name.toLowerCase();
  if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".gif")) return "image/gif";
  return undefined;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return jsonError("Unauthorized", 401);
    }

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return jsonError("Invalid form data", 400);
    }

    const folderRaw = String(formData.get("folder") ?? "").trim();
    const folder = slugify(folderRaw || "misc");
    const entries = formData.getAll("files");
    const files = entries.filter((f): f is File => f instanceof File && f.size > 0);

    if (files.length === 0) {
      return jsonError("No files", 400);
    }

    const isVercel = process.env.VERCEL === "1";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    const useBlob = Boolean(blobToken);

    if (isVercel && !useBlob) {
      return jsonError(
        "Sunucuda yerel diske yazılamıyor. Vercel projesine Blob Storage ekleyin (Storage → Blob → projeye bağlayın); BLOB_READ_WRITE_TOKEN ortam değişkeni oluşur.",
        503,
      );
    }

    const urls: string[] = [];
    const baseDir = path.join(process.cwd(), "public", "products", folder);
    if (!useBlob) {
      await mkdir(baseDir, { recursive: true });
    }

    const stamp = Date.now();

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_PER_FILE) {
        return jsonError(`Dosya çok büyük (dosya başına en fazla ${MAX_IMAGE_UPLOAD_MB} MB).`, 413);
      }
      const mime = file.type || mimeHintFromFilename(file.name) || "";
      const ext = extFor(mime);
      if (!ext) {
        return jsonError("Only JPEG, PNG, WebP, and GIF images are allowed", 400);
      }
      const buf = Buffer.from(await file.arrayBuffer());
      const name = `${stamp}-${i}-${randomBytes(4).toString("hex")}${ext}`;

      if (useBlob) {
        const pathname = `products/${folder}/${name}`;
        const blob = await put(pathname, buf, {
          access: "public",
          contentType: mime,
          addRandomSuffix: false,
          token: blobToken,
        });
        urls.push(blob.url);
      } else {
        const filePath = path.join(baseDir, name);
        await writeFile(filePath, buf);
        urls.push(`/products/${folder}/${name}`);
      }
    }

    return NextResponse.json({ ok: true as const, urls });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error("[admin/upload]", e);
    return jsonError(msg.includes("EROFS") || msg.includes("EPERM") ? "Dosya sistemi yazılamıyor (üretimde Vercel Blob kullanın)." : msg, 500);
  }
}
