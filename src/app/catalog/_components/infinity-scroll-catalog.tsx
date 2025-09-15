"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { common_Product } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";
import { useInView } from "react-intersection-observer";

import { serviceClient } from "@/lib/api";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import ProductsGrid from "@/app/_components/product-grid";
import { getProductsPagedQueryParams } from "@/app/catalog/_components/utils";

import { useRouteParams } from "./useRouteParams";

export function InfinityScrollCatalog({
  firstPageItems,
  total,
}: {
  firstPageItems: common_Product[];
  total: number;
}) {
  const searchParams = useSearchParams();
  const { dictionary } = useDataContext();
  const { languageId } = useTranslationsStore((state) => state);
  const { gender, topCategory, subCategory } = useRouteParams();
  const [items, setItems] = useState<common_Product[]>(firstPageItems);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTotal, setCurrentTotal] = useState(total);
  const { ref, inView } = useInView();
  const pageRef = useRef(2);
  const hasMoreRef = useRef(total >= CATALOG_LIMIT);
  const isRefetchingRef = useRef(false);

  useEffect(() => {
    setItems(firstPageItems);
    setCurrentTotal(total);
    hasMoreRef.current = total >= CATALOG_LIMIT;
    pageRef.current = 2;
    setIsLoading(false);
    isRefetchingRef.current = false;
  }, [firstPageItems, total]);

  // Refetch data when languageId changes
  useEffect(() => {
    if (isRefetchingRef.current) return;

    const refetchData = async () => {
      isRefetchingRef.current = true;
      setIsLoading(true);

      try {
        const searchParamsObj = Object.fromEntries(searchParams.entries());
        const response = await serviceClient.GetProductsPaged({
          limit: CATALOG_LIMIT,
          offset: 0,
          ...getProductsPagedQueryParams(
            {
              gender,
              topCategoryIds: topCategory?.id?.toString(),
              subCategoryIds: subCategory?.id?.toString(),
              ...searchParamsObj,
            },
            dictionary,
          ),
        });

        setItems(response.products || []);
        setCurrentTotal(response.total || 0);
        hasMoreRef.current = (response.total || 0) >= CATALOG_LIMIT;
        pageRef.current = 2;
      } catch (error) {
        console.error("Failed to fetch data on language change:", error);
      } finally {
        setIsLoading(false);
        isRefetchingRef.current = false;
      }
    };

    refetchData();
  }, [languageId, dictionary, gender, topCategory, subCategory, searchParams]);

  useEffect(() => {
    const searchParamsObj = Object.fromEntries(searchParams.entries());
    const hasFilters = Object.keys(searchParamsObj).length > 0;

    if (!hasFilters) return;
    if (isRefetchingRef.current) return;

    const refetchData = async () => {
      isRefetchingRef.current = true;
      setIsLoading(true);

      try {
        const response = await serviceClient.GetProductsPaged({
          limit: CATALOG_LIMIT,
          offset: 0,
          ...getProductsPagedQueryParams(
            {
              gender,
              topCategoryIds: topCategory?.id?.toString(),
              subCategoryIds: subCategory?.id?.toString(),
              ...searchParamsObj,
            },
            dictionary,
          ),
        });

        setItems(response.products || []);
        setCurrentTotal(response.total || 0);
        hasMoreRef.current = (response.total || 0) >= CATALOG_LIMIT;
        pageRef.current = 2;
      } catch (error) {
        console.error("Failed to fetch filtered data:", error);
      } finally {
        setIsLoading(false);
        isRefetchingRef.current = false;
      }
    };

    refetchData();
  }, [searchParams, dictionary, gender, topCategory, subCategory, languageId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadMoreData = async () => {
    if (!hasMoreRef.current || isLoading) return;
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await serviceClient.GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: (pageRef.current - 1) * CATALOG_LIMIT,
        ...getProductsPagedQueryParams(
          {
            gender,
            topCategoryIds: topCategory?.id?.toString(),
            subCategoryIds: subCategory?.id?.toString(),
            size: searchParams.get("size"),
            sort: searchParams.get("sort"),
            order: searchParams.get("order"),
            sale: searchParams.get("sale"),
            tag: searchParams.get("tag"),
          },
          dictionary,
        ),
      });

      pageRef.current += 1;
      setItems((prevItems) => {
        const newItems = [...prevItems, ...(response.products || [])];
        hasMoreRef.current = newItems.length < currentTotal;
        return newItems;
      });
    } catch (error) {
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
      <ProductsGrid
        products={items}
        isLoading={isLoading}
        total={currentTotal}
      />
      {hasMoreRef.current && <div ref={ref} />}
    </div>
  );
}
