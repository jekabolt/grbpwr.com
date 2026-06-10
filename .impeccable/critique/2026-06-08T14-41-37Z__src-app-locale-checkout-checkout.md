---
target: checkout flow
total_score: 29
p0_count: 1
p1_count: 2
timestamp: 2026-06-08T14-41-37Z
slug: src-app-locale-checkout-checkout
---
## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Loading/disabled coverage is thorough, but the disabled place-order button never says *why* it's disabled; status lives only in a transient toast. |
| 2 | Match System / Real World | 3 | Good vocabulary ("1/3", business-day ETA, free-shipping strikethrough), broken by the `CARD_TEST` enum and raw `save`/`cancel` labels. |
| 3 | User Control and Freedom | 3 | Accordion lets users revisit groups, but emptying the cart silently redirects to **home** (`checkout-form-wrapper.tsx:69`), not cart. |
| 4 | Consistency and Standards | 3 | Strong `FieldsGroupContainer` vocabulary, undercut by mixed translated/untranslated labels and two collapse-sign systems. |
| 5 | Error Prevention | 3 | Char-stripping, city/country verification, per-country phone validation are excellent; pre-checked terms defeats a safeguard. |
| 6 | Recognition Rather Than Recall | 3 | Address/city autocomplete, saved-address selector, persisted identity reduce recall well; promo field `readOnly` until focus is an oddity. |
| 7 | Flexibility and Efficiency | 3 | Guest + signed-in + saved-address + wallet paths; no keyboard "continue to next section", gating relies on scroll + auto-open. |
| 8 | Aesthetic and Minimalist Design | 4 | Brutalist restraint is exemplary; accent disciplined to the single primary action; no decorative noise. |
| 9 | Error Recovery | 2 | No error summary, no focus-to-first-error; submit smooth-scrolls to a group without moving focus, so AT users get no announcement. |
| 10 | Help and Documentation | 2 | No contextual help on declined cards beyond raw Stripe text; no "need help?"; no explanation of the test payment method. |
| **Total** | | **29/40** | **Good — solid foundation, weak areas in recovery/help and a P0 config defect.** |

## Anti-Patterns Verdict

**LLM assessment:** Not slop. This is a deliberately engineered, brutalist-consistent commerce surface with genuine product-grade depth: sequential accordion gating with a real completeness/validation state machine (`useAutoGroupOpen.ts`), Stripe PaymentElement with idempotency keys and failure-path analytics (`useCheckoutSubmit.ts`), form state persisted across refresh and country-change (`useOrderPersistence.ts`), and re-added keyboard focus rings (`globals.css:74-96`). A category-fluent user would largely trust it — but would pause at a few raw edges: a `CARD_TEST` enum as the live default, pre-checked terms, and a misspelled `"sjyrniesu 10"` placeholder.

**Deterministic scan:** `detect.mjs --json` over 29 checkout/cart/UI TSX files → exit 0, **0 findings**, no rule fired. Clean. No false positives to adjudicate. The slop tells here are *semantic config defects* the markup detector cannot see, not visual anti-patterns — agreement between scan and review is that the visual layer is disciplined; the problems are in defaults and flow.

**Visual overlays:** Unavailable — no browser automation in this session. No reliable user-visible overlay was produced; source-level review only.

## Overall Impression

A confident, well-architected brutalist checkout whose *spine* (gating, persistence, Stripe wiring, component vocabulary) is genuinely strong, but whose *defaults and edges* carry one shipping-blocker and two trust gaps. The single biggest opportunity: the payment moment is the highest-anxiety step and currently has zero reassurance plus a config that never selects the live card enum.

## What's Working

1. **Sequential gating is a real state machine, not theater** — `useAutoGroupOpen.ts:42-110` computes per-group completeness *and* validation-error state, auto-opens the next group, and re-collapses downstream groups when an upstream group regresses.
2. **Persistence survives the refresh-mid-flow scenario** — `useOrderPersistence.ts:100-134` rehydrates form data plus a dedicated country-change stash for email/promo. This is the case that breaks most checkouts.
3. **Restrained, consistent brutalist vocabulary** — `FieldsGroupContainer` is reused for every collapsible region with accent reserved for the single primary action. Aesthetic-minimalist earns full marks (4/4).

## Priority Issues

**[P0] Checkout never selects the live card enum; terms pre-checked.**
- **Why it matters:** `defaultData.paymentMethod = "PAYMENT_METHOD_NAME_ENUM_CARD_TEST"` (`schema.ts:159`) and `useValidatedOrder.ts:54` falls back to the same TEST enum when empty. `normalizeStripeCardPaymentMethod` (`utils.tsx:123-142`) only *normalizes* an existing string — no code path in the form ever chooses the live `PAYMENT_METHOD_NAME_ENUM_CARD`. If the backend trusts this enum, real shoppers route through a test method (revenue risk). Separately, `termsOfService: true` (`schema.ts:144`) pre-accepts legal consent — a GDPR/dark-pattern liability in EU markets.
- **Fix:** Default `paymentMethod` to the live enum (or `undefined`, forcing explicit selection) and confirm the backend contract; default `termsOfService` to `false` and block submit until the user checks it.
- **Suggested command:** `$impeccable harden`

