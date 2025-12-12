import { CATALOG_LIMIT } from "@/constants";

import { Skeleton } from "@/components/ui/skeleton";

export function CatalogSkeleton() {
  return (
    <>
      <div className="block lg:hidden">
        <div className="flex min-h-screen flex-col px-2.5 pt-2">
          <div className="flex flex-1 flex-col space-y-6">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
                <ProductSkeleton key={`skeleton-mobile-${index}`} />
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 z-20 my-5 flex justify-center text-bgColor mix-blend-exclusion">
            <Skeleton className="h-6 w-32" />
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
