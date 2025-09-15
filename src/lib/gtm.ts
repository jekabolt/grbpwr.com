// import { common_ProductFull } from "@/api/proto-http/frontend";

// // GTM Data Layer types
// interface GTMProduct {
//     item_id: string;
//     item_name: string;
//     item_brand?: string;
//     item_category?: string;
//     item_category2?: string;
//     price: number;
//     currency: string;
//     quantity: number;
//     item_variant?: string;
// }

// interface GTMAddToCartEvent {
//     event: string;
//     ecommerce: {
//         currency: string;
//         value: number;
//         items: GTMProduct[];
//     };
// }

// declare global {
//     interface Window {
//         dataLayer?: Object[];
//     }
// }

// /**
//  * Pushes an add_to_cart event to GTM dataLayer
//  */
// export function pushAddToCartEvent(
//     product: common_ProductFull,
//     selectedSizeId: string,
//     quantity: number = 1
// ) {
//     if (typeof window === "undefined" || !window.dataLayer) {
//         console.warn("GTM dataLayer not available");
//         return;
//     }

//     const productData = product.product?.productDisplay?.productBody;
//     const selectedSize = product.sizes?.find(size => size.sizeId?.toString() === selectedSizeId);

//     if (!productData) {
//         console.warn("Product data not available for GTM tracking");
//         return;
//     }

//     // Calculate price (with sale if applicable)
//     const basePrice = parseFloat(productData.productBodyInsert?.price?.value || "0");
//     const salePercentage = parseFloat(productData.productBodyInsert?.salePercentage?.value || "0");
//     const finalPrice = salePercentage > 0
//         ? basePrice * (1 - salePercentage / 100)
//         : basePrice;

//     const gtmProduct: GTMProduct = {
//         item_id: product.product?.id?.toString() || "",
//         item_name: productData.translations?.[0]?.name || "",
//         item_brand: productData.productBodyInsert?.brand || "",
//         item_category: getMainCategory(product),
//         item_category2: getSubCategory(product),
//         price: finalPrice,
//         currency: "USD", // Adjust if you support multiple currencies
//         quantity: quantity,
//         item_variant: getSizeName(selectedSizeId, product) || "",
//     };

//     const gtmEvent: GTMAddToCartEvent = {
//         event: "add_to_cart",
//         ecommerce: {
//             currency: "USD",
//             value: finalPrice * quantity,
//             items: [gtmProduct],
//         },
//     };

//     console.log("Pushing GTM add_to_cart event:", gtmEvent);
//     window.dataLayer.push(gtmEvent);
// }

// /**
//  * Get size name by size ID from product
//  */
// function getSizeName(sizeId: string, product: common_ProductFull): string | undefined {
//     // This would need to be implemented with access to the dictionary/size lookup
//     // For now, returning the sizeId as fallback
//     return sizeId;
// }

// /**
//  * Get main category name from product
//  */
// function getMainCategory(product: common_ProductFull): string {
//     // You might need to implement category lookup based on your data structure
//     // For now, returning a placeholder - adjust based on your category system
//     return product.tags?.[0]?.productTagInsert?.tag || "Unknown";
// }

// /**
//  * Get sub-category name from product
//  */
// function getSubCategory(product: common_ProductFull): string {
//     // You might need to implement sub-category lookup based on your data structure
//     // For now, returning a placeholder - adjust based on your category system
//     return product.tags?.[1]?.productTagInsert?.tag || "";
// }

// /**
//  * Push a custom event to GTM dataLayer
//  */
// export function pushCustomEvent(eventName: string, eventData: Record<string, any> = {}) {
//     if (typeof window === "undefined" || !window.dataLayer) {
//         console.warn("GTM dataLayer not available");
//         return;
//     }

//     window.dataLayer.push({
//         event: eventName,
//         ...eventData,
//     });
// }

// /**
//  * Clear ecommerce data from dataLayer (useful before new ecommerce events)
//  */
// export function clearEcommerceData() {
//     if (typeof window === "undefined" || !window.dataLayer) {
//         return;
//     }

//     window.dataLayer.push({
//         ecommerce: null,
//     });
// }
