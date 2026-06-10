---
name: pricing-single-base-currency
description: Products carry one base price value; storefront only swaps the currency symbol per country (no real FX conversion)
metadata:
  type: project
---

A product's `prices` array (proto `common_ProductPrice[]`) in practice holds a **single base entry** (observed: `{currency:"CNY", price:"150"}`). The storefront does **not** convert currencies: `useProductPricing` does `prices.find(currency===currencyKey) || prices[0]`, so for most countries the match fails and it shows the **same numeric value** with the user's local currency symbol (e.g. us/en renders `150 £`, jp shows `¥150`).

**Why:** Affects anything that reports price+currency (JSON-LD offers, OG `product:price:*`, Merchant feeds). Emitting the raw `prices` currency leaks CNY to everyone.

**How to apply:** Derive the display currency from the **locale** (canonical country), not from the price record. See `currencyForLocale` / `productOfferForLocale` in `src/lib/structured-data.ts`. Currency↔locale map mirrors `CANONICAL_COUNTRY_BY_LOCALE`: en→GBP, fr/de/it→EUR, ja→JPY, zh→CNY, ko→KRW. If real per-currency pricing is ever entered in admin, the exact-currency match in `productOfferForLocale` will pick it up automatically.
