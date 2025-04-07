"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { common_Product } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";
import { useInView } from "react-intersection-observer";

import { serviceClient } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import ProductsGrid from "@/app/_components/product-grid";
import { getProductsPagedQueryParams } from "@/app/catalog/_components/utils";

export function InfinityScrollCatalog({
  firstPageItems,
  total,
}: {
  firstPageItems: common_Product[];
  total: number;
}) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<common_Product[]>(firstPageItems);
  const [isLoading, setIsLoading] = useState(false);
  const { ref, inView } = useInView();

  const pageRef = useRef(2);
  const hasMoreRef = useRef(total >= CATALOG_LIMIT);

  useEffect(() => {
    setItems(firstPageItems);
    hasMoreRef.current = total >= CATALOG_LIMIT;
    pageRef.current = 2;
    setIsLoading(false);
  }, [firstPageItems, total]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMoreData = async () => {
    if (!hasMoreRef.current || isLoading) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      const response = await serviceClient.GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: (pageRef.current - 1) * CATALOG_LIMIT,
        ...getProductsPagedQueryParams({
          gender: searchParams.get("gender"),
          topCategoryIds: searchParams.get("topCategoryIds"),
          size: searchParams.get("size"),
          sort: searchParams.get("sort"),
          order: searchParams.get("order"),
        }),
      });

      pageRef.current += 1;
      setItems((prevItems) => [...prevItems, ...(response.products || [])]);
      // To-DO we don't have count of all products on response, so last request could has 16 so we will make additional request that makes no sense - fix
      if (!response.products || response.products.length < CATALOG_LIMIT) {
        hasMoreRef.current = false;
      }
    } catch (error) {
      // TO-DO show some sooner here that error happened ?
      console.error("Failed to fetch data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMoreRef.current) {
      loadMoreData();
    }
  }, [inView, loadMoreData]);

  return (
    <div className="space-y-4">
      <ProductsGrid products={items} />
      {isLoading && (
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16 2xl:grid-cols-6">
          {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}
      {hasMoreRef.current && <div ref={ref} />}
    </div>
  );
}

export function ProductSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="aspect-[3/4] w-full" />
      <Skeleton variant="highlight" className="h-3 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  );
}
