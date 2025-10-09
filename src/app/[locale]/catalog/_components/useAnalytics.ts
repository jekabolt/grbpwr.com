import { useSearchParams } from "next/navigation";
import { useRouteParams } from "./useRouteParams";

export function useAnalytics() {
    const searchParams = useSearchParams();
    const { gender, categoryName, subCategoryName, topCategory, subCategory } = useRouteParams();

    function decodeUrlValue(value: string): string {
        try {
            return decodeURIComponent(value);
        } catch {
            return value;
        }
    }

    function getListName() {
        const hasFilters = Array.from(searchParams.entries()).length > 0;
        const filterPrefix = hasFilters ? 'Filtered ' : '';

        if (subCategory) {
            const decodedName = decodeUrlValue(subCategoryName);
            return `${filterPrefix}${decodedName}`;
        }
        if (topCategory) {
            const decodedName = decodeUrlValue(categoryName);
            return `${filterPrefix}${decodedName}`;
        }
        if (gender) {
            const decodedGender = decodeUrlValue(gender);
            return `${filterPrefix}${decodedGender} Products`;
        }
        return `${filterPrefix}Product Catalog`;
    }

    function getListId() {
        const searchParamsString = searchParams.toString();
        const filterSuffix = searchParamsString
            ? `_filtered_${searchParamsString.replace(/[^a-zA-Z0-9]/g, '_')}`
            : '';

        if (subCategory) return `subcategory_${subCategoryName}${filterSuffix}`;
        if (topCategory) return `category_${categoryName}${filterSuffix}`;
        if (gender) return `gender_${gender}${filterSuffix}`;
        return `catalog${filterSuffix}`;
    }

    return {
        listName: getListName(),
        listId: getListId(),
    }
}