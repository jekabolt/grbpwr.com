import { common_OrderItem } from "@/api/proto-http/frontend";

interface AnalyticsItem {
  item_id: string;
  item_name?: string;
  item_brand?: string;
  item_variant?: string;
  discount: number;
  price: number;
  quantity: number;
}

interface EcommerceEvent {
  event: string;
  ecommerce: {
    currency: string;
    value: number;
    items: AnalyticsItem[];
    [key: string]: any;
  };
}

const calculateTotalValue = (products: common_OrderItem[]): number => {
  return products.reduce((sum, product) => {
    const price = parseFloat(product.productPriceWithSale || product.productPrice || "0");
    const quantity = product.orderItem?.quantity || 1;
    return sum + price * quantity;
  }, 0);
};

const mapProductsToAnalyticsItems = (products: common_OrderItem[]): AnalyticsItem[] => {
  return products.map((product) => {
    const originalPrice = parseFloat(product.productPrice || "0");
    const salePercentage = parseFloat(product.productSalePercentage || "0");
    const quantity = product.orderItem?.quantity || 1;

    return {
      item_id: product.sku || '',
      item_name: product.translations?.[0]?.name || '',
      item_brand: product.productBrand || '',
      item_variant: product.orderItem?.productId?.toString() || '',
      discount: (originalPrice * salePercentage) / 100,
      price: originalPrice,
      quantity,
    };
  });
};


const initializeDataLayer = (): void => {
  if (typeof window === 'undefined') return;

  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).dataLayer.push({ ecommerce: null });
};

const pushAnalyticsEvent = (event: EcommerceEvent): void => {
  try {
    if (typeof window === 'undefined') {
      console.warn('Analytics: Window object not available (SSR)');
      return;
    }

    const dataLayer = (window as any).dataLayer;
    if (!dataLayer) {
      console.warn('Analytics: dataLayer not initialized');
      return;
    }

    dataLayer.push(event);
  } catch (error) {
    console.error('Analytics: Failed to push event', error);
  }
};

const validateProducts = (products: common_OrderItem[]): boolean => {
  if (!Array.isArray(products) || products.length === 0) {
    console.warn('Analytics: Invalid or empty products array');
    return false;
  }
  return true;
};

export function sendBeginCheckoutEvent(
  products: common_OrderItem[],
): void {
  if (!validateProducts(products)) return;

  initializeDataLayer();

  const event: EcommerceEvent = {
    event: 'begin_checkout',
    ecommerce: {
      currency: 'EUR',
      value: calculateTotalValue(products),
      items: mapProductsToAnalyticsItems(products),
    },
  };

  pushAnalyticsEvent(event);
}

export function sendAddShippingInfoEvent(
  products: common_OrderItem[],
  shippingCarrier: string
): void {
  if (!validateProducts(products)) return;

  initializeDataLayer();

  const event: EcommerceEvent = {
    event: 'add_shipping_info',
    ecommerce: {
      currency: 'EUR',
      value: calculateTotalValue(products),
      shipping_tier: shippingCarrier,
      items: mapProductsToAnalyticsItems(products),
    },
  };

  pushAnalyticsEvent(event);
}

export function sendAddPaymentInfoEvent(
  products: common_OrderItem[],
  paymentMethod: string
): void {
  if (!validateProducts(products)) return;

  initializeDataLayer();

  const event: EcommerceEvent = {
    event: 'add_payment_info',
    ecommerce: {
      currency: 'EUR',
      value: calculateTotalValue(products),
      payment_type: paymentMethod,
      items: mapProductsToAnalyticsItems(products),
    },
  };

  pushAnalyticsEvent(event);
}

export function sendPurchaseEvent(
  products: common_OrderItem[],
  transactionId: string,
): void {
  if (!validateProducts(products)) return;

  initializeDataLayer();

  const event: EcommerceEvent = {
    event: 'purchase',
    ecommerce: {
      currency: 'EUR',
      value: calculateTotalValue(products),
      transaction_id: transactionId,
      items: mapProductsToAnalyticsItems(products),
    },
  };

  pushAnalyticsEvent(event);
}