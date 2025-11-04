import { CATALOG_LIMIT } from "@/constants";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useDataContext } from "@/components/contexts/DataContext";
import { useServerActionsContext } from "@/components/contexts/ServerActionsContext";

import useFilterQueryParams from "./useFilterQueryParams";
import { getProductsPagedQueryParams } from "./utils";

export const useTotalProducts = ({
    gender,
    topCategoryId,
    subCategoryId,
    isModalOpen = true,
}: Props) => {
    const { dictionary } = useDataContext();
    const { GetProductsPaged } = useServerActionsContext();
    const queryClient = useQueryClient();
    const { defaultValue: sizeValue } = useFilterQueryParams("size");
    const { defaultValue: collectionValue } = useFilterQueryParams("collection");
    const { defaultValue: sortValue } = useFilterQueryParams("sort");
    const { defaultValue: orderValue } = useFilterQueryParams("order");
    const { defaultValue: saleValue } = useFilterQueryParams("sale");

    const queryKey = [
        "products",
        "total",
        {
            gender,
            topCategoryId,
            subCategoryId,
            size: sizeValue,
            collection: collectionValue,
            sort: sortValue,
            order: orderValue,
            sale: saleValue,
        },
    ];

    const { data: total = 0 } = useQuery({
        queryKey,
        queryFn: () =>
            GetProductsPaged({
                limit: CATALOG_LIMIT,
                offset: 0,
                ...getProductsPagedQueryParams(
                    {
                        topCategoryIds: topCategoryId?.toString(),
                        subCategoryIds: subCategoryId?.toString(),
                        gender: gender,
                        ...(sizeValue && { size: sizeValue }),
                        ...(collectionValue && { collection: collectionValue }),
                        ...(sortValue && { sort: sortValue }),
                        ...(orderValue && { order: orderValue }),
                        ...(saleValue && { sale: saleValue }),
                    },
                    dictionary,
                ),
            }).then((response) => response.total ?? 0),
        enabled: isModalOpen,
    });

    const resetTotal = () => {
        queryClient.invalidateQueries({ queryKey: ["products", "total"] });
    };

    return { total, resetTotal };
};

interface Props {
    gender: string;
    topCategoryId?: number;
    subCategoryId?: number;
    isModalOpen?: boolean;
}