**[P1] No reassurance at the payment moment.**
- **Why it matters:** This is peak anxiety. There's no "secured by Stripe" / lock signal and no order-total reconfirmation beside the card field; worse, the PaymentElement is wrapped in `opacity-50 pointer-events-none` while Stripe initializes (`payment-fields-group.tsx:117-153`), so a slow init looks *broken/greyed* at the scariest instant. Peak-end rule: this is what users remember.
- **Fix:** Add a quiet "payment secured by Stripe" line + lock glyph above the card field, reconfirm the total adjacent to it, and replace the opacity-dim with a proper skeleton.
- **Suggested command:** `$impeccable delight` (reassurance) + `$impeccable polish`

**[P1] No error summary or focus management on invalid submit.**
- **Why it matters:** `scrollToFirstError` (`useCheckoutSubmit.ts:89-118`) smooth-scrolls to a *group* and shows a generic toast but never moves focus to the offending field and lists nothing. Keyboard/screen-reader users get no announcement; sighted users hunt a ~10-field form for red text. This is why Error Recovery scored lowest (2/4).
- **Fix:** On invalid submit, render an error summary linking to each failing field and programmatically `focus()` the first invalid input with `aria-live`.
- **Suggested command:** `$impeccable clarify` + `$impeccable audit`

**[P2] Shipping address group exceeds cognitive-load budget (~10 fields at once).**
- **Why it matters:** When `showAddressForm` is true, `AddressFields` renders firstName, lastName, country, address, [state], city, postalCode, additionalAddress, company, phone in one open panel (`shipping-fields-group.tsx:284-390`) plus the shipping-method radio group. >4-choices failure and the emotional valley both live here.
- **Fix:** Lead with the autocomplete and disclose manual fields progressively, or visually sub-group with labels and breathing room.
- **Suggested command:** `$impeccable layout` + `$impeccable distill`

**[P3] Untranslated/stub/dev strings break the brand surface.**
- **Why it matters:** Raw `save`/`cancel` (`shipping-fields-group.tsx:166,177`) appear in English in non-English locales; placeholder `"sjyrniesu 10"` (`address-autocomplete.tsx:155`) is a misspelled stub; cart Suspense fallback ships literal `"add shell, loading..."` in `text-9xl text-yellow-400` (`cart/page.tsx:34-35`) — and `yellow-400` isn't even the committed `#cde100` token.
- **Fix:** Route all labels through `t()`, replace the stub with a localized hint or empty, replace the cart fallback with a brand-correct skeleton.
- **Suggested command:** `$impeccable typeset` + `$impeccable polish`

## Persona Red Flags

**Casey (distracted mobile):** Promo apply/discard button row is `py-1.5` and the lg button is `py-2.5` (`PromoCode.tsx:77,90`; `button.tsx:94`) — **below the 44px touch minimum**, a known a11y gap that persists. The mobile place-order button and the fixed order-summary overlay both sit at the bottom (`index.tsx:344-366,258`), crowding the thumb arc. Persistence is strong — no flag there.

**Riley (stress tester):** Emptying the cart mid-checkout ejects to **home**, not cart, with no message (`checkout-form-wrapper.tsx:64-71`). `placeOrderLabel` concatenates label + formatted price with no truncation guard (`index.tsx:215`) — a long localized string + large currency can overflow the button. Rapid promo apply/discard/apply toggles `isApplied` client-side without re-validating server state.

**Jordan (first-timer):** No up-front orientation to the 3-stage model; disabled downstream groups give no hint *why* they're locked (looks broken); disabled place-order button never says what's missing; zero "secured" copy at payment maximizes uncertainty at the riskiest step.

## Minor Observations

- `FormMessage` is `lowercase text-xs` (`form/index.tsx:190`) — on-brand, but the tiny/muted error text collides directly with the flagged contrast a11y gap.
- Complimentary-shipping toast uses `duration={Infinity}` (`index.tsx:444`) while *error* toasts auto-dismiss — promotional message outlives the error message, an inverted priority.
- Two collapse-sign vocabularies (arrow for top-level stage, plus-minus for sub-section) are applied by ad-hoc props with sound but undocumented rationale.

## Questions to Consider

1. Why does an empty cart eject to the homepage rather than the cart page where items can be re-added — strategy or default?
2. What guarantees a real shopper is ever switched to the live card enum before `submitNewOrder`, and is that switch covered by a test?
3. Is the absence of any "secured by Stripe" signal a deliberate brutalist stance, and is it worth the conversion cost at the highest-stakes step?
4. Where does the "identity is non-negotiable" principle yield to "commerce flows get product-grade coverage" — e.g. should the ~10-field shipping panel break brutalist show-everything honesty for progressive disclosure?
