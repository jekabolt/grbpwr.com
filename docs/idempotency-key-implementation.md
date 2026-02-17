# Idempotency Key Implementation

## Overview

The idempotency key is used to associate pre-orders with payment intent IDs on the backend. This ensures that different customers get different PaymentIntents even with identical carts, and prevents duplicate payment intents for the same checkout session.

## Implementation Details

### 1. Storage Management (`src/lib/checkout/idempotency-key.ts`)

Created a utility module to manage idempotency keys in localStorage:

- **`getOrCreateIdempotencyKey()`**: Retrieves existing key or generates a new UUID v4
- **`clearIdempotencyKey()`**: Removes the key from storage
- **`refreshIdempotencyKey()`**: Replaces the current key with a new one

The key is stored in localStorage under the key `"checkout-idempotency-key"`.

### 2. Validation Flow (`src/lib/cart/validate-cart-items.ts`)

Updated `validateCartItems()` to:
- Automatically get or create an idempotency key before validation
- Include the key in the `ValidateOrderItemsInsert` API request

This ensures every validation request includes a consistent idempotency key for the current checkout session.

### 3. Order Completion Flows

Updated two locations where orders are successfully completed to refresh the idempotency key:

#### a. Direct Payment Flow (`src/app/[locale]/(checkout)/checkout/_components/new-order-form/index.tsx`)
- After successful Stripe card payment confirmation
- Called alongside `clearCart()` and `clearFormData()`

#### b. Redirect Payment Flow (`src/app/[locale]/(checkout)/order/[uuid]/[email]/_components/order-page.tsx`)
- When returning from Stripe with `redirect_status=succeeded`
- Called alongside `clearCart()`

## Lifecycle

1. **First Validation**: When user first validates cart items, a new idempotency key is generated and stored
2. **Subsequent Validations**: Same key is reused throughout the checkout session
3. **Order Success**: Key is refreshed (old one cleared, new one generated) for the next checkout session
4. **Payment Failure**: Key is retained, allowing retry with the same payment intent

## Benefits

- Prevents duplicate payment intents for the same user session
- Allows backend to associate validation requests with payment intents
- Supports payment retry scenarios (failed payments keep the same key)
- Automatic cleanup after successful orders

## Proto Definition

The `idempotency_key` field was added to `ValidateOrderItemsInsertRequest` in the proto definition:

```protobuf
message ValidateOrderItemsInsertRequest {
  repeated common.OrderItemInsert items = 1;
  string promo_code = 2;
  int32 shipment_carrier_id = 3;
  string country = 4;
  common.PaymentMethodNameEnum payment_method = 5;
  string currency = 6;
  string idempotency_key = 7; // Client-generated UUID per checkout session
}
```
