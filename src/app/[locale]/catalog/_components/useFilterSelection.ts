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

    const initItems = findInitialItems();
    const initValues = filterKey === "size"
        ? initItems.map((item: any) => item?.id?.toString())
        : initItems.map((item: any) => item?.name);

    const [selectedValues, setSelectedValues] = useState<string[]>(initValues);

    // Sync with URL changes
    useEffect(() => {
        if (!defaultValue) {
            setSelectedValues([]);
        }
    }, [defaultValue]);

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

