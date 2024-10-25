"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { common_Product } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";
import { useInView } from "react-intersection-observer";

import { serviceClient } from "@/lib/api";
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
      const response = await serviceClient.GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: (pageRef.current - 1) * CATALOG_LIMIT,
        ...getProductsPagedQueryParams({
          gender: searchParams.get("gender"),
          category: searchParams.get("category"),
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
    <div>
      <ProductsGrid products={items} />
      {hasMoreRef.current && (
        <div ref={ref} className="text-center text-xl">
          Loading...
        </div>
      )}
    </div>
  );
}
