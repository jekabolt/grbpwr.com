import { useEffect, useState } from "react";

import { useDataContext } from "@/components/contexts/DataContext";

import useFilterQueryParams from "./useFilterQueryParams";

interface UseFilterSelectionProps {
    filterKey: "size" | "collection";
    multiSelect?: boolean;
}

export function useFilterSelection({
    filterKey,
    multiSelect = false,
}: UseFilterSelectionProps) {
    const { dictionary } = useDataContext();
    const { defaultValue, handleFilterChange } = useFilterQueryParams(filterKey);

    const items = dictionary?.[filterKey === "size" ? "sizes" : "collections"] || [];

    const findInitialItems = () => {
        if (!defaultValue) return [];

        const values = defaultValue.split(",");
        return values
            .map(val => items.find((item: any) => item.name?.toLowerCase() === val.toLowerCase()))
            .filter(Boolean);
    };

    const computeSelectedValues = () => {
        const initItems = findInitialItems();
        return filterKey === "size"
            ? initItems.map((item: any) => item?.id?.toString())
            : initItems.map((item: any) => item?.name);
    };

    const [selectedValues, setSelectedValues] = useState<string[]>(computeSelectedValues);

    // Re-sync with the URL on every param change (back/forward, cleared filters),
    // and once the dictionary resolves on a cold deep-link load. Keyed on
    // `items.length` (a stable primitive) to avoid a re-render loop from `items`'
    // changing array reference.
    useEffect(() => {
        setSelectedValues(computeSelectedValues());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue, items.length]);

    const handleToggle = async (value: string) => {
        let newSelected: string[];

        if (multiSelect) {
            newSelected = selectedValues.includes(value)
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
        } else {
            newSelected = selectedValues.includes(value) ? [] : [value];
        }

        setSelectedValues(newSelected);

        let filterValue: string | undefined;
        if (filterKey === "size") {
            const names = newSelected
                .map((id) => items.find((item: any) => String(item.id) === id)?.name?.toLowerCase())
                .filter(Boolean)
                .join(",");
            filterValue = names || undefined;
        } else {
            filterValue = newSelected.join(",") || undefined;
        }

        handleFilterChange(filterValue);
    };

    return {
        selectedValues,
        handleToggle,
    };
}

