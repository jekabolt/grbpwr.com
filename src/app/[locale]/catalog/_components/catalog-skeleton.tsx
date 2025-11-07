import { CATALOG_LIMIT } from "@/constants";

import { Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <>
      <div className="block lg:hidden">
        <div className="flex flex-col space-y-5 px-2.5 pb-10 pt-2">
          <div className="sticky top-5 z-20 space-y-5 text-bgColor mix-blend-exclusion">
            <div className="w-full overflow-x-auto">
              <div className="flex gap-4">
                <Skeleton className="h-8 w-24 shrink-0" />
                <Skeleton className="h-8 w-24 shrink-0" />
                <Skeleton className="h-8 w-24 shrink-0" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
          <div>
            <Skeleton className="mb-4 h-6 w-full" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
                <ProductSkeleton key={`skeleton-mobile-${index}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 px-7 pt-24">
        <div className="sticky top-20 z-10 flex items-start justify-between text-bgColor mix-blend-exclusion">
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, id) => (
              <Skeleton key={`skeleton-${id}`} className="h-5 w-24" />
            ))}
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="mix-blend-normal">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16">
            {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
              <ProductSkeleton key={`skeleton-desktop-${index}`} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
