import { Metadata } from "next";
import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import { HeroArchive } from "../_components/hero-archive";
import Catalog from "./_components/catalog";
import { NextCategoryButton } from "./_components/next-category-button";
import { getProductsPagedQueryParams } from "./_components/utils";

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

export async function generateStaticParams() {
  return []; // Generate pages on-demand with specific search params
}

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: "catalog".toUpperCase(),
  });
}

export default async function CatalogPage(props: CatalogPageProps) {
  try {
    const { hero } = await serviceClient.GetHero({});
    const searchParams = await props.searchParams;
    const response = await serviceClient.GetProductsPaged({
      limit: CATALOG_LIMIT,
      offset: 0,
      ...getProductsPagedQueryParams(searchParams),
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
      </FlexibleLayout>
    );
  } catch (error) {
    console.error("Static generation failed:", error);

    // Return fallback UI when API fails during static generation
    return (
      <FlexibleLayout headerType="catalog" footerType="regular">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-lg">Catalog temporarily unavailable</p>
            <p className="mt-2 text-sm text-gray-500">Please try again later</p>
          </div>
        </div>
      </FlexibleLayout>
    );
  }
}
