"use client";

import { useEffect } from "react";
import type { common_Colorway } from "@/api/proto-http/frontend";

import { useServerActionsContext } from "@/components/contexts/ServerActionsContext";

// Minimal, read-only WebMCP integration: exposes a single catalog-browsing tool
// to in-browser AI agents via the experimental navigator.modelContext API.
// Feature-detected and wrapped in try/catch, so it is a no-op everywhere the API
// is absent (i.e. everywhere except Chrome's WebMCP preview). Intentionally NO
// mutating actions (cart, checkout, account) — it only reads the public catalog
// through the existing GetColorwaysPaged server action.

const SITE = "https://grbpwr.com";

function productPath(slug: string | undefined): string | null {
  if (!slug) return null;
  const i = slug.indexOf("/p/");
  return i === -1 ? null : slug.slice(i);
}

function toCompactProduct(p: common_Colorway) {
  const translations = p.display?.productBody?.translations;
  const name = (translations?.[0]?.name || p.baseSku || "").trim();
  const media = p.display?.thumbnail?.media;
  const image =
    media?.compressed?.mediaUrl ||
    media?.fullSize?.mediaUrl ||
    media?.thumbnail?.mediaUrl;
  const priceObj = p.prices?.[0];
  const amount = (priceObj?.price as { value?: string } | undefined)?.value;
  const path = productPath(p.slug);
  return {
    id: p.id,
    sku: p.baseSku,
    name,
    url: path ? `${SITE}${path}` : undefined,
    image: image?.trim() || undefined,
    price: amount ? { amount, currency: priceObj?.currency } : undefined,
    soldOut: p.soldOut ?? false,
  };
}

export function WebMCPTools() {
  const { GetColorwaysPaged } = useServerActionsContext();

  useEffect(() => {
    const mc = (navigator as any)?.modelContext;
    if (!mc || typeof mc.provideContext !== "function") return;

    async function execute(args: any) {
      const limit = Math.min(Math.max(Number(args?.limit) || 12, 1), 50);
      const sort = args?.sort;
      const sortFactors: any =
        sort === "price_asc" || sort === "price_desc"
          ? ["SORT_FACTOR_PRICE"]
          : ["SORT_FACTOR_CREATED_AT"];
      const orderFactor: any =
        sort === "price_asc" ? "ORDER_FACTOR_ASC" : "ORDER_FACTOR_DESC";

      const tag =
        typeof args?.tag === "string" && args.tag.trim()
          ? args.tag.trim()
          : undefined;

      const res = await GetColorwaysPaged({
        limit,
        offset: 0,
        sortFactors,
        orderFactor,
        filterConditions: {
          from: undefined,
          to: undefined,
          currency: undefined,
          onSale: args?.onSale ? true : undefined,
          gender: undefined,
          colorCodes: undefined,
          topCategoryIds: undefined,
          subCategoryIds: undefined,
          excludeTopCategoryIds: undefined,
          typeIds: undefined,
          sizesIds: undefined,
          preorder: undefined,
          byTag: tag,
          collections: undefined,
          seasons: undefined,
        },
      });

      const products = (res.products || []).map(toCompactProduct);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              { total: res.total ?? products.length, products },
              null,
              2,
            ),
          },
        ],
      };
    }

    try {
      mc.provideContext({
        tools: [
          {
            name: "list_products",
            description:
              "Browse the grbpwr storefront catalog (read-only). Returns products with name, price, product-page URL and image.",
            inputSchema: {
              type: "object",
              properties: {
                limit: {
                  type: "number",
                  description: "Max products to return (1–50, default 12).",
                },
                onSale: {
                  type: "boolean",
                  description: "Only return products currently on sale.",
                },
                tag: {
                  type: "string",
                  description: "Filter by product tag.",
                },
                sort: {
                  type: "string",
                  enum: ["newest", "price_asc", "price_desc"],
                  description: "Sort order (default: newest).",
                },
              },
              additionalProperties: false,
            },
            execute,
          },
        ],
      });
    } catch {
      // Experimental API surface — ignore registration failures.
    }
  }, [GetColorwaysPaged]);

  return null;
}
