import { StorefrontColorway } from "@/api/proto-http/frontend";

export type MeasurementType = "clothing" | "ring" | "shoe";

// Category ids are not in the lean storefront projection (R3), so the size-guide
// table type is derived from the variant's public size system (PublicSize.system)
// instead: SHOE → the shoe conversion table, everything else → the clothing
// measurement table. The garment-diagram icon (which needs category ids) degrades
// to absent; the numeric measurement table still renders. Ring detection is lost
// (no dedicated size system) and falls back to the clothing table.
export function useMeasurementType({
  product,
}: {
  product: StorefrontColorway;
}) {
  const system = product.variants?.[0]?.size?.system;

  // Cast keeps the exported type as the full MeasurementType union — TS otherwise
  // flow-narrows the const to the ternary's "shoe" | "clothing", which would make
  // downstream `=== "ring"` checks a type error even though ring stays a valid case.
  const measurementType = (
    system === "SIZE_SKU_SYSTEM_SHOE" ? "shoe" : "clothing"
  ) as MeasurementType;

  return {
    measurementType,
    subCategoryId: undefined as number | undefined,
    typeId: undefined as number | undefined,
    categoryId: undefined as number | undefined,
  };
}
