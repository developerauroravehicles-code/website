import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { slugify } from "@/lib/slug";
import { MAX_PDF_UPLOAD_BYTES, MAX_PDF_UPLOAD_MB } from "@/lib/upload-limits";

export const runtime = "nodejs";

const MAX_PER_FILE = MAX_PDF_UPLOAD_BYTES;
const PDF_MIME = "application/pdf";

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function mimeHintFromFilename(name: string): string | undefined {
  return name.toLowerCase().endsWith(".pdf") ? PDF_MIME : undefined;
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
    if (files.length > 1) {
      return jsonError("Upload one PDF at a time", 400);
    }

    const file = files[0];
    if (file.size > MAX_PER_FILE) {
      return jsonError(`PDF çok büyük (en fazla ${MAX_PDF_UPLOAD_MB} MB).`, 413);
    }

    const mime = file.type || mimeHintFromFilename(file.name) || "";
    if (mime !== PDF_MIME) {
      return jsonError("Yalnızca PDF dosyaları kabul edilir.", 400);
    }

    const isVercel = process.env.VERCEL === "1";
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN?.trim();
    const useBlob = Boolean(blobToken);

    if (isVercel && !useBlob) {
      return jsonError(
        "Sunucuda yerel diske yazılamıyor. Vercel projesine Blob Storage ekleyin; BLOB_READ_WRITE_TOKEN gerekir.",
        503,
      );
    }

    const buf = Buffer.from(await file.arrayBuffer());
    const stamp = Date.now();
    const name = `manual-${stamp}-${randomBytes(4).toString("hex")}.pdf`;

    let url: string;
    if (useBlob) {
      const pathname = `products/${folder}/${name}`;
      const blob = await put(pathname, buf, {
        access: "public",
        contentType: PDF_MIME,
        addRandomSuffix: false,
        token: blobToken,
      });
      url = blob.url;
    } else {
      const baseDir = path.join(process.cwd(), "public", "products", folder);
      await mkdir(baseDir, { recursive: true });
      const filePath = path.join(baseDir, name);
      await writeFile(filePath, buf);
      url = `/products/${folder}/${name}`;
    }

    return NextResponse.json({ ok: true as const, urls: [url] });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Upload failed";
    console.error("[admin/upload-pdf]", e);
    return jsonError(
      msg.includes("EROFS") || msg.includes("EPERM") ? "Dosya sistemi yazılamıyor (üretimde Vercel Blob kullanın)." : msg,
      500,
    );
  }
}
