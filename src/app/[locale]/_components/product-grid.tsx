import type { common_Product } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";

import { ProductSkeleton } from "../catalog/_components/catalog-skeleton";
import { ProductItem } from "./product-item";

export default function ProductsGridSection({
  products,
  isLoading,
  total,
}: {
  products: common_Product[] | undefined;
  isLoading: boolean;
  total: number;
}) {
  if (!products) return null;

  const baseLength = products.length || 0;
  const showSkeleton = isLoading && total >= 0;

  const skeletonCount = !showSkeleton
    ? 0
    : baseLength === 0
      ? // Initial load (e.g. applying filters): fill with a full page of skeletons
        CATALOG_LIMIT
      : // Infinite scroll: only skeletons for the remaining items on this page
        Math.min(CATALOG_LIMIT, Math.max(total - baseLength, 0));

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16">
      {products.map((v) => (
        <div key={v.id}>
          <ProductItem className="mx-auto" product={v} />
        </div>
      ))}
      {showSkeleton &&
        Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductSkeleton key={`skeleton-${index}`} />
        ))}
    </div>
  );
}
