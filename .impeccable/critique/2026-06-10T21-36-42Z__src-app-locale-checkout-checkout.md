---
target: checkout flow
total_score: 30
p0_count: 0
p1_count: 1
timestamp: 2026-06-10T21-36-42Z
slug: src-app-locale-checkout-checkout
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Submit button has explicit loading state (`index.tsx:443`), but text inputs have **no error-border** — `aria-invalid` is set (`form/index.tsx:115`) yet no `aria-invalid:` style exists; failure shows only as message text below. |
| 2 | Match System / Real World | 3 | Mostly natural, but `"phone number:"` label drops the trailing colon every sibling keeps, and `"1/3".."3/3"` stage numerals are jargon vs. named steps. |
| 3 | User Control and Freedom | 3 | Auto-advancing accordion re-**closes** downstream groups when an upstream field is edited (`useAutoGroupOpen.ts:100-104`) — progress appears to retreat. |
| 4 | Consistency and Standards | 3 | Strong vocabulary, undercut by two collapse-sign systems (arrow vs plus-minus, `fields-group-container.tsx:148`) and the promo input living in two different shapes (sidebar box vs mobile accordion). |
| 5 | Error Prevention | 3 | Good: per-field keyboard restrictions, city-in-country async verify, carrier auto-clear on region change. Weak: `termsOfService` defaults to `true` (`schema.ts:144`), pre-consenting to T&C. |
| 6 | Recognition Rather Than Recall | 3 | Saved-address selector + autocompletes reduce recall well, but gated/locked groups give **no inline reason** why payment is disabled (`useAutoGroupOpen.ts:59-63` only dims). |
| 7 | Flexibility and Efficiency | 3 | Apple/Google Pay + autocomplete + refresh persistence, but wallets are buried inside the gated 3/3 Payment group — no express one-tap path up top. |
| 8 | Aesthetic and Minimalist Design | 4 | Standout: severe monochrome, hairline borders, zero decoration, skeletons over spinners, restrained two-accent palette. |
| 9 | Error Recovery | 3 | `scrollToFirstError` + `focusGroup` navigate to the failing group, but a generic `"please fill in all required fields"` toast fires on any invalid submit, and a failed Stripe payment surfaces only as a transient toast (`useCheckoutSubmit.ts:329`) with no persistent inline banner. |
| 10 | Help and Documentation | 2 | No contextual help anywhere — no "why is this gated," no "secured by Stripe" reassurance, no VAT tooltip. T&C/privacy links are the extent of it. |
| **Total** | | **30/40** | **Good — solid product-grade, polish-stage. Held back by status visibility, help, and the auto-collapse control issue.** |

## Anti-Patterns Verdict

**LLM assessment:** Not slop. A genuinely brand-committed, product-grade checkout a Linear/Stripe-fluent user would trust. Clears every absolute ban: no gradient text, glassmorphism, side-stripe borders, over-rounded or ghost cards, pill chrome. The brutalist identity is pushed even into the Stripe PaymentElement appearance (`borderRadius: "0px"`, FeatureMono, 12px, hairline borders, `checkout-form-wrapper.tsx:152-188`). The skeleton system (three branch-specific skeletons that structurally mirror their real layouts) is the opposite of slop. The pervasive `variant="uppercase"` label treatment is the brand's deliberate register, not a decorative eyebrow.

