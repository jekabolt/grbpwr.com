"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { common_Product } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT } from "@/constants";
import { useInView } from "react-intersection-observer";

import { serviceClient } from "@/lib/api";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useDataContext } from "@/components/contexts/DataContext";
import ProductsGrid from "@/app/[locale]/_components/product-grid";
import { getProductsPagedQueryParams } from "@/app/[locale]/catalog/_components/utils";

import { useRouteParams } from "./useRouteParams";

// Функция для отправки события view_item_list
const sendViewItemListEvent = (
  products: common_Product[],
  listName: string,
  listId: string,
) => {
  if (typeof window === "undefined" || !products.length) return;

  // Очищаем предыдущий ecommerce объект
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });

  // Отправляем событие view_item_list
  window.dataLayer.push({
    event: "view_item_list",
    ecommerce: {
      item_list_id: listId,
      item_list_name: listName,
      items: products.map((product, index) => ({
        item_id: product.id?.toString() || "",
        item_name:
          product.productDisplay?.productBody?.translations?.[0]?.name || "",
        item_brand:
          product.productDisplay?.productBody?.productBodyInsert?.brand || "",
        price:
          product.productDisplay?.productBody?.productBodyInsert?.price || 0,
        item_category:
          product.productDisplay?.productBody?.productBodyInsert
            ?.topCategoryId || "",
        index: index + 1,
        quantity: 1,
      })),
    },
  });
};

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

  // Функция для определения названия списка
  const getListName = () => {
    if (subCategory?.name) return subCategory.name;
    if (topCategory?.name) return topCategory.name;
    if (gender) return `${gender} Products`;
    return "Product Catalog";
  };

  // Функция для определения ID списка
  const getListId = () => {
    if (subCategory?.id) return `subcategory_${subCategory.id}`;
    if (topCategory?.id) return `category_${topCategory.id}`;
    if (gender) return `gender_${gender}`;
    return "catalog";
  };

  useEffect(() => {
    setItems(firstPageItems);
    setCurrentTotal(total);
    hasMoreRef.current = total >= CATALOG_LIMIT;
    pageRef.current = 2;
    setIsLoading(false);
    isRefetchingRef.current = false;

    // Отправляем событие view_item_list для первой страницы
    if (firstPageItems.length > 0) {
      setTimeout(() => {
        sendViewItemListEvent(firstPageItems, getListName(), getListId());
      }, 100); // Небольшая задержка для обеспечения инициализации dataLayer
    }
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

        const newProducts = response.products || [];
        setItems(newProducts);
        setCurrentTotal(response.total || 0);
        hasMoreRef.current = (response.total || 0) >= CATALOG_LIMIT;
        pageRef.current = 2;

        // Отправляем событие view_item_list для обновленного списка
        if (newProducts.length > 0) {
          sendViewItemListEvent(newProducts, getListName(), getListId());
        }
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

        const newProducts = response.products || [];
        setItems(newProducts);
        setCurrentTotal(response.total || 0);
        hasMoreRef.current = (response.total || 0) >= CATALOG_LIMIT;
        pageRef.current = 2;

        // Отправляем событие view_item_list для отфильтрованного списка
        if (newProducts.length > 0) {
          sendViewItemListEvent(
            newProducts,
            `Filtered ${getListName()}`,
            `filtered_${getListId()}`,
          );
        }
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

      const newProducts = response.products || [];
      pageRef.current += 1;

      setItems((prevItems) => {
        const updatedItems = [...prevItems, ...newProducts];
        hasMoreRef.current = updatedItems.length < currentTotal;

        // Отправляем событие view_item_list только для новых загруженных товаров
        if (newProducts.length > 0) {
          sendViewItemListEvent(
            newProducts,
            `${getListName()} - Page ${pageRef.current - 1}`,
            `${getListId()}_page_${pageRef.current - 1}`,
          );
        }

        return updatedItems;
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
