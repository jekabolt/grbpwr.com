import { useDataContext } from "@/components/contexts/DataContext";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { useRouteParams } from "./useRouteParams";

export function useSizeFiltering() {
    const { dictionary } = useDataContext();
    const { languageId } = useTranslationsStore((state) => state);
    const { topCategory } = useRouteParams();
    const sizes = dictionary?.sizes || [];
    const categories = dictionary?.categories;

    const categoryData = topCategory?.id
        ? categories?.find((c) => c.id === topCategory.id)
        : undefined;
    const translation = categoryData?.translations?.find(
        (t) => t.languageId === languageId,
    ) || categoryData?.translations?.[0];
    const category = translation?.name;

    const isShoes = category?.toLowerCase().includes("shoes");

    const filteredSizes = sizes.filter((size) => {
        if (!topCategory?.id) return true;

        const name = size.name?.toLowerCase() || "";
        const isNumeric = /^\d+(\.\d+)?$/.test(name);

        return isShoes ? isNumeric : !isNumeric;
    });

    const sizeOptions = filteredSizes
        ?.sort((a, b) => (a.id ?? 0) - (b.id ?? 0))
        ?.map((s) => ({ ...s, name: s.name ?? "" }));

    return { sizeOptions, filteredSizes };
} 