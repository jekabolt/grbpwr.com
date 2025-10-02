import { useSearchParams } from "next/navigation";
import { useRouteParams } from "./useRouteParams";

export function useAnalytics() {
    const searchParams = useSearchParams();
    const { gender, topCategory, subCategory } = useRouteParams();

    function getListName() {
        const hasFilters = Array.from(searchParams.entries()).length > 0;
        const filterPrefix = hasFilters ? 'Filtered ' : '';

        if (subCategory?.name) return `${filterPrefix}${subCategory.name}`;
        if (topCategory?.name) return `${filterPrefix}${topCategory.name}`;
        if (gender) return `${filterPrefix}${gender} Products`;
        return `${filterPrefix}Product Catalog`;
    }

    function getListId() {
        const searchParamsString = searchParams.toString();
        const filterSuffix = searchParamsString
            ? `_filtered_${searchParamsString.replace(/[^a-zA-Z0-9]/g, '_')}`
            : '';

        if (subCategory?.id) return `subcategory_${subCategory.id}${filterSuffix}`;
        if (topCategory?.id) return `category_${topCategory.id}${filterSuffix}`;
        if (gender) return `gender_${gender}${filterSuffix}`;
        return `catalog${filterSuffix}`;
    }

    return {
        listName: getListName(),
        listId: getListId(),
    }
}