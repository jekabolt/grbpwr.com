import { common_Product } from "@/api/proto-http/frontend";

export function sendViewItemListEvent(
    products: common_Product[],
    listName: string,
    listId: string,
) {
    if (typeof window === "undefined" || !products.length) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: "view_item_list",
        ecommerce: {
            item_list_id: listId,
            item_list_name: listName,
            items: products.map((product, index) => ({
                item_id: product.id?.toString() || "",
                item_name:
                    product.productDisplay?.productBody?.translations?.[0]?.name || "",
                item_brand:
                    product.productDisplay?.productBody?.productBodyInsert?.brand || "",
                price:
                    product.productDisplay?.productBody?.productBodyInsert?.price || 0,
                item_category:
                    product.productDisplay?.productBody?.productBodyInsert
                        ?.topCategoryId || "",
                index: index + 1,
                quantity: 1,
            })),
        },
    });
};

export function selectItemEvent(product: common_Product, listName: string, listId: string, index: number) {
    if (typeof window === "undefined" || !product) return;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ ecommerce: null });

    window.dataLayer.push({
        event: 'select_item',
        ecommerce: {
            item_list_id: listId,
            item_list_name: listName,
            items: [{
                item_id: product.id?.toString() || '',
                item_name: product.productDisplay?.productBody?.translations?.[0]?.name || '',
                item_brand: product.productDisplay?.productBody?.productBodyInsert?.brand || '',
                price: product.productDisplay?.productBody?.productBodyInsert?.price || 0,
                item_category: product.productDisplay?.productBody?.productBodyInsert?.topCategoryId || '',
                index: index + 1,
                quantity: 1
            }]
        }
    });
}