import { common_ProductFull } from "@/api/proto-http/frontend";
import { currencySymbols } from "@/constants";

export function getTotalProductQuantity(product: common_ProductFull): number {
    if (!product?.sizes || product.sizes.length === 0) {
        return 0;
    }

    return product.sizes.reduce((total, size) => {
        const quantity = parseInt(size.quantity?.value || "0");
        return total + quantity;
    }, 0);
}

export function getTotalProductValue(product: common_ProductFull): number {
    if (!product?.sizes || product.sizes.length === 0) {
        return 0;
    }

    const price = parseInt(
        product.product?.productDisplay?.productBody?.productBodyInsert?.price
            ?.value || "0",
    );
    const salePercentage = parseInt(
        product.product?.productDisplay?.productBody?.productBodyInsert
            ?.salePercentage?.value || "0",
    );
    const finalPrice =
        salePercentage > 0 ? price - (price * salePercentage) / 100 : price;

    return product.sizes.reduce((total, size) => {
        const quantity = parseInt(size.quantity?.value || "0");
        return total + quantity * finalPrice;
    }, 0);
}

export function sendViewItemEvent(
    currency: string,
    product: common_ProductFull,
    price: number,
    topCategory: string,
    subCategory: string,
) {
    const productBody =
        product.product?.productDisplay?.productBody?.productBodyInsert;
    const salePercentage = parseInt(
        product.product?.productDisplay?.productBody?.productBodyInsert
            ?.salePercentage?.value || "0",
    );
    const discount = (price * salePercentage) / 100;
    const totalValue = getTotalProductValue(product);
    const totalQuantity = getTotalProductQuantity(product);

    if (typeof window === "undefined" || !product) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "view_item",
        ecommerce: {
            currency: currencySymbols[currency],
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
                    item_category: topCategory || "not set",
                    item_category2: subCategory || "not set",
                    item_variant: productBody?.color || "",
                    price: price,
                    quantity: totalQuantity,
                },
            ],
        },
    });
}
