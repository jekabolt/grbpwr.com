import { Metadata } from "next";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import { HeroArchive } from "../_components/hero-archive";
import Catalog from "./_components/catalog";
import CatalogWithClientFilters from "./_components/catalog-with-client-filters";
import { NextCategoryButton } from "./_components/next-category-button";

interface CatalogPageProps {
  searchParams: Promise<{
    category?: string;
    gender?: string;
    order?: string;
    sort?: string;
    size?: string;
    topCategoryIds?: string;
    subCategoryIds?: string;
    sale?: string;
    tag?: string;
  }>;
}

export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: "catalog".toUpperCase(),
  });
}

export default async function CatalogPage() {
  const { hero } = await serviceClient.GetHero({});

  // Get ALL products without any filtering for static generation
  const response = await serviceClient.GetProductsPaged({
    limit: 1000, // Increase limit to get more products for client-side filtering
    offset: 0,
    sortFactors: [],
    orderFactor: "ORDER_FACTOR_UNKNOWN",
    filterConditions: {
      from: undefined,
      to: undefined,
      onSale: undefined,
      gender: undefined,
      color: undefined,
      topCategoryIds: undefined,
      subCategoryIds: undefined,
      typeIds: undefined,
      sizesIds: undefined,
      preorder: undefined,
      byTag: undefined,
    },
  });

  return (
    <FlexibleLayout headerType="catalog" footerType="regular">
      <div className="block lg:hidden">
        <MobileCatalog
          firstPageItems={response.products || []}
          total={response.total || 0}
        />
      </div>
      <div className="hidden lg:block">
        <Catalog
          total={response.total || 0}
          firstPageItems={response.products || []}
        />
      </div>
      <div
        className={cn("block", {
          hidden: !response.total,
        })}
      >
        <div className="flex justify-center pb-5 pt-16">
          <NextCategoryButton />
        </div>
        <div>
          {hero?.entities
            ?.filter((e) => e.type === "HERO_TYPE_FEATURED_ARCHIVE")
            .map((e, i) => (
              <HeroArchive
                entity={e}
                key={i}
                className="space-y-12 pb-40 pt-14 lg:py-32"
              />
            ))}
        </div>
      </div>
      <CatalogWithClientFilters
        initialProducts={response.products || []}
        initialTotal={response.total || 0}
        hero={hero}
      />
    </FlexibleLayout>
  );
}
