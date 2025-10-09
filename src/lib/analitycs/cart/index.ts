import {
    common_OrderItem,
    common_ProductFull,
} from "@/api/proto-http/frontend";

export function sendAddToCartEvent(
    product: common_ProductFull,
    topCategory: string,
    subCategory: string,
) {
    const productBody =
        product.product?.productDisplay?.productBody?.productBodyInsert;
    const translation =
        product.product?.productDisplay?.productBody?.translations?.[0];
    const price = parseFloat(productBody?.price?.value || "0");
    const salePercentage = parseInt(productBody?.salePercentage?.value || "0");
    const discount = (price * salePercentage) / 100;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
            currency: "EUR",
            value: price,
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
                    quantity: 1,
                },
            ],
        },
    });
}

export function sendViewCartEvent(products: common_OrderItem[]) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const totalValue = products.reduce((sum, p) => {
        const price = parseFloat(p.productPrice || "0");
        const quantity = p.orderItem?.quantity || 1;
        return sum + price * quantity;
    }, 0);

    window.dataLayer.push({
        event: "view_cart",
        ecommerce: {
            currency: "EUR",
            value: totalValue,
            items: products.map((p) => ({
                item_id: p.sku || "",
                item_name: p.translations?.[0]?.name || "",
                discount:
                    (parseFloat(p.productPrice || "0") *
                        parseFloat(p.productSalePercentage || "0")) /
                    100,
                item_brand: p.productBrand,
                item_variant: p.color,
                price: parseFloat(p.productPrice || "0"),
                quantity: 1,
            })),
        },
    });
}

export function sendRemoveFromCartEvent(product: common_OrderItem, topCategory: string) {
    if (typeof window === "undefined" || !product) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    const price = parseFloat(product.productPrice || "0");
    const salePercentage = parseFloat(product.productSalePercentage || "0");
    const discount = (price * salePercentage) / 100;

    window.dataLayer.push({
        event: "remove_from_cart",
        ecommerce: {
            currency: "EUR",
            value: price,
            items: [
                {
                    item_id: product.sku,
                    item_name: product.translations?.[0]?.name,
                    item_brand: product.productBrand,
                    item_variant: product.orderItem?.productId?.toString() || "",
                    discount: discount,
                    item_category: topCategory,
                    price: product.productPrice,
                    quantity: 1
                },
            ],
        },
    });
}
