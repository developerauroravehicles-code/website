"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { MAX_PDF_UPLOAD_BYTES, MAX_PDF_UPLOAD_MB } from "@/lib/upload-limits";

type Props = {
  defaultValue: string;
  productSlug?: string | null;
};

export function UserManualField({ defaultValue, productSlug }: Props) {
  const inputId = useId();
  const [value, setValue] = useState(defaultValue.trim());
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  const draftFolder = useMemo(() => `draft-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`, []);
  const folder = productSlug?.trim() || draftFolder;

  const onFile = async (fileList: FileList | null) => {
    const file = fileList?.[0];
    if (!file) return;
    if (file.size > MAX_PDF_UPLOAD_BYTES) {
      setStatus("error");
      setMessage(`PDF çok büyük: “${file.name}” (en fazla ${MAX_PDF_UPLOAD_MB} MB).`);
      return;
    }
    setStatus("uploading");
    setMessage(null);
    try {
      const fd = new FormData();
      fd.set("folder", folder);
      fd.append("files", file);
      const res = await fetch("/api/admin/upload-pdf", {
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
        setMessage(res.ok ? "Sunucu geçersiz yanıt döndürdü." : `Yükleme başarısız (HTTP ${res.status}).`);
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setMessage(
          data.error ??
            (res.status === 413
              ? `Dosya boyutu sınırı aşıldı (en fazla ~${MAX_PDF_UPLOAD_MB} MB).`
              : "Yükleme başarısız"),
        );
        return;
      }
      const url = data.urls?.[0];
      if (url) {
        setValue(url);
        setStatus("idle");
      } else {
        setStatus("error");
        setMessage("PDF kaydedilemedi.");
      }
    } catch {
      setStatus("error");
      setMessage("Ağ hatası — bağlantıyı kontrol edin.");
    }
  };

  const clearManual = useCallback(() => {
    setValue("");
  }, []);

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-dashed border-zinc-600 bg-zinc-950/50 px-4 py-5">
        <label htmlFor={inputId} className="cursor-pointer text-sm text-zinc-300">
          <span className="font-medium text-accent">User manual (PDF)</span>
          <span className="text-zinc-500"> — PDF, en fazla {MAX_PDF_UPLOAD_MB} MB</span>
        </label>
        <input
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          disabled={status === "uploading"}
          onChange={(e) => {
            void onFile(e.target.files);
            e.target.value = "";
          }}
          className="mt-3 block w-full cursor-pointer text-sm text-zinc-400 file:mr-4 file:rounded-lg file:border-0 file:bg-accent file:px-4 file:py-2 file:text-sm file:font-semibold file:text-background hover:file:bg-accent-dim"
        />
        {status === "uploading" ? <p className="mt-2 text-xs text-zinc-500">Yükleniyor…</p> : null}
        {status === "error" && message ? (
          <p className="mt-2 text-xs text-red-400" role="alert">
            {message}
          </p>
        ) : null}
        {!productSlug?.trim() ? (
          <p className="mt-2 text-xs text-zinc-500">
            Yeni ürün: dosya taslak klasörüne kaydedilir; kaydettikten sonra slug ile eşleşir.
          </p>
        ) : null}
        {value ? (
          <button
            type="button"
            onClick={clearManual}
            className="mt-3 text-xs font-medium text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
          >
            PDF’i kaldır
          </button>
        ) : null}
      </div>
      <label htmlFor={`${inputId}-url`} className="text-xs font-medium uppercase tracking-wide text-zinc-400">
        User manual URL (optional — paste or use upload)
      </label>
      <textarea
        id={`${inputId}-url`}
        name="userManualUrl"
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="https://… (PDF)"
        className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 font-mono text-xs outline-none focus:border-accent focus:ring-2 focus:ring-accent/30"
      />
    </div>
  );
}
