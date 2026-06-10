---
name: checkout-payment-method-isprod
description: Which Stripe card enum checkout sends (live vs test) is driven by the dictionary's isProd flag, not user input.
metadata:
  type: project
---

Checkout tags each order with a Stripe card payment-method enum: `PAYMENT_METHOD_NAME_ENUM_CARD` (live) or `..._CARD_TEST` (test). This live/test split is an **environment concern**, never user input or a persisted value — drive it from `dictionary.isProd` (the `common_Dictionary.isProd` flag from `GetHeroResponse`, exposed via `useDataContext()`).

**Why:** Historically the form hardcoded `..._CARD_TEST` as the default + every fallback, and no code path ever selected the live enum, so real shoppers risked routing through a test payment method (revenue risk flagged P0 in the impeccable checkout critique).

**How to apply:** Use the single helper `resolveCardPaymentMethod(isProd)` in `new-order-form/utils.tsx` at every seed/fallback site (form `defaultValues` in `index.tsx`, the validation fallback in `useValidatedOrder.ts`, and rehydration in `useOrderPersistence.ts`). It returns the live enum when `isProd` is true and degrades to TEST when `isProd` is unknown (so a misconfigured dictionary never silently charges real cards). Never trust a persisted/stale `paymentMethod` for the live/test decision. Related: [[impeccable-polish-followups]].
