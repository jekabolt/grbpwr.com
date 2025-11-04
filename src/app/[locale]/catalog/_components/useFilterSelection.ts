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

    // Find initial selected item(s)
    const findInitialItem = () => {
        if (!defaultValue) return null;

        if (filterKey === "size") {
            return items.find((item: any) => item.name === defaultValue);
        } else {
            return items.find((item: any) => item.name?.toLowerCase() === defaultValue?.toLowerCase());
        }
    };

    const initItem = findInitialItem();
    const initValue = filterKey === "size"
        ? (initItem as any)?.id?.toString()
        : (initItem as any)?.name;

    const [selectedValues, setSelectedValues] = useState<string[]>(
        initValue ? [initValue] : [],
    );

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

        // Convert IDs to names for size filter
        let filterValue: string | undefined;
        if (filterKey === "size") {
            const names = newSelected
                .map((id) => items.find((item: any) => String(item.id) === id)?.name?.toLowerCase())
                .filter(Boolean)
                .join(",");
            filterValue = names || undefined;
        } else {
            filterValue = newSelected[0] || undefined;
        }

        handleFilterChange(filterValue);
    };

    return {
        selectedValues,
        handleToggle,
    };
}

