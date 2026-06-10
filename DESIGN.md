---
name: grbpwr.com
description: Brutalist monospace storefront and archive for the grbpwr label.
colors:
  ink: "#000000"
  paper: "#ffffff"
  electric-blue: "#311eee"
  acid-yellow: "#cde100"
  inactive: "#cccccc"
  error: "#ff0000"
  visited-link: "#501089"
  overlay: "#00000066"
typography:
  display:
    fontFamily: "FeatureMono, system-ui, sans-serif"
    fontSize: "200px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  display-small:
    fontFamily: "FeatureMono, system-ui, sans-serif"
    fontSize: "110px"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "normal"
  body:
    fontFamily: "FeatureMono, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "FeatureMono, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
  full: "9999px"
spacing:
  edge: "10px"
  tight: "12px"
  group: "24px"
  section: "40px"
  page: "96px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-primary-hover:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  input-text:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
---

# Design System: grbpwr.com

## 1. Overview

**Creative North Star: "The Terminal Atelier"**

grbpwr.com is a fashion house run like a command line. A single monospace typeface (`FeatureMono`) speaks every word on the site, from a 12px care-label to a 200px display headline. There is no display/body pairing, no second voice, no decorative escape hatch. The identity lives in the *scale jump* and the *cadence* of that one mono face: tiny functional type sitting under giant type, both built from the same fixed-width letterforms. The surface is monochrome black on white (and a true inverted black theme), interrupted only by two committed accents. Everything is sharp-cornered and flat: depth is drawn with 1px rules, `mix-blend-exclusion`, and translucent overlays, never with shadow.

The register is **product** in its rigor and **editorial** in its restraint. Commerce flows (cart, checkout, account) carry full product-grade state coverage, but the skin stays severe so the garment is the only thing in the room with color and texture. This is an *authored object*, not a configured theme. If a screen could be mistaken for a default Shopify build, a warm-editorial template, or friendly SaaS chrome, it has failed.

This system explicitly rejects: generic Shopify/DTC templates, cream/sand "editorial-warm" palettes, rounded soft cards, drop-shadow ghost cards, gradient accents, pill-everything, and friendly SaaS chrome. Restraint and precision; nothing decorative for its own sake.

**Key Characteristics:**
- One monospace family carries display, body, label, data, and numerals.
- Extreme type-scale contrast: 12px functional ↔ 110/200px display, with little in between.
- Monochrome base (`#000`/`#fff`) plus exactly two committed accents.
- Flat by absolute rule: zero box-shadows anywhere in the codebase.
- Sharp corners: radius 0 is the default; full-pill is reserved for tags and circular controls.
- Severe, precise, deliberate. The garment is the hero; chrome stays quiet.

## 2. Colors

A monochrome system with two committed accents and a single muted neutral. Color is information, never decoration.

### Primary
- **Electric Blue** (`#311eee`): The interactive accent and brand highlight. Used for links and link-state text, accent fills (`bg-highlight`, ~15 sites), the `grbpwr[tier]` private-access mark, and the default text-selection paint. This is the one saturated voice that carries interactivity across the light theme.

### Secondary
- **Acid Yellow** (`#cde100`): The editorial selection highlight. Reserved for `::selection` inside navigation and editorial zones — the header, category lists, and featured items (`selection:bg-inverted`) — and for the occasional featured-link text. Rarer than blue by design; its scarcity is what makes it read as deliberate.

### Neutral
- **Ink** (`#000000`): All primary text and primary-action fills on the light theme; the page background on the dark theme.
- **Paper** (`#ffffff`): The page background on the light theme; all primary text on the dark theme.
- **Inactive** (`#cccccc`): Borders, dividers, disabled states, inactive tabs, and placeholder framing. A structural gray, not a text gray (see the named rule below).
- **Error** (`#ff0000`): Pure-red validation and error text only.
- **Visited Link** (`#501089`): Product and featured links after visit (`visited-link`).
- **Overlay** (`#00000066`, `rgba(0,0,0,0.4)`): Modal and cart-popup scrims.

### Named Rules
**The Two-Paint Rule.** Only two paints are ever added to the monochrome: Electric Blue for interaction, Acid Yellow for editorial selection. No third accent, no gradient, no tint. If a screen needs a new color to communicate, the hierarchy is wrong.

