"use client";

import type { StorefrontColorway } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";

import { useViewerTier } from "@/lib/hooks/use-viewer-tier";
import { isProductLocked } from "@/lib/tier";

import { ProductSkeleton } from "../catalog/_components/catalog-skeleton";
import { ProductItem } from "./product-item";

export default function ProductsGridSection({
  products,
  isLoading,
  total,
}: {
  products: StorefrontColorway[] | undefined;
  isLoading: boolean;
  total: number;
}) {
  // Catalogue reads are anonymous, so the lock state is resolved client-side per
  // card against the hydrated viewer tier (see use-viewer-tier / tier.ts). A
  // tier-gated piece renders as a locked teaser; a qualifying viewer sees the
  // normal, buyable card. The same wiring serves the main and exclusive grids.
  const { accountTier } = useViewerTier();

  if (!products) return null;

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16">
      {products.map((v, index) => {
        // Prioritize first 4 items (2 rows on mobile, 1 row on desktop)
        const isPriority = index < 4;
        return (
          <div key={v.baseSku}>
            <ProductItem
              className="mx-auto"
              product={v}
              imagePriority={isPriority}
              locked={isProductLocked(v, accountTier)}
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
