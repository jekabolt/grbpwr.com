import { common_ProductFull } from "@/api/proto-http/frontend";

import { getTotalProductQuantity, getTotalProductValue } from "@/lib/utils";

export function sendViewItemEvent(
    currency: string,
    product: common_ProductFull,
    price: number,
    topCategory: string,
    subCategory: string,
) {
    const productBody =
        product.product?.productDisplay?.productBody?.productBodyInsert;
    const salePercentage = parseFloat(productBody?.salePercentage?.value || "0");
    const discount = (price * salePercentage) / 100;
    const totalValue = getTotalProductValue(product);
    const totalQuantity = getTotalProductQuantity(product);

    if (typeof window === "undefined" || !product) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "view_item",
        ecommerce: {
            currency: currency,
            value: totalValue,
            items: [
                {
                    item_id: product.product?.sku || "",
                    item_name:
                        product.product?.productDisplay?.productBody?.translations?.[0]
                            .name || "",
                    affiliation: "GRBPWR STORE",
                    discount: discount,
                    index: product.product?.id,
                    item_brand: productBody?.brand,
                    item_category: topCategory || "",
                    item_category2: subCategory || "",
                    item_variant: productBody?.color || "",
                    price: price,
                    quantity: totalQuantity,
                },
            ],
        },
    });
}
