---
name: no-cart-route
description: There is no /cart page route by design; the cart is a drawer/popup, not a full screen.
metadata:
  type: project
---

The storefront has **no `/cart` route** (e.g. `/jp/en/cart` should not exist). The cart is a drawer/popup — `CartPopup` rendered via `src/components/flexible-layout.tsx` and `mobile-nav-cart` — never a standalone page.

**Why:** An old `src/app/[locale]/(checkout)/cart/page.tsx` route was leftover/forgotten and deleted on 2026-06-10. Nothing navigated to it.

**How to apply:** Don't add a `page.tsx` under `(checkout)/cart/`. The shared `cart/_components/*` (`CartPopup`, `CartProductsList`, `CartTotalPrice`, `ItemRow`, `CartItemSize`, `ProductRemoveButton`) still live there and ARE used by the drawer, checkout, and order-review screens — keep them; only the route page was removed. When the cart empties mid-checkout, redirect to home (`/${country}/${locale}`), not `/cart` (see `checkout-form-wrapper.tsx`). The `Disallow: /*/cart` line was also removed from `robots.txt`.
