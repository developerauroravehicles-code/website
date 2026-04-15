export default function CursorDesignPage() {
  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold tracking-tight text-white">
          Cursor — Figma reference
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">cursor: url(...)</code> yalnızca PNG,
          SVG veya CUR dosyası kabul eder; iframe kullanılamaz. Aşağıdaki tasarımdan çerçeveyi{" "}
          <strong className="text-zinc-200">Export</strong> edip{" "}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">public/cursors/</code> içine koyun,
          ardından <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">app/globals.css</code> içindeki{" "}
          <code className="rounded bg-zinc-800 px-1 py-0.5 text-zinc-300">cursor</code> satırını bu dosyaya ve hotspot
          koordinatlarına göre güncelleyin (genelde 32×32 px).
        </p>
      </div>
      <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
        <iframe
          title="Figma — Logo cursor community file"
          className="aspect-video w-full max-w-full"
          style={{ border: "1px solid rgba(0, 0, 0, 0.1)", minHeight: "450px" }}
          width={800}
          height={450}
          src="https://embed.figma.com/design/IWJtCYicjNtcY9NRXCOxc1/Figma-Logo---Cursor--Community-?node-id=2-6&embed-host=share"
          allowFullScreen
        />
      </div>
    </div>
  );
}