**The Theme-Inverts-Highlight Rule.** The dark theme (`.blackTheme`) is a true inversion — ink and paper swap — but it also mutes the highlight token to a neutral gray (`#535353`). Electric Blue is a *light-theme* accent. Do not assume blue accent fills survive onto dark surfaces; on dark, interactivity is carried by weight, underline, and the persistent blue selection, not by accent fills.

**The Structural-Gray Rule.** `#cccccc` (Inactive) is for borders, dividers, and disabled affordances — structure, not prose. It must never carry body copy or an empty-state message: at ~1.6:1 on paper it fails WCAG AA. Empty-state and informational text is always Ink, set uppercase.

## 3. Typography

**Display Font:** FeatureMono (with system-ui, sans-serif fallback)
**Body Font:** FeatureMono (the same family)
**Label/Mono Font:** FeatureMono (the same family)

**Character:** One fixed-width family does everything. Weights run Thin (100–300), Regular (400–500), and Bold (600–900). Hierarchy is built from *scale and weight*, never from a second typeface. The monospace cadence — even advance width, slab terminals — is the brand's fingerprint.

### Hierarchy
- **Display** (weight 500, 200px desktop / 110px mobile via `--text-giant` / `--text-giant-small`, line-height 1.25): Hero and section giants. `whitespace-nowrap`; the word is meant to dominate the viewport.
- **Body** (weight 400, 12px via `--text-base`, line-height ~1.5): The functional workhorse — product info, controls, navigation, data, legal copy. Yes, 12px is the base; the smallness against the giants is the system.
- **Label** (weight 400, 12px, uppercase): Eyebrows, control labels, section headers, badges. Same size as body; the uppercase transform and context distinguish it.

### Named Rules
**The One-Voice Rule.** Never introduce a second font family. Cap is one (FeatureMono). Display, body, button, label, numerals, and tabular data are all the same mono face at different sizes and weights. A serif/sans pairing here would read as indecision, not richness.

**The Scale-Jump Rule.** The contrast between 12px and 110/200px is intentional and load-bearing. Resist inventing a comfortable mid-scale ramp; the near-empty middle is what makes the giants feel like signage and the body feel like a control panel.

**The Mono-Cadence Rule.** Never apply negative letter-spacing to the display sizes to "tighten" them. FeatureMono is fixed-width; its rhythm is the point. Tracking stays `normal`.

## 4. Elevation

This system is **flat by absolute rule**. There are zero `box-shadow` declarations in the codebase, and that is correct. Depth and separation are conveyed entirely by: hairline **1px borders** (`border-textColor` for committed edges, `border-textInactiveColor` for quiet framing), **`mix-blend-exclusion`** (headers and overlaid labels invert against whatever imagery scrolls beneath them), and **translucent overlays** (`rgba(0,0,0,0.4)` scrims behind modals and the cart popup). Layering is positional and tonal, never lifted.

### Named Rules
**The No-Shadow Rule.** Shadows are forbidden. Not subtle, not "just for the modal" — none. A drop-shadow on a card is the single fastest way to turn this authored object into a generic DTC template. Separate with a 1px border or a tonal surface, or don't separate at all.

**The Blend-Not-Float Rule.** Chrome that sits over imagery (the fixed header, featured-item labels) uses `mix-blend-exclusion` so it reads against any background without a plate or shadow. The chrome blends into the image; it never floats above it.

## 5. Components

### Buttons
- **Shape:** Sharp (radius 0 / `rounded.none`). Full-pill (`rounded-full`) only for circular or tag-shaped controls.
- **Primary** (`main`): Ink fill, Paper text, with a 1px Ink border (`bg-textColor text-bgColor border border-textColor`); padding `10px 16px` at `lg`. The committed call to action.
- **Secondary** (`secondary`): Paper fill, Ink text, 1px Ink border. Same footprint, quieter weight.
- **Hover:** Primary and Secondary both **invert** on hover (fill and text swap). No scale, no shadow, no color shift — just the tonal flip. Transitions are quick (150–250ms).
- **Tertiary** (`underline`): Text-only with an underline; used for low-emphasis and in-flow actions. `underlineWithColors` renders the underline in Electric Blue for link-like emphasis.
- **Disabled:** Drops to Inactive fill/border with Paper text (`disabled:bg-textInactiveColor`); `cursor-not-allowed`. Loading swaps the label for an inline shimmer/`Loader`, preserving footprint.
- **Sizes:** `sm`/`default` (12px), `lg` (`10px 16px`), `giant` (`40px 64px`, display-scale text for hero CTAs).

