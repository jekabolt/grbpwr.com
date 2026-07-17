import { cache } from "react";

import { createFrontendServiceClient } from "@/api/proto-http/frontend";
import { ARCHIVES_CACHE_TAG, HERO_CACHE_TAG, PRODUCTS_CACHE_TAG } from "@/constants";

type Object = {
  [key: string]: unknown;
};

interface RequestHandlerParams {
  path: string;
  method: string;
  body: string | null;
}

interface ProtoMetaParams {
  service: string;
  method: string;
}

const fetchParams: Object = {
  GetHero: {
    next: {
      tags: [HERO_CACHE_TAG],
    },
  },
  GetColorway: {
    next: {
      tags: [PRODUCTS_CACHE_TAG],
    },
  },
  GetColorwaysPaged: {
    next: {
      tags: [PRODUCTS_CACHE_TAG],
    },
  },
  GetArchive: {
    next: {
      tags: [ARCHIVES_CACHE_TAG],
    },
  },
  GetArchivesPaged: {
    next: {
      tags: [ARCHIVES_CACHE_TAG],
    },
  },
};

const requestHandler = async (
  { path, method, body }: RequestHandlerParams,
  { method: serviceMethod }: ProtoMetaParams,
) => {

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/${path}`,
    {
      method,
      body,
      ...(fetchParams[serviceMethod] as Object),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    const error = new Error(
      (data?.message as string) || response.statusText || "Request failed",
    ) as Error & { code?: number; details?: unknown };
    error.code = data?.code;
    error.details = data;
    throw error;
  }

  return data;
};

export const serviceClient = createFrontendServiceClient(requestHandler);

// GetHero is requested by both app/template.tsx and app/[locale]/page.tsx on the
// same request. It's a POST, so Next's fetch dedup doesn't cover it — wrap it in
// React cache() to collapse the two server round-trips into one per request.
export const getHero = cache(() => serviceClient.GetHero({}));

const EMPTY_FILTERS = {
  from: undefined,
  to: undefined,
  currency: "EUR",
  onSale: undefined,
  gender: undefined,
  colorCodes: undefined,
  topCategoryIds: undefined,
  subCategoryIds: undefined,
  excludeTopCategoryIds: undefined,
  typeIds: undefined,
  sizesIds: undefined,
  preorder: undefined,
  byTag: undefined,
  collections: undefined,
  seasons: undefined,
};

// Freshness signals (sitemap lastmod / JSON-LD dateModified) for pages without a
// single date of their own: derive from the most recently updated content.
// Cached per request so the homepage and sitemap routes share one round-trip.
export const getLatestProductDate = cache(
  async (): Promise<string | undefined> => {
    try {
      const { colorways } = await serviceClient.GetColorwaysPaged({
        limit: 1,
        offset: 0,
        sortFactors: ["SORT_FACTOR_UPDATED_AT"],
        orderFactor: "ORDER_FACTOR_DESC",
        filterConditions: EMPTY_FILTERS,
      });
      return colorways?.[0]?.display?.updatedAt ?? undefined;
    } catch {
      return undefined;
    }
  },
);

export const getLatestArchiveDate = cache(
  async (): Promise<string | undefined> => {
    try {
      const { archives } = await serviceClient.GetArchivesPaged({
        limit: 1,
        offset: 0,
        orderFactor: "ORDER_FACTOR_DESC",
      });
      return archives?.[0]?.createdAt ?? undefined;
    } catch {
      return undefined;
    }
  },
);
