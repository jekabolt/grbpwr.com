import { Metadata } from "next";
import { common_GenderEnum } from "@/api/proto-http/frontend";
import { CATALOG_LIMIT, GENDER_MAP_REVERSE } from "@/constants";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import { HeroArchive } from "../_components/hero-archive";
import Catalog from "./_components/catalog";
import { NextCategoryButton } from "./_components/next-category-button";
import { getProductsPagedQueryParams } from "./_components/utils";

// TODO: in metadata title display `${filtered gender} grbpwr.com`

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

export async function generateMetadata(
  props: CatalogPageProps,
): Promise<Metadata> {
  const params = await props.searchParams;
  const { gender } = params;

  const genderTitle = GENDER_MAP_REVERSE[gender as common_GenderEnum];
  return generateCommonMetadata({
    title: genderTitle.toUpperCase() || "catalog".toUpperCase(),
  });
}

export default async function CatalogPage(props: CatalogPageProps) {
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
}
