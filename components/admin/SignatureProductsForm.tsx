import { updateSignatureProductsAction } from "@/app/actions/site-settings";

type ProductOption = { id: string; name: string };

type Props = {
  products: ProductOption[];
  /** Slot 1 = large left, 2 = top-right, 3 = bottom-right */
  selectedIds: [string | null, string | null, string | null];
  saved?: boolean;
  error?: string;
};

const selectClass =
  "h-11 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/30";

const labels = [
  { n: 1, title: "Large tile (left)", field: "signatureProduct1Id" as const },
  { n: 2, title: "Top card (right column)", field: "signatureProduct2Id" as const },
  { n: 3, title: "Bottom card (right column)", field: "signatureProduct3Id" as const },
];

export function SignatureProductsForm({ products, selectedIds, saved, error }: Props) {
  return (
    <form action={updateSignatureProductsAction} className="mx-auto max-w-3xl space-y-8">
      <div>
        <h2 className="font-[family-name:var(--font-syne)] text-lg font-semibold text-white">Signature section</h2>
        <p className="mt-2 max-w-xl text-sm text-zinc-400">
          Choose up to three <strong className="text-zinc-300">published</strong> products for the Signature block under
          the hero. Leave a slot on “Automatic” to fill from featured / sort order. Order: large tile first, then the
          two stacked cards.
        </p>
      </div>

      {saved ? (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Signature products saved. The home page will show your picks (or fall back where empty).
        </p>
      ) : null}
      {error ? (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}

      <div className="space-y-6">
        {labels.map((slot, idx) => (
          <div key={slot.field} className="space-y-2">
            <label htmlFor={slot.field} className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              {slot.title}
            </label>
            <select
              id={slot.field}
              name={slot.field}
              defaultValue={selectedIds[idx] ?? ""}
              className={selectClass}
            >
              <option value="">Automatic (catalog pick)</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-accent/20 transition hover:bg-accent-dim"
      >
        Save signature products
      </button>
    </form>
  );
}
