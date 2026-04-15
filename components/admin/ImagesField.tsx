"use client";

import { useCallback, useId, useMemo, useState } from "react";

type Props = {
  defaultValue: string;
  /** Saved product slug; uploads go under /public/products/{slug}/. If empty, a stable draft folder is used. */
  productSlug?: string | null;
};

export function ImagesField({ defaultValue, productSlug }: Props) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const draftFolder = useMemo(() => `draft-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`, []);
  const folder = productSlug?.trim() || draftFolder;

  const appendUrls = useCallback((urls: string[]) => {
    if (urls.length === 0) return;
    setValue((prev) => {
      const base = prev.trimEnd();
      const block = urls.join("\n");
      if (!base) return `${block}\n`;
      return `${base}\n${block}\n`;
    });
  }, []);

  const onFiles = async (fileList: FileList | null) => {
    if (!fileList?.length) return;
    setStatus("uploading");
    setMessage(null);
    const fd = new FormData();
    fd.set("folder", folder);
    for (let i = 0; i < fileList.length; i++) {
      fd.append("files", fileList[i]);
    }
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      const raw = await res.text();
      let data: { ok?: boolean; urls?: string[]; error?: string } = {};
      try {
        data = raw ? (JSON.parse(raw) as typeof data) : {};
      } catch {
        setStatus("error");
        setMessage(
          res.ok
            ? "Sunucu geçersiz yanıt döndürdü."
            : `Yükleme başarısız (HTTP ${res.status}).`,
        );
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Upload failed");
        return;
      }
      if (data.urls?.length) {
        appendUrls(data.urls);
        setStatus("idle");
      } else {
        setStatus("error");
        setMessage("No files were saved");
      }
    } catch {
      setStatus("error");
      setMessage("Ağ hatası — bağlantıyı kontrol edin.");
    }
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-950/50 px-4 py-5">
        <label htmlFor={inputId} className="cursor-pointer text-sm text-zinc-300">
          <span className="font-medium text-accent">Upload images</span>
          <span className="text-zinc-500"> — JPEG, PNG, WebP, or GIF, up to 5MB each</span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          disabled={status === "uploading"}
          onChange={(e) => {
            void onFiles(e.target.files);
            e.target.value = "";
          }}
          className="mt-3 block w-full cursor-pointer text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background hover:file:bg-accent-dim"
        />
        {status === "uploading" ? (
          <p className="mt-2 text-xs text-zinc-500">Uploading…</p>
        ) : null}
        {status === "error" && message ? (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {message}
          </p>
        ) : null}
        {!productSlug?.trim() ? (
          <p className="mt-2 text-xs text-zinc-500">
            New product: files are stored in a draft folder until you save; URLs below still work on the site.
          </p>
        ) : null}
      </div>
      <label htmlFor={`${inputId}-urls`} className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        Image URLs (one per line)
      </label>
      <textarea
        id={`${inputId}-urls`}
        name="images"
        rows={6}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://... or use upload above"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}
