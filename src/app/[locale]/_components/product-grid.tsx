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

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16">
      {products.map((v, index) => {
        // Prioritize first 4 items (2 rows on mobile, 1 row on desktop)
        const isPriority = index < 4;
        return (
          <div key={v.id}>
            <ProductItem
              className="mx-auto"
              product={v}
              imagePriority={isPriority}
            />
          </div>
        );
      })}
      {isLoading &&
        Array.from({
          length: Math.min(CATALOG_LIMIT, total - products.length),
        }).map((_, index) => <ProductSkeleton key={`skeleton-${index}`} />)}
    </div>
  );
}
