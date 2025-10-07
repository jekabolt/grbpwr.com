import { common_ProductFull } from "@/api/proto-http/frontend";

import { getTotalProductQuantity, getTotalProductValue } from "@/lib/utils";

export function sendAddToCartEvent(
    currency: string,
    product: common_ProductFull,
    price: number,
    topCategory: string,
    subCategory: string,
) {
    const productBody =
        product.product?.productDisplay?.productBody?.productBodyInsert;
    const translation =
        product.product?.productDisplay?.productBody?.translations?.[0];
    const salePercentage = parseInt(productBody?.salePercentage?.value || "0");
    const discount = (price * salePercentage) / 100;
    const totalValue = getTotalProductValue(product);
    const totalQuantity = getTotalProductQuantity(product);

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
            currency: currency,
            value: totalValue,
            items: [
                {
                    item_id: product.product?.id,
                    item_name: translation?.name || "",
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
