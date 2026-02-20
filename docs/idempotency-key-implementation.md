# Idempotency Key Implementation

## Overview

The idempotency key associates pre-orders with payment intent IDs on the backend. Keys are **server-generated** and returned in `ValidateOrderItemsInsert` responses. The client stores and sends them for retries and refreshes to ensure idempotent behavior.

## Implementation Details

### 1. Storage Management (`src/lib/checkout/idempotency-key.ts`)

Utilities for server-generated idempotency keys in localStorage:

- **`getStoredIdempotencyKey()`**: Returns the stored key, or `null` if none exists
- **`setIdempotencyKey(key)`**: Stores the key from the server response (called when `ValidateOrderItemsInsert` returns `idempotency_key` for CARD/CARD_TEST)
- **`clearIdempotencyKey()`**: Removes the key (called after successful payment or "Payment already completed" error)

Storage key: `"checkout-idempotency-key"`. Plain string value (no expiry – server owns lifecycle).

### 2. Validation Flow (`src/lib/cart/validate-cart-items.ts`)

`validateCartItems()` implements:

1. **First validation**: Omit `idempotency_key` from the request
2. **Retry / page refresh**: Send stored `idempotency_key` from previous response
3. **Response handling**: If `response.idempotency_key` is present (for CARD/CARD_TEST), store it via `setIdempotencyKey()`. If it differs from the stored value (session rotation), overwrite.
4. **Error "Payment already completed for this session..."**: Clear stored key, retry once without `idempotency_key`

### 3. Error Handling

| Error message | Cause | Action |
|---------------|-------|--------|
| "Payment already completed for this session. Please clear your checkout and start a new order." | PaymentIntent for this session was already paid | Clear stored key, retry validation without key; on repeated failure, show toast |
| "payment unavailable" / "failed to create payment intent" | Stripe problem or misconfiguration | Show error toast, optionally retry later |
| Other validation errors | Various | Show generic "Something went wrong" toast |

### 4. Order Completion Flows

Two locations clear the idempotency key after successful payment:

#### a. Direct Payment Flow (`src/app/[locale]/(checkout)/checkout/_components/new-order-form/index.tsx`)
- After successful Stripe card payment confirmation
- Called alongside `clearCart()` and `clearFormData()`

#### b. Redirect Payment Flow (`src/app/[locale]/(checkout)/order/[uuid]/[email]/_components/order-page.tsx`)
- When returning from Stripe with `redirect_status=succeeded` (e.g. 3DS)
- Called alongside `clearCart()`

## Lifecycle

1. **First validation**: User adds items, clicks checkout → call `ValidateOrderItemsInsert` without `idempotency_key` → store `response.idempotency_key` (CARD/CARD_TEST only)
2. **Retries / refreshes**: Send stored key; if response returns a new key, update stored value
3. **Order success**: Clear key from localStorage; next checkout starts fresh
4. **"Payment already completed" error**: Clear key, retry without key; if retry fails, show toast

## Proto Definition

```protobuf
message ValidateOrderItemsInsertRequest {
  ...
  string idempotency_key = 7; // Optional: key from previous response; same key = same payment session
}

message ValidateOrderItemsInsertResponse {
  ...
  string idempotency_key = 9; // Server-generated key; client stores and sends on subsequent requests
}
```

## Compatibility

- Clients that never send `idempotency_key` continue to work; each request creates a new session
- Clients that do not store or send the key do not get idempotent behavior across retries or rotation
