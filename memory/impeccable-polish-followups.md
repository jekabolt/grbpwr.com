---
name: impeccable-polish-followups
description: Open follow-ups left after the impeccable polish pass on the storefront (decisions deferred to the user)
metadata:
  type: project
---

During an `impeccable polish` pass (2026-06-08) over the commercial + account path, these
items remain open:

- **Hero centering** (`main-ads.tsx:81`) and auto-play archive video vs `prefers-reduced-motion`
  need browser confirmation (no browser tool was available in that session).
- **Content pages** were out of the agreed scope (commercial + account): faq, legal-notices,
  return, client-services, aftersale-services, order-status, unsubscribe. Not yet polished.

What WAS fixed: global `:focus-visible` ring (was stripped everywhere; later scoped to an
allowlist so text inputs/textarea get no box outline), render-time `window.innerWidth` →
`useMediaQuery` sweep, `#F0F0F0` theme-breaking banner → token, `PromoCode` invalid
`type="input"` → `button`, hero CLS aspect-ratio bug, generic image alts. Removed the PII/debug
`console.log`s (checkout submit, order-service, api.ts, useValidatedOrder), deleted the dead
`cookie-debud.tsx`, and stripped the artificial 500ms filter delay + dead loading apparatus from
`FilterOptionButtons`. Final small pass: add-to-cart sale price now full-contrast (only the
"€X - Y% =" prefix stays muted), `aria-label="close"` (navigation.close) on the `[x]` buttons,
and `ItemRow` deduped (shared `media`/`info`, only the Link-vs-div wrapper differs).
Identity is deliberately brutalist — see [[PRODUCT.md]]; polish preserved it.
