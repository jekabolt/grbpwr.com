import { useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { common_Colorway } from "@/api/proto-http/frontend";

import {
  sendSelectItemEvent,
  sendViewItemListEvent,
} from "@/lib/analitycs/product";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";

import { useRouteParams } from "./useRouteParams";

function decodeUrlValue(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function useAnalytics() {
  const searchParams = useSearchParams();
  const { currentCountry } = useTranslationsStore((s) => s);
  const { gender, categoryName, subCategoryName, topCategory, subCategory } =
    useRouteParams();

  const searchParamsString = searchParams.toString();

  const { listName, listId } = useMemo(() => {
    const hasFilters = searchParamsString.length > 0;
    const filterPrefix = hasFilters ? "Filtered " : "";
    // Keep item_list_id low-cardinality: a stable `_filtered` marker, not the
    // full query string. Embedding the raw params spawned a distinct list id
    // per filter combination and fragmented the GA4 list reports.
    const filterSuffix = hasFilters ? "_filtered" : "";

    let name = "";
    let id = "";

    if (subCategory) {
      const decodedName = decodeUrlValue(subCategoryName);
      name = `${filterPrefix}${decodedName}`;
      id = `subcategory_${subCategoryName}${filterSuffix}`;
    } else if (topCategory) {
      const decodedName = decodeUrlValue(categoryName);
      name = `${filterPrefix}${decodedName}`;
      id = `category_${categoryName}${filterSuffix}`;
    } else if (gender) {
      const decodedGender = decodeUrlValue(gender);
      name = `${filterPrefix}${decodedGender} Products`;
      id = `gender_${gender}${filterSuffix}`;
    } else {
      name = `${filterPrefix}Product Catalog`;
      id = `catalog${filterSuffix}`;
    }

    return { listName: name, listId: id };
  }, [
    searchParamsString,
    subCategory,
    topCategory,
    gender,
    categoryName,
    subCategoryName,
  ]);

  const decodedCategoryName = useMemo(
    () => decodeUrlValue(categoryName),
    [categoryName],
  );
  const decodedSubCategoryName = useMemo(
    () => decodeUrlValue(subCategoryName),
    [subCategoryName],
  );
  const currencyKey = currentCountry.currencyKey || "EUR";

  const handleSelectItemEvent = useCallback(
    (product: common_Colorway) => {
      sendSelectItemEvent(
        product,
        listName,
        listId,
        decodedCategoryName,
        decodedSubCategoryName,
        currencyKey,
      );
    },
    [
      listName,
      listId,
      decodedCategoryName,
      decodedSubCategoryName,
      currencyKey,
    ],
  );

  const handleViewItemListEvent = useCallback(
    (products: common_Colorway[]) => {
      sendViewItemListEvent(
        products,
        listName,
        listId,
        decodedCategoryName,
        decodedSubCategoryName,
        currencyKey,
      );
    },
    [
      listName,
      listId,
      decodedCategoryName,
      decodedSubCategoryName,
      currencyKey,
    ],
  );

  return {
    listName,
    listId,
    handleSelectItemEvent,
    handleViewItemListEvent,
  };
}
