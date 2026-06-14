# CLAUDE.md

Guidance for working in this repository. Keep changes minimal, match surrounding
code, and respect the brand's brutalist design language (see `DESIGN.md` /
`PRODUCT.md` — polish fixes defects, it never softens the visual language).

## What this is

`grbpwr.com` — the grbpwr label's storefront and archive. Next.js 15 App Router,
React 19 (React Compiler enabled), TypeScript, Tailwind. Commerce flows (catalog,
product, cart, checkout, account, orders) plus an editorial timeline/archive.

## Commands

```bash
pnpm dev        # dev server (Turbopack) on :3000
pnpm build      # production build — use to verify type/build correctness
pnpm lint       # next lint (ESLint)
pnpm format     # Prettier (import sort + tailwind class sort)
pnpm gen        # regenerate API client from the proto submodule
```

There is **no test suite**. Verify changes with `pnpm build` and by running the app.

## Architecture

- **Routing** — everything user-facing lives under `src/app/[locale]/`. Route
  groups: `(checkout)` (cart + checkout), `(content)` (static pages), plus
  `account/`, `catalog/`, `product/`, `timeline/`. SEO routes (`sitemap*.xml`,
  `robots.txt`) and route handlers live under `src/app/`.
- **i18n** — `next-intl`. Config in `src/i18n/` (`routing.ts`, `request.ts`).
  Locales: `en`, `de`, `fr`, `it`, `ja`, `ko`, `zh`. **All UI strings come from
  `messages/<locale>.json`** — never hardcode user-facing copy. When you add a key,
  add it to **every** locale file (`en` is the source of truth; mirror the shape).
- **API client** — `src/api/proto-http/` is **generated** from the `proto`
  submodule via `buf`. Do **not** edit it by hand; change the schema upstream and
  run `pnpm gen`.
- **State & data** — Zustand stores in `src/lib/stores/` for client state;
  TanStack Query (provider in `src/providers/`) for server data. Domain logic
  (cart, checkout, shipment, analytics) lives in `src/lib/`.
- **UI** — shared components in `src/components/` (`ui/` primitives built on Radix +
  CVA, plus carousels and contexts). Display font is `FeatureMono`.

## Conventions

- **TypeScript everywhere.** Follow existing patterns; prefer composing the
  `src/components/ui/` primitives over new bespoke components.
- **Design tokens & rules live in `DESIGN.md`.** Monochrome black/white with two
  accents (electric blue `#311eee`, acid yellow `#cde100`); square corners, hairline
  borders, 12px functional type, no decoration. Don't introduce rounded cards,
  shadows, or gradients.
- **Accessibility matters.** Maintain visible focus, contrast, touch targets, and
  `prefers-reduced-motion` handling (see the a11y notes in `PRODUCT.md`).
- **Env vars** are all `NEXT_PUBLIC_*` (browser-visible); see `README.md`. Never
  commit `.env`.
- **Formatting:** run `pnpm format` before committing; Prettier sorts imports and
  Tailwind classes.

## Gotchas

- `proto/` is a git **submodule** — after pulling, run `make submodules` (or
  `git submodule update --init --recursive`) if `src/api/proto-http/` looks stale,
  then `pnpm gen`.
- The `master` branch is primary; `beta` is the integration/preview branch.
- `.agents/`, `.impeccable/`, `memory/`, and `skills-lock.json` are **local design
  tooling/artifacts** — gitignored and must not be committed.
