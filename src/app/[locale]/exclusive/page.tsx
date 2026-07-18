import { Metadata } from "next";
import { CATALOG_LIMIT } from "@/constants";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";
import { getInitialTranslationState } from "@/lib/stores/translations/cookie-utils";
import FlexibleLayout from "@/components/flexible-layout";

import { getProductsPagedQueryParams } from "../catalog/_components/utils";
import { ExclusiveCatalog } from "./_components/exclusive-catalog";

// Membership-adjacent surface: the gated teasers resolve per viewer client-side,
// so there's no cacheable static HTML to win here. Render on-demand (like the
// account area) rather than prerendering at build.
export const dynamic = "force-dynamic";

interface ExclusivePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ExclusivePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });

  return generateCommonMetadata({
    title: t("exclusive").toUpperCase(),
    description: t("exclusive description"),
    locale,
    path: "/exclusive",
  });
}

// The exclusive catalogue: only tier-gated pieces (filterConditions.exclusive).
// Reads are anonymous, so every gated piece comes back as a guest-relative
// teaser; the grid re-locks each card against the real viewer client-side, so a
// qualifying member sees buyable cards and everyone else sees locked teasers.
export default async function ExclusivePage() {
  const { country } = await getInitialTranslationState();

  const response = await serviceClient.GetColorwaysPaged({
    limit: CATALOG_LIMIT,
    offset: 0,
    ...getProductsPagedQueryParams({
      currency: country?.currencyKey ?? "EUR",
      exclusive: true,
    }),
  });

  return (
    <FlexibleLayout className="pt-16 lg:pt-0" headerType="catalog">
      <ExclusiveCatalog
        total={response.total || 0}
        firstPageItems={response.colorways || []}
      />
    </FlexibleLayout>
  );
}
