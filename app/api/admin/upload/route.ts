import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth-server";
import { slugify } from "@/lib/slug";

export const runtime = "nodejs";

const MAX_PER_FILE = 5 * 1024 * 1024;
const ALLOWED = new Map<string, string>([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

function extFor(mime: string): string | undefined {
  return ALLOWED.get(mime);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const folderRaw = String(formData.get("folder") ?? "").trim();
  const folder = slugify(folderRaw || "misc");
  const entries = formData.getAll("files");
  const files = entries.filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files" }, { status: 400 });
  }

  const urls: string[] = [];
  const baseDir = path.join(process.cwd(), "public", "products", folder);
  await mkdir(baseDir, { recursive: true });

  const stamp = Date.now();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.size > MAX_PER_FILE) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_PER_FILE / 1024 / 1024}MB each)` },
        { status: 413 },
      );
    }
    const mime = file.type;
    const ext = extFor(mime);
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
        { status: 400 },
      );
    }
    const buf = Buffer.from(await file.arrayBuffer());
    const name = `${stamp}-${i}${ext}`;
    const filePath = path.join(baseDir, name);
    await writeFile(filePath, buf);
    urls.push(`/products/${folder}/${name}`);
  }

  return NextResponse.json({ ok: true as const, urls });
}
