import type {
  common_OrderItemInsert,
  NotifyMeRequest,
} from "@/api/proto-http/frontend";

import type { CartProduct } from "@/lib/stores/cart/store-types";

// This module is the single boundary where the storefront's cart identity becomes
// wire identity. R2/R3: an order line and a back-in-stock request address a variant
// by its public SKU (OrderItemInsert.variant_sku / NotifyMeRequest.variant_sku),
// never the internal (product_id, size_id) pair — which no longer exists on the
// storefront read path. Every call site (order validation, submission, notify)
// flows through these two builders.

// cartProductToOrderItemInsert maps one cart line to the wire order-item insert.
export function cartProductToOrderItemInsert(
  product: CartProduct,
): common_OrderItemInsert {
  return {
    variantSku: product.variantSku,
    quantity: product.quantity,
  };
}

// buildNotifyMeRequest maps a back-in-stock request to its wire shape.
export function buildNotifyMeRequest(args: {
  email: string;
  variantSku: string;
}): NotifyMeRequest {
  return {
    email: args.email,
    variantSku: args.variantSku,
  };
}
