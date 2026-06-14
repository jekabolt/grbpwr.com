# grbpwr.com

Storefront and archive for the **grbpwr** label — a brutalist, monospace e‑commerce
site built with the Next.js App Router. It sells current product and presents the
brand's identity and history (timeline), with full commerce flows: catalog, product,
cart, checkout (Stripe), account, and order management.

- **Production:** https://grbpwr.com
- **Design system:** see [`DESIGN.md`](./DESIGN.md)
- **Product overview:** see [`PRODUCT.md`](./PRODUCT.md)

## Stack

- **Framework:** Next.js 15 (App Router, React 19, React Compiler) — TypeScript
- **Styling:** Tailwind CSS, `FeatureMono` display/body type
- **i18n:** `next-intl` — locales: `en`, `de`, `fr`, `it`, `ja`, `ko`, `zh`
- **State/data:** Zustand (client stores) + TanStack Query (server cache)
- **Payments:** Stripe (`@stripe/react-stripe-js`)
- **API client:** generated from the [`proto`](./proto) submodule via `buf`
- **Package manager:** pnpm
- **Hosting:** Vercel

## Prerequisites

- Node.js (see `browserslist` / Vercel for the supported runtime)
- [pnpm](https://pnpm.io/)
- [buf](https://buf.build/) — only needed to regenerate the API client (`make proto`)

## Getting started

```bash
# 1. Clone with the proto submodule
git clone --recurse-submodules git@github.com:jekabolt/grbpwr.com.git
cd grbpwr.com

# 2. Install dependencies
pnpm install

# 3. Initialize the submodule and generate the API client
make init          # = submodules + clean + proto

# 4. Create .env (see below), then run the dev server
pnpm dev           # next dev --turbo → http://localhost:3000
```

If you cloned without `--recurse-submodules`, run `make submodules` first.

## Environment

Create a `.env` file in the project root:

```bash
NEXT_PUBLIC_BACKEND_URL=https://backend.grbpwr.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...      # address autocomplete in checkout
NEXT_PUBLIC_GTM_ID=GTM-...               # analytics (optional in dev)
```

All variables are `NEXT_PUBLIC_*` (consumed in the browser). `.env*` files are
gitignored — never commit secrets.

## Scripts

| Command         | Description                                                        |
| --------------- | ----------------------------------------------------------------- |
| `pnpm dev`      | Start the dev server (Turbopack) on `:3000`                       |
| `pnpm build`    | Production build                                                  |
| `pnpm start`    | Serve the production build                                        |
| `pnpm lint`     | Run ESLint (`next lint`)                                          |
| `pnpm format`   | Format the codebase with Prettier                                |
| `pnpm gen`      | Pull latest `proto` and regenerate the API client                |
| `make init`     | Init submodules, clean, and generate proto                       |
| `make proto`    | Regenerate the API client only (`buf generate`)                  |

## Project layout

```
src/
  app/                  # App Router
    [locale]/           # All localized routes (next-intl)
      (checkout)/       # cart + checkout flow
      (content)/        # static/content pages
      account/          # account, orders, returns
      catalog/          # catalog + filters
      product/          # product detail
      timeline/         # brand archive / editorial
    api/                # route handlers
    sitemap*.xml/ robots.txt/   # SEO routes
  api/proto-http/       # generated API client (do not edit by hand)
  components/           # shared UI (ui/, contexts/, carousels)
  i18n/                 # next-intl routing + request config
  lib/                  # cart, checkout, stores, analytics, shipment, hooks
  providers/            # React Query provider, etc.
  fonts/                # FeatureMono
messages/               # translation catalogs (one JSON per locale)
proto/                  # API schema submodule (source for the client)
```

## API client

The HTTP client in `src/api/proto-http/` is **generated** from the `proto`
submodule — edit the schema upstream, then regenerate:

```bash
pnpm gen        # pulls proto + buf generate
```

## Deployment

Deployed on Vercel. `master` is the main branch; `beta` is the integration/preview
branch. Pushes to tracked branches produce Vercel preview deployments.
