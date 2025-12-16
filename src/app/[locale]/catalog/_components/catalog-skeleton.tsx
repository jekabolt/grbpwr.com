"use client";

import { CATALOG_LIMIT } from "@/constants";

import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

import { useScrambleText } from "./useScrambleText";

function ScrambleLabel({ text = "product name" }: { text?: string }) {
  const scrambled = useScrambleText(text, 1000);

  return <Text className="tracking-[0.2em]">{scrambled}</Text>;
}

export function CatalogSkeleton() {
  return (
    <>
      <div className="block lg:hidden">
        <div className="flex min-h-screen flex-col px-2.5 pt-16">
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
      <div className="hidden flex-col gap-6 px-7 pt-24 lg:flex">
        <div className="sticky top-20 z-10 flex items-start justify-between border border-red-500 text-bgColor mix-blend-exclusion">
          <div className="flex gap-4">
            {Array.from({ length: 8 }).map((_, id) => (
              <Skeleton key={`skeleton-${id}`} className="h-5 w-24" />
            ))}
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="z-50 w-full" />
        <div className="mix-blend-normal">
          <div className="border border-blue-500">
            <Skeleton className="mb-6 h-4 w-2/3" />
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16">
              {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
                <ProductSkeleton key={`skeleton-desktop-${index}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[4/5] w-full" />
      <ScrambleLabel text="product name" />
      <ScrambleLabel text="price" />
    </div>
  );
}
