"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import type {
  common_Product,
  GetProductsPagedResponse,
} from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import { useServerActionsContext } from "@/components/contexts/ServerActionsContext";
import ProductsGrid from "@/app/[locale]/_components/product-grid";
import { getProductsPagedQueryParams } from "@/app/[locale]/catalog/_components/utils";

import { useAnalytics } from "./useAnalytics";
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
  const { GetProductsPaged } = useServerActionsContext();
  const { languageId, currentCountry } = useTranslationsStore((state) => state);
  const { gender, topCategory, subCategory } = useRouteParams();
  const { handleViewItemListEvent } = useAnalytics();
  const { ref, inView } = useInView();
  const reportedCountRef = useRef(0);

  const searchParamsObj = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  // Check if any filters are active
  const hasFilters = useMemo(
    () => Object.keys(searchParamsObj).length > 0,
    [searchParamsObj],
  );

  const currencyKey = currentCountry.currencyKey || "EUR";

  const queryKey = useMemo(
    () => [
      "products",
      "paged",
      {
        languageId,
        gender,
        topCategoryId: topCategory?.id,
        subCategoryId: subCategory?.id,
        currency: currencyKey,
        ...searchParamsObj,
      },
    ],
    [languageId, gender, topCategory?.id, subCategory?.id, currencyKey, searchParamsObj],
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
  } = useInfiniteQuery<GetProductsPagedResponse>({
    queryKey,
    queryFn: ({ pageParam }) =>
      GetProductsPaged({
        limit: CATALOG_LIMIT,
        offset: pageParam as number,
        ...getProductsPagedQueryParams(
          {
            gender,
            topCategoryIds: topCategory?.id?.toString(),
            subCategoryIds: subCategory?.id?.toString(),
            currency: currencyKey,
            ...searchParamsObj,
          },
          dictionary,
        ),
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (acc, page) => acc + (page.products?.length || 0),
        0,
      );
      return totalFetched < (lastPage.total || 0) ? totalFetched : undefined;
    },
    // Only use initialData when there are no filters (base route)
    initialData: !hasFilters
      ? {
          pages: [{ products: firstPageItems, total }],
          pageParams: [0],
        }
      : undefined,
    // Cache behavior: Never refetch unless queryKey changes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // Data is fresh until queryKey changes
    gcTime: Infinity, // Keep in cache forever
  });

  const items = data?.pages.flatMap((page) => page.products || []) || [];
  const currentTotal = data?.pages[data.pages.length - 1]?.total || total;

  const isInitialLoading =
    (!data || data.pages.length === 0) && (isFetching || isLoading);

  useEffect(() => {
    reportedCountRef.current = 0;
  }, [queryKey]);

  useEffect(() => {
    if (items.length > reportedCountRef.current) {
      const newItems = items.slice(reportedCountRef.current);
      if (newItems.length > 0) {
        handleViewItemListEvent(newItems);
        reportedCountRef.current = items.length;
      }
    }
  }, [items.length, handleViewItemListEvent]);

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <ProductsGrid
        products={items}
        isLoading={isFetchingNextPage || isInitialLoading}
        total={currentTotal}
      />
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
    </div>
  );
}
