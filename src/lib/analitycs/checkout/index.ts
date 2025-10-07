import { common_OrderItem } from "@/api/proto-http/frontend";

export function sendBeginCheckoutEvent(
  currency: string,
  products: common_OrderItem[],
) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });

  const totalValue = products.reduce((sum, p) => {
    const price = parseFloat(p.productPriceWithSale || p.productPrice || "0");
    const quantity = p.orderItem?.quantity || 1;
    return sum + price * quantity;
  }, 0);

  window.dataLayer.push({
    event: "begin_checkout",
    ecommerce: {
      currency: currency,
      value: totalValue,
      items: products.map((p) => ({
        item_id: p.sku,
        item_name: p.translations?.[0]?.name,
        item_brand: p.productBrand,
        item_variant: p.color,
        discount: (parseFloat(p.productPrice || "0") * parseFloat(p.productSalePercentage || "0")) / 100,
        price: p.productPrice,
        quantity: 1,
      })),
    },
  });
}

export function sendAddShippingInfoEvent(currency: string, products: common_OrderItem[], shippingCarrier: string) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ ecommerce: null });

  const totalValue = products.reduce((sum, p) => {
    const price = parseFloat(p.productPriceWithSale || p.productPrice || "0");
    const quantity = p.orderItem?.quantity || 1;
    return sum + price * quantity;
  }, 0);

  window.dataLayer.push({
    event: "add_shipping_info",
    ecommerce: {
      currency: currency,
      value: totalValue,
      shipping_tier: shippingCarrier,
      items: products.map((p) => ({
        item_id: p.sku,
        item_name: p.translations?.[0]?.name,
        item_brand: p.productBrand,
        item_variant: p.color,
        discount: (parseFloat(p.productPrice || "0") * parseFloat(p.productSalePercentage || "0")) / 100,
        price: p.productPrice,
        quantity: 1,
      })),
    },
  });
}
