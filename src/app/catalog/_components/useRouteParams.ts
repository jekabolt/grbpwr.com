"use client";

import { useDataContext } from "@/components/contexts/DataContext";
import { resolveCategories } from "@/lib/categories-map";
import { useParams } from "next/navigation";

interface RouteParams {
    gender: string;
    categoryName: string;
    subCategoryName: string;
    topCategory?: any;
    subCategory?: any;
}

export function useRouteParams(): RouteParams {
    const { dictionary } = useDataContext();
    const routeParams = useParams() as { params?: string[] };
    const [gender, categoryName, subCategoryName] = routeParams?.params || [];

    const { topCategory, subCategory } = resolveCategories(
        dictionary?.categories,
        categoryName,
        subCategoryName,
    );

    return {
        gender,
        categoryName,
        subCategoryName,
        topCategory,
        subCategory,
    };
} 