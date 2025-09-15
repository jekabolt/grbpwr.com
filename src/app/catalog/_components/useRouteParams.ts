"use client";

import { useDataContext } from "@/components/contexts/DataContext";
import { resolveCategories } from "@/lib/categories-map";
import { useCurrency } from "@/lib/stores/currency/store-provider";
import { useParams } from "next/navigation";
import { parseRouteParams } from "./utils";

interface RouteParams {
    gender: string;
    categoryName: string;
    subCategoryName: string;
    topCategory?: any;
    subCategory?: any;
}

export function useRouteParams(): RouteParams {
    const { dictionary } = useDataContext();
    const { selectedLanguage } = useCurrency((state) => state);
    const routeParams = useParams() as { params?: string[] };
    const { gender, categoryName, subCategoryName } = parseRouteParams(routeParams.params);
    const { topCategory, subCategory } = resolveCategories(
        dictionary?.categories,
        selectedLanguage,
        categoryName,
        subCategoryName,
    );

    return {
        gender: gender || "",
        categoryName,
        subCategoryName,
        topCategory,
        subCategory,
    };
} 