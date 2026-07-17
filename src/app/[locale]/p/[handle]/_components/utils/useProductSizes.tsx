import { StorefrontColorway } from "@/api/proto-http/frontend";

import { formatSizeName } from "@/lib/utils";

// Sizes are keyed on the public size ordinal (PublicSize.sku_ord) — a stable,
// public number that is part of the variant SKU — replacing the internal size id.
// The lean projection exposes stock only as a `sold_out` boolean per variant (no
// count), so numeric "only N left" low-stock hints degrade: an available size
// reports a sentinel above the low-stock threshold, a sold-out size reports 0.
// Real per-unit limits are enforced server-side at order validation.
const IN_STOCK_SENTINEL = 99;

export function useProductSizes({ product }: { product: StorefrontColorway }) {
  const sizes = product.variants;

  const sizeNames = sizes?.map((v) => ({
    id: v.size?.skuOrd as number,
    name: formatSizeName((v.size?.name || v.size?.code || "").trim()),
    variantSku: v.variantSku || "",
  }));

  const sizeQuantity: Record<number, number> =
    sizes?.reduce(
      (acc, v) => {
        acc[v.size?.skuOrd ?? 0] = v.soldOut ? 0 : IN_STOCK_SENTINEL;
        return acc;
      },
      {} as Record<number, number>,
    ) || {};

  const isOneSize =
    sizeNames?.length === 1 && sizeNames[0].name.toLowerCase() === "one size";

  return {
    sizes,
    sizeNames,
    isOneSize,
    sizeQuantity,
  };
}
