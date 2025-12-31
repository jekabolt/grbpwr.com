import { useDataContext } from "@/components/contexts/DataContext";
import { useRouteParams } from "./useRouteParams";

export function useSizeFiltering() {
    const { dictionary } = useDataContext();
    const { topCategory } = useRouteParams();
    const sizes = dictionary?.sizes || [];
    const categories = dictionary?.categories;

    const categoryData = topCategory?.id
        ? categories?.find((c) => c.id === topCategory.id)
        : undefined;
    const category = categoryData?.name || "";

    const isShoes = category.toLowerCase().includes("shoes");
    const isBottoms = category.toLowerCase().includes("bottoms");
    const isTailored = category.toLowerCase().includes("tailored");

    const filteredSizes = sizes.filter((size) => {
        if (!topCategory?.id) return true;

        const name = size.name?.toLowerCase() || "";
        const isNumeric = /^\d+(\.\d+)?$/.test(name);
        const isBottomsSize = /_\d+bo_[mf]$/.test(name);
        const isTailoredSize = /_\d+ta_[mf]$/.test(name);

        // If it's a shoes category, only show numeric sizes
        if (isShoes) return isNumeric;

        // If it's a bottoms category, only show bottoms sizes
        if (isBottoms) return isBottomsSize;

        // If it's a tailored category, only show tailored sizes
        if (isTailored) return isTailoredSize;

        // For other categories, show regular non-numeric sizes (exclude shoes, bottoms, and tailored)
        return !isNumeric && !isBottomsSize && !isTailoredSize;
    });

    const sizeOptions = filteredSizes
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        ?.map((s) => ({ ...s, name: s.name ?? "" }));


    return { sizeOptions, filteredSizes };
} 