import { deleteProductFormAction } from "@/app/actions/products";

export function DeleteProductButton({ productId, name }: { productId: string; name: string }) {
  return (
    <form action={deleteProductFormAction} className="inline">
      <input type="hidden" name="id" value={productId} />
      <button
        type="submit"
        className="text-sm text-red-400 transition hover:text-red-300"
        title={`Delete: ${name}`}
      >
        Delete
      </button>
    </form>
  );
}
