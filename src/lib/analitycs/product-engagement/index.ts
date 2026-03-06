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

interface ProductImageSwipeEvent {
  product_id: string;
  product_name: string;
  product_category: string;
  from_index: number;
  to_index: number;
  total_images: number;
  swipe_direction: "next" | "previous";
}

interface ProductZoomEvent {
  product_id: string;
  product_name: string;
  product_category: string;
  zoom_method: "double_click" | "pinch" | "button";
}

interface ProductDetailsExpansionEvent {
  product_id: string;
  product_name: string;
  section_name: "description" | "composition" | "care";
  action: "expand" | "collapse";
}

interface NotifyMeIntentEvent {
  product_id: string;
  product_name: string;
  product_category: string;
  size_id?: number;
  size_name?: string;
  action: "opened" | "submitted" | "closed_without_submit";
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

export function sendProductImageSwipeEvent(data: ProductImageSwipeEvent): void {
  pushCustomEvent("product_image_swipe", {
    product_id: data.product_id,
    product_name: data.product_name,
    product_category: data.product_category,
    from_index: data.from_index,
    to_index: data.to_index,
    total_images: data.total_images,
    swipe_direction: data.swipe_direction,
  });
}

export function sendProductZoomEvent(data: ProductZoomEvent): void {
  pushCustomEvent("product_zoom", {
    product_id: data.product_id,
    product_name: data.product_name,
    product_category: data.product_category,
    zoom_method: data.zoom_method,
  });
}

export function sendProductDetailsExpansionEvent(data: ProductDetailsExpansionEvent): void {
  pushCustomEvent("product_details_expansion", {
    product_id: data.product_id,
    product_name: data.product_name,
    section_name: data.section_name,
    action: data.action,
  });
}

export function sendNotifyMeIntentEvent(data: NotifyMeIntentEvent): void {
  pushCustomEvent("notify_me_intent", {
    product_id: data.product_id,
    product_name: data.product_name,
    product_category: data.product_category,
    size_id: data.size_id,
    size_name: data.size_name,
    action: data.action,
  });
}
