import type {
  common_OrderItemInsert,
  NotifyMeRequest,
} from "@/api/proto-http/frontend";

import type { CartProduct } from "@/lib/stores/cart/store-types";

// TODO(final-bump): the intermediate PR6 contract still addresses order items and
// NotifyMe by the internal (product_id, size_id) pair. R2/R3 replace both with the
// public variant_sku (OrderItemInsert.variant_sku, NotifyMeRequest.variant_sku).
//
// This module is the single boundary where the storefront's cart identity becomes
// wire identity. When the final bump lands, switch these two builders here (reading
// a variant SKU off the cart line / notify form) and every call site — order
// validation, order submission, back-in-stock — follows without further edits.

// cartProductToOrderItemInsert maps one cart line to the wire order-item insert.
export function cartProductToOrderItemInsert(
  product: CartProduct,
): common_OrderItemInsert {
  return {
    productId: product.id,
    quantity: product.quantity,
    sizeId: Number(product.size),
  };
}

// buildNotifyMeRequest maps a back-in-stock request to its wire shape.
export function buildNotifyMeRequest(args: {
  email: string;
  productId: number;
  sizeId: number;
}): NotifyMeRequest {
  return {
    email: args.email,
    productId: args.productId,
    sizeId: args.sizeId,
  };
}
