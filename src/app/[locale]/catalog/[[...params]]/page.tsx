import { Metadata } from "next";
import { CATALOG_LIMIT } from "@/constants";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { resolveCategories } from "@/lib/categories-map";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { cn } from "@/lib/utils";
import FlexibleLayout from "@/components/flexible-layout";
import { HeroArchive } from "@/app/[locale]/_components/hero-archive";
import { MobileCatalog } from "@/app/[locale]/catalog/_components/mobile-catalog";

import Catalog from "../_components/catalog";
import { NextCategoryButton } from "../_components/next-category-button";
import {
  getProductsPagedQueryParams,
  parseRouteParams,
} from "../_components/utils";

interface CatalogPageProps {
  params: Promise<{
    locale: string;
    params?: string[];
  }>;
  searchParams: Promise<{
    order?: string;
    sort?: string;
    size?: string;
    subCategoryIds?: string;
    topCategoryIds?: string;
    sale?: string;
    tag?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return generateCommonMetadata({
    title: "catalog".toUpperCase(),
  });
}

export const dynamic = "force-static";

export async function generateStaticParams() {
  const { dictionary } = await serviceClient.GetHero({});
  const locales = ["en", "fr", "de", "it", "ja", "cn", "kr"];

  // Get all categories for static generation
  const categories = dictionary?.categories || [];
  const topCategories = categories.filter(
    (cat: any) => cat.level === "top_category",
  );

  const params = [];

  // Generate params for each locale
  for (const locale of locales) {
    // Root catalog page
    params.push({ locale, params: [] });

    // Category pages
    for (const category of topCategories) {
      const translation =
        category.translations?.find((t: any) => t.languageId === 1) ||
        category.translations?.[0];
      if (translation?.name) {
        const categoryName = translation.name.toLowerCase();
        params.push({ locale, params: [categoryName] });

        // Subcategory pages
        const subCategories = categories.filter(
          (cat: any) =>
            cat.level === "sub_category" && cat.parentId === category.id,
        );

        for (const subCategory of subCategories) {
          const subTranslation =
            subCategory.translations?.find((t: any) => t.languageId === 1) ||
            subCategory.translations?.[0];
          if (subTranslation?.name) {
            const subCategoryName = subTranslation.name.toLowerCase();
            params.push({ locale, params: [categoryName, subCategoryName] });
          }
        }
      }
    }
  }

  return params;
}

export default async function CatalogPage(props: CatalogPageProps) {
  const { hero, dictionary } = await serviceClient.GetHero({});
  const searchParams = await props.searchParams;
  const params = await props.params;

  // Get server-side translations for the current locale
  const t = await getTranslations({
    locale: params.locale,
    namespace: "catalog",
  });

  const { gender, categoryName, subCategoryName } = parseRouteParams(
    params?.params,
  );

  // Always use English (languageId = 1) for URL resolution since URLs are in English
  // The client components will handle displaying the translated names
  const { topCategory, subCategory } = resolveCategories(
    dictionary?.categories,
    categoryName,
    subCategoryName,
    1, // Always use English for URL resolution
  );

  const response = await serviceClient.GetProductsPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams(
      {
        ...searchParams,
        gender,
        topCategoryIds: !subCategory ? topCategory?.id?.toString() : undefined,
        subCategoryIds: subCategory?.id?.toString(),
      },
      dictionary,
    ),
  });

  return (
    <FlexibleLayout headerType="catalog">
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
