import { common_OrderItem } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { useMemo } from "react";
import { getSubCategoryName, getTopCategoryName } from "../categories-map";
import { useTranslationsStore } from "../stores/translations/store-provider";
import { sendRemoveFromCartEvent, sendViewCartEvent } from "./cart";
import { SizeMap } from "./utils";

export function useCartAnalytics({ finalProducts }: { finalProducts: (common_OrderItem | undefined)[] }) {
    const { dictionary } = useDataContext();
    const { currentCountry } = useTranslationsStore((state) => state);
    const currency = currentCountry.currencyKey || "EUR";

    const validProducts = finalProducts.filter((p): p is common_OrderItem => p !== undefined);

    const topCategoryId = validProducts.find((i) => i.topCategoryId)?.topCategoryId || 0;
    const subCategoryId = validProducts.find((i) => i.subCategoryId)?.subCategoryId || 0;

    const topCategoryName = getTopCategoryName(dictionary?.categories || [], topCategoryId) || "";
    const subCategoryName = getSubCategoryName(dictionary?.categories || [], subCategoryId) || "";

    const sizeMap: SizeMap = useMemo(() => {
        const sizes = dictionary?.sizes || [];
        return sizes.reduce<SizeMap>((acc, s) => {
            if (s.id != null && s.name) {
                acc[s.id] = s.name.trim();
            }
            return acc;
        }, {});
    }, [dictionary?.sizes]);

    function handleViewCartEvent() {
        sendViewCartEvent(validProducts, topCategoryName, subCategoryName, currency, sizeMap);
    }

    function handleRemoveFromCartEvent(product: common_OrderItem) {
        const topCategory = getTopCategoryName(
            dictionary?.categories || [],
            product.topCategoryId || 0,
        ) || "";

        const subCategory = getSubCategoryName(
            dictionary?.categories || [],
            product.subCategoryId || 0,
        ) || "";

        sendRemoveFromCartEvent(product, topCategory, subCategory, currency, sizeMap);
    }

    return {
        topCategoryName,
        subCategoryName,
        handleViewCartEvent,
        handleRemoveFromCartEvent,
    }
}
