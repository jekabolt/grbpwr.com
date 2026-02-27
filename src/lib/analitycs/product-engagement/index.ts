import { pushCustomEvent } from "../utils";

interface SizeGuideViewEvent {
  product_id: string;
  product_name: string;
  product_category: string;
  page_location: string;
}

interface OutOfStockClickEvent {
  product_id: string;
  product_name: string;
  size_id: number;
  size_name: string;
  product_category: string;
  product_price: number;
  currency: string;
}

interface ProductImageViewEvent {
  product_id: string;
  image_index: number;
  image_total: number;
  product_name: string;
}

interface ProductZoomEvent {
  product_id: string;
  product_name: string;
  product_category: string;
}

let lastImageViewTime = 0;
const IMAGE_VIEW_THROTTLE_MS = 500;

export function sendSizeGuideViewEvent(data: SizeGuideViewEvent): void {
  pushCustomEvent("size_guide_view", {
    product_id: data.product_id,
    product_name: data.product_name,
    product_category: data.product_category,
    page_location: data.page_location,
  });
}

export function sendOutOfStockClickEvent(data: OutOfStockClickEvent): void {
  pushCustomEvent("out_of_stock_click", {
    product_id: data.product_id,
    product_name: data.product_name,
    size_id: data.size_id,
    size_name: data.size_name,
    product_category: data.product_category,
    product_price: Math.max(0, data.product_price || 0),
    currency: data.currency,
  });
}

export function sendProductImageViewEvent(data: ProductImageViewEvent): void {
  const now = Date.now();
  if (now - lastImageViewTime < IMAGE_VIEW_THROTTLE_MS) {
    return;
  }
  lastImageViewTime = now;
  
  pushCustomEvent("product_image_view", {
    product_id: data.product_id,
    image_index: data.image_index,
    image_total: data.image_total,
    product_name: data.product_name,
  });
}

export function sendProductZoomEvent(data: ProductZoomEvent): void {
  pushCustomEvent("product_zoom", {
    product_id: data.product_id,
    product_name: data.product_name,
    product_category: data.product_category,
  });
}