### Inputs / Fields
- **Style:** A single **bottom rule**, not a box. `border-b border-textColor`, Paper background, radius 0, 12px mono text. No top/side borders, no fill, no inner shadow.
- **Focus:** Deliberately *no* box outline on text inputs — the caret and the bottom border already signal focus (a box there reads as intrusive). Disabled shifts the bottom border and text to Inactive.
- **Error:** Messages render in Error red, lowercase, at the small end of the scale.

### Cards / Containers
- **Corner Style:** Sharp (radius 0). Nested cards are forbidden.
- **Background:** Paper (or Ink on dark theme). No tint.
- **Shadow Strategy:** None — see Elevation. Separation is a 1px `border-textInactiveColor`.
- **Internal Padding:** `10px` (`p-2.5`) is the brutalist edge unit for popups and panels; content groups use `24px`/`40px` rhythm.

### Navigation
- **Style:** A fixed, 48px-tall (`h-12`) edge-pinned header at `inset-x-2.5`, transparent, rendered in `mix-blend-exclusion` so it inverts against the page. Links are 12px mono, uppercase. Selection inside nav paints Acid Yellow.
- **States:** Default/hover/active carried by weight and underline, not fills. Keyboard focus gets the deliberate 2px focus ring (see Do's).
- **Mobile:** Cart and menu collapse into edge-pinned popups (`vaul`/Radix dialogs) sliding from top/right; the dedicated `/cart` page is retired in favor of the popup.

### Signature: The Threshold Image Reveal
The brand's one piece of motion identity. Product imagery loads through a `threshold` filter animation — `grayscale(100%) contrast(200%) brightness(0.5)` resolving to full color over 0.4s ease-out — as if the image is *developing*. It is a state transition (load), never decoration, and it is the only orchestrated motion the product surfaces earn.

### Empty States
Always: an **Ink, uppercase** label (never Inactive gray), optionally followed by a single `simpleReverseWithBorder` CTA routing to the next useful surface (e.g. "explore collections" → `/catalog`, "start a return" → `/return`). The cart popup shows the label alone; close-to-keep-browsing is the affordance.

## 6. Do's and Don'ts

### Do:
- **Do** carry every word in FeatureMono. One family, scaled and weighted. (The One-Voice Rule.)
- **Do** keep the surface monochrome and add only Electric Blue (interaction) or Acid Yellow (editorial selection). (The Two-Paint Rule.)
- **Do** separate surfaces with 1px borders, `mix-blend-exclusion`, or tonal layering — never shadow. (The No-Shadow Rule.)
- **Do** set empty-state and informational text in Ink, uppercase. Reserve `#cccccc` for borders, dividers, and disabled states. (The Structural-Gray Rule.)
- **Do** keep corners sharp (radius 0). Full-pill is only for tags and circular controls.
- **Do** preserve the deliberate keyboard focus ring: 2px solid `var(--text)`, 2px offset, `:focus-visible` only, on interactive controls — but not on text inputs, where the caret and bottom border already signal focus.
- **Do** give every `prefers-reduced-motion` path a crossfade or instant fallback (the View Transition and threshold reveal already gate on it).
- **Do** meet WCAG 2.1 AA: body text ≥4.5:1, touch targets ≥44px, visible focus.

### Don't:
- **Don't** ship generic Shopify/DTC templates or anything that reads as a default theme rather than an authored object.
- **Don't** use cream/sand "editorial-warm" palettes. The base is true `#000`/`#fff`, never a warm-tinted near-white.
- **Don't** use rounded soft cards, drop-shadow ghost cards, gradient accents, or pill-everything.
- **Don't** introduce friendly SaaS chrome.
- **Don't** add a second typeface, or tighten the display sizes with negative letter-spacing. (The One-Voice / Mono-Cadence Rules.)
- **Don't** add any `box-shadow`. Zero is the count; keep it there.
- **Don't** put `#cccccc` (or any muted gray) on body copy, empty states, or placeholders — it fails contrast and softens the severity.
- **Don't** assume Electric Blue accent fills survive onto the dark theme; on dark, highlight mutes to gray. (The Theme-Inverts-Highlight Rule.)
