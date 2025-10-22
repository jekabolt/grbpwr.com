import { common_Product } from "@/api/proto-http/frontend";
import { useSearchParams } from "next/navigation";

import {
    sendSelectItemEvent,
    sendViewItemListEvent,
} from "@/lib/analitycs/product";

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
    const { gender, categoryName, subCategoryName, topCategory, subCategory } =
        useRouteParams();

    const hasFilters = Array.from(searchParams.entries()).length > 0;
    const filterPrefix = hasFilters ? "Filtered " : "";

    let listName = "";
    if (subCategory) {
        const decodedName = decodeUrlValue(subCategoryName);
        listName = `${filterPrefix}${decodedName}`;
    } else if (topCategory) {
        const decodedName = decodeUrlValue(categoryName);
        listName = `${filterPrefix}${decodedName}`;
    } else if (gender) {
        const decodedGender = decodeUrlValue(gender);
        listName = `${filterPrefix}${decodedGender} Products`;
    } else {
        listName = `${filterPrefix}Product Catalog`;
    }

    const searchParamsString = searchParams.toString();
    const filterSuffix = searchParamsString
        ? `_filtered_${searchParamsString.replace(/[^a-zA-Z0-9]/g, "_")}`
        : "";

    let listId = "";
    if (subCategory) {
        listId = `subcategory_${subCategoryName}${filterSuffix}`;
    } else if (topCategory) {
        listId = `category_${categoryName}${filterSuffix}`;
    } else if (gender) {
        listId = `gender_${gender}${filterSuffix}`;
    } else {
        listId = `catalog${filterSuffix}`;
    }

    const decodedCategoryName = decodeUrlValue(categoryName);
    const decodedSubCategoryName = decodeUrlValue(subCategoryName);

    function handleSelectItemEvent(product: common_Product) {
        sendSelectItemEvent(
            product,
            listName,
            listId,
            decodedCategoryName,
            decodedSubCategoryName,
        );
    }

    function handleViewItemListEvent(products: common_Product[]) {
        sendViewItemListEvent(
            products,
            listName,
            listId,
            decodedCategoryName,
            decodedSubCategoryName,
        );
    }

    return {
        listName,
        listId,
        handleSelectItemEvent,
        handleViewItemListEvent,
    };
}
