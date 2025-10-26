import { common_OrderItem } from "@/api/proto-http/frontend";
import { useDataContext } from "@/components/contexts/DataContext";
import { getSubCategoryName, getTopCategoryName } from "../categories-map";
import { sendRemoveFromCartEvent, sendViewCartEvent } from "./cart";

export function useCartAnalytics({ finalProducts }: { finalProducts: (common_OrderItem | undefined)[] }) {
    const { dictionary } = useDataContext();

    const validProducts = finalProducts.filter((p): p is common_OrderItem => p !== undefined);

    const topCategoryId = validProducts.find((i) => i.topCategoryId)?.topCategoryId || 0;
    const subCategoryId = validProducts.find((i) => i.subCategoryId)?.subCategoryId || 0;

    const topCategoryName = getTopCategoryName(dictionary?.categories || [], topCategoryId) || "";
    const subCategoryName = getSubCategoryName(dictionary?.categories || [], subCategoryId) || "";

    function handleViewCartEvent() {
        sendViewCartEvent(validProducts, topCategoryName, subCategoryName);
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

        sendRemoveFromCartEvent(product, topCategory, subCategory);
    }

    return {
        topCategoryName,
        subCategoryName,
        handleViewCartEvent,
        handleRemoveFromCartEvent,
    }
}