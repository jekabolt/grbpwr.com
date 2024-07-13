"use client";

import type { common_Product } from "@/api/proto-http/frontend";
import ProductsSection from "@/components/sections/ProductsGridSection";
import { CATALOG_LIMIT } from "@/constants";
import { serviceClient } from "@/lib/api";
import { getValidatedGetProductsPagedParams } from "@/lib/utils/queryFilters";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

export default function CatalogSection({
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
        ...getValidatedGetProductsPagedParams({
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
      <ProductsSection products={items} />
      {hasMoreRef.current && (
        <div ref={ref} className="text-center text-xl">
          Loading...
        </div>
      )}
    </div>
  );
}
