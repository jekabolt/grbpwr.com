import { useDataContext } from "@/components/contexts/DataContext";
import { formatSizeName } from "@/lib/utils";
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

        if (isShoes) return isNumeric;

        if (isBottoms) return isBottomsSize;

        if (isTailored) return isTailoredSize;

        return !isNumeric && !isBottomsSize && !isTailoredSize;
    });

    const sizeOptions = filteredSizes
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        ?.map((s) => ({ ...s, name: formatSizeName(s.name || "") }));


    return { sizeOptions, filteredSizes };
} 