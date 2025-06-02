import { CATALOG_LIMIT } from "@/constants";

import { serviceClient } from "@/lib/api";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { MobileCatalog } from "@/app/catalog/_components/mobile-catalog";

import { HeroArchive } from "../_components/hero-archive";
import Catalog from "./_components/catalog";
import { NextCategoryButton } from "./_components/next-category-button";
import { getStaticProductsPagedQueryParams } from "./_components/utils";

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
  return [
    {},
    { gender: "GENDER_ENUM_MALE" },
    { gender: "GENDER_ENUM_FEMALE" },
    { gender: "GENDER_ENUM_UNISEX" },
  ];
}

// export async function generateMetadata(
//   props: CatalogPageProps,
// ): Promise<Metadata> {
//   const params = await props.searchParams;
//   const { gender } = params;

//   const genderTitle = GENDER_MAP_REVERSE[gender as common_GenderEnum];
//   return generateCommonMetadata({
//     title: gender ? genderTitle.toUpperCase() : "catalog".toUpperCase(),
//   });
// }

export const dynamic = "force-static";

export default async function CatalogPage(props: CatalogPageProps) {
  const { hero } = await serviceClient.GetHero({});

  // Use static params for SSG, searchParams handled client-side
  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getStaticProductsPagedQueryParams(),
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
