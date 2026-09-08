import QRCode from "qrcode";

import { getNovaAppPublicUrl, getPublicSiteUrlWarnings } from "@/lib/nova-app";

type Props = {
  targetUrl: string;
  envWarnings: string[];
};

export async function NovaAppQrPreview({ targetUrl, envWarnings }: Props) {
  const dataUrl = await QRCode.toDataURL(targetUrl, {
    margin: 2,
    width: 280,
    color: { dark: "#000000", light: "#ffffff" },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-4 rounded-xl border border-zinc-800 bg-zinc-950/40 p-6">
      <div>
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white">QR code</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Print or share this QR. It points to the hidden redirect URL below (not linked anywhere on the public site).
        </p>
      </div>
      <p className="break-all font-mono text-xs text-zinc-500">{targetUrl}</p>
      {envWarnings.length > 0 ? (
        <ul className="space-y-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-100">
          {envWarnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      ) : null}
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={dataUrl} alt={`QR code for ${targetUrl}`} width={280} height={280} className="rounded-lg bg-white p-2" />
        <a
          href={dataUrl}
          download="aurora-nova-app-qr.png"
          className="inline-flex rounded-lg border border-zinc-600 px-4 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800"
        >
          Download PNG
        </a>
      </div>
    </div>
  );
}
