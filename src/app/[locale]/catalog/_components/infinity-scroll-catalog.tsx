"use client";

import { useEffect, useMemo } from "react";
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
  const { languageId } = useTranslationsStore((state) => state);
  const { gender, topCategory, subCategory } = useRouteParams();
  const { handleViewItemListEvent } = useAnalytics();
  const { ref, inView } = useInView();

  const searchParamsObj = useMemo(
    () => Object.fromEntries(searchParams.entries()),
    [searchParams],
  );

  const queryKey = useMemo(
    () => [
      "products",
      "paged",
      {
        languageId,
        gender,
        topCategoryId: topCategory?.id,
        subCategoryId: subCategory?.id,
        ...searchParamsObj,
      },
    ],
    [languageId, gender, topCategory?.id, subCategory?.id, searchParamsObj],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<GetProductsPagedResponse>({
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
      initialData: {
        pages: [{ products: firstPageItems, total }],
        pageParams: [0],
      },
      // Prevent refetch on mount when we have server-provided initialData
      refetchOnMount: false,
    });

  const items = data?.pages.flatMap((page) => page.products || []) || [];
  const currentTotal = data?.pages[data.pages.length - 1]?.total || total;

  // Track analytics when filters change
  useEffect(() => {
    if (items.length > 0 && items.length === firstPageItems.length) {
      handleViewItemListEvent(firstPageItems);
    }
  }, [queryKey, firstPageItems, items.length, handleViewItemListEvent]);

  // Load more when in view
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <ProductsGrid
        products={items}
        isLoading={isFetchingNextPage}
        total={currentTotal}
      />
      {hasNextPage && !isFetchingNextPage && <div ref={ref} />}
    </div>
  );
}