**Deterministic scan:** `detect.mjs --json` over the checkout subtree + the cart components → **exit 0, 0 findings**, corroborated by an explicit 24-file cross-check. No rule fired (side-stripe, gradient-text, gray-on-color, ai-color-palette, bounce-easing, overused-font, layout-transition all clean). Page-level analyzers (single-font, em-dash, buzzword, numbered-markers, etc.) are gated to full HTML documents and correctly did not run on TSX components. No false positives. (An intermediate mis-shelled run scanned the tool's own bundled files and was discarded.)

**Visual overlays:** Unavailable — no browser-automation tool is exposed in this session, so no user-visible overlay was produced. Both assessments are source-level; interaction timing, real focus-ring rendering, and actual mobile overflow should be confirmed against the live `http://localhost:3000/<country>/<locale>/checkout`.

**Where they agree:** detector-clean + not-slop both point to a disciplined visual layer. The detector caught nothing the review missed because the remaining problems are *semantic config and behavior* (error-state styling, gating feedback, payment reassurance) that a markup scanner cannot see — exactly the class of defect that needs human/LLM judgment.

## Overall Impression

A confident brutalist checkout whose spine — sequential gating as a real state machine, structurally-matched skeletons, Stripe wiring with idempotency + env-correct payment routing, refresh-surviving persistence — is genuinely strong. The gaps are at the edges and the emotional layer: the highest-stakes moment (entering a card) has zero trust reassurance, failing fields don't visually signal failure, and the accordion can make progress appear to retreat. The single biggest opportunity is the payment moment.

## What's Working

1. **Structurally-matched skeletons, not spinners** — `resolveCheckoutSkeleton` (`checkout-skeleton.tsx:356-405`) picks a signed-in / guest / login skeleton that mirrors the real DOM and shares the live form's padding logic, so there's near-zero load-time layout shift. Above the product bar.
2. **Brutalist identity carried into third-party chrome** — the Stripe `Appearance` is overridden to `borderRadius: "0px"`, FeatureMono, 12px, uppercase labels, hairline `#B4B4B4` borders (`checkout-form-wrapper.tsx:152-188`). Most teams let Stripe's rounded default break their language; this refuses to, which is why it never reads as a template.
3. **Defense-in-depth on order correctness** — re-validation on currency/carrier/country change (`useValidatedOrder.ts:94-117`), cart-outdated single-toast redirect, idempotency keys, and `paymentMethod` always re-resolved from `dictionary.isProd` on hydrate so a stale TEST enum can't follow a shopper into production (`useOrderPersistence.ts:131-134`). Real product-grade state coverage, not happy-path.

## Priority Issues

**[P1] No security/trust reassurance at the payment moment.**
- **Why it matters:** Highest-anxiety, highest-abandon point in the funnel; cold social/drop traffic has no prior trust. There is no "secured by Stripe," lock cue, or encryption microcopy anywhere near `PaymentElement` (`payment-fields-group.tsx:124-156`); the `checkout` namespace has no such key. First-timers get no signal this is safe.
- **Fix:** Add one restrained on-brand line under the PaymentElement (uppercase 12px `text-textInactiveColor`, e.g. "PAYMENTS SECURED · STRIPE") + optional small lock glyph; reconfirm the total adjacent. Monochrome, no badge soup. i18n key across all 7 locales.
- **Suggested command:** `$impeccable delight` (reassurance) + `$impeccable polish`

**[P2] Text inputs have no error-state border — errors are message-only.**
- **Why it matters:** `aria-invalid` is correctly set (`form/index.tsx:115`) but no `aria-invalid:` style exists and `Input` keeps its black border on error (`input.tsx:16`). On the dense 10-field shipping panel, a user scanning for what's wrong gets only small red captions; the field itself doesn't signal failure. Weakens Nielsen #1 and error recovery, and hurts the keyboard/AT path.
- **Fix:** Add an `aria-invalid:border-errorColor` (and `aria-invalid:border-b-errorColor` for bottom-border inputs) state in the input/form-control so the failing field is visually distinct.
- **Suggested command:** `$impeccable harden` + `$impeccable audit`

**[P2] Auto-collapsing accordion re-closes downstream progress on upstream edits.**
- **Why it matters:** `handleFormChange` deletes downstream groups from the open set when an upstream group becomes incomplete/invalid (`useAutoGroupOpen.ts:100-104`). Fixing a typo in email/address after reaching payment can visibly collapse the payment section — progress appears to retreat, a control-and-freedom and emotional valley.
- **Fix:** Track an "everOpened" set; once a group has been visited keep it open on later upstream edits and only gate the submit, don't re-collapse. Or animate the collapse so it reads as intentional.
- **Suggested command:** `$impeccable clarify` + `$impeccable polish`

**[P3] Gated/disabled groups never explain their precondition.**
- **Why it matters:** Locked steps only dim to `text-textInactiveColor` (`fields-group-container.tsx:83-88`). A first-timer sees a greyed "3/3 PAYMENT" with no "complete shipping to continue," so the gating reads as broken rather than sequential.
- **Fix:** When a group is disabled, render a one-line inline reason beside the dimmed title (e.g. "COMPLETE SHIPPING TO UNLOCK"). i18n it.
- **Suggested command:** `$impeccable clarify`

**[P3] No `prefers-reduced-motion` guard on loaders / accordion transitions.**
- **Why it matters:** `globals.css` guards only the route view-transition. The keyframe loaders (`loader.tsx:43,56,72`) and the collapse-arrow `transition-transform` (`fields-group-container.tsx:164`) run regardless of the user's reduced-motion preference — misses the brand's own stated motion discipline and WCAG 2.3.3.
- **Fix:** Wrap the keyframe loaders and chevron transitions in `motion-reduce:animate-none` / a `prefers-reduced-motion` query, matching the discipline already applied to view transitions.
- **Suggested command:** `$impeccable animate`

## Persona Red Flags

**Casey (distracted one-handed mobile):** Mobile place-order CTA is well placed at `bottom-3` (`index.tsx:380-403`), but the mobile order-summary overlay also occupies the bottom band (`index.tsx:286-305`), so the summary toggle and primary CTA compete for the same thumb territory. Promo apply/discard sits in a `py-1.5` container (`PromoCode.tsx:77`) and the collapse chevrons are icon-only with no enforced 44px hit area — sub-44px tap targets. Persistence is genuinely good — interrupted sessions survive (`useOrderPersistence.ts:102-144`).

**Riley (stress tester):** Empty cart mid-flow → a bare 100ms timer `router.replace`s to home with no notice (`checkout-form-wrapper.tsx:60-79`), racy against async cart hydration. Product names truncate (`mobile-products-carousel.tsx:80`), but the place-order label concatenates `place order` + formatted price with no truncation (`index.tsx:245`) — a long locale verb + large `incl. vat` amount could overflow the fixed-width mobile CTA. Name fields block emoji/script via regex; `additionalAddress`/`company` allow a wider set worth checking for overflow.

**Jordan (first-timer):** No orientation to the 3-stage gated flow beyond `"1/3".."3/3"` numerals; nothing says it's sequential or what unlocks the next stage. No "secured" cue at payment (see P1). Pre-checked T&C consent (`termsOfService: true`, `schema.ts:144`) means a first-timer never actively consents.

## Minor Observations

- `phone number:` i18n value drops the trailing colon every sibling label keeps — label-column inconsistency.
- The clickable radio `Label` card (`radio-group.tsx:63`) gets no focus ring; keyboard focus lands only on the tiny 12px dot, not the card.
- `freeShipmentCarrierId={2}` is a magic number duplicated in `index.tsx:420` and `payment-fields-group.tsx:111`.
- `orderAmount` initializes to `1000` (`checkout-form-wrapper.tsx:134`) as a Stripe Elements placeholder before real validation — harmless but the first Elements mount uses a fake amount.

## Questions to Consider

1. Is the auto-collapse-on-upstream-edit (`useAutoGroupOpen.ts:100-104`) an intentional "force re-review," or an unintended side effect? It materially shapes the perceived-progress curve.
2. Is there a deliberate reason wallets (Apple/Google Pay) are gated behind 3/3 rather than offered as an express path up top? That's the single biggest conversion lever for returning mobile users.
3. Is the absence of any "secured by Stripe" signal a deliberate brutalist stance, and is it worth the conversion cost at the highest-stakes step?
4. On empty cart mid-flow, would a brief "your cart is empty" interstitial better match the brand's deliberate register than a silent redirect?
