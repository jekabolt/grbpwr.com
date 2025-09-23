import { Metadata } from "next";
import { ARCHIVE_LIMIT } from "@/constants";
import { getTranslations } from "next-intl/server";

import { serviceClient } from "@/lib/api";
import { generateCommonMetadata } from "@/lib/common-metadata";

import { ArchiveLayout } from "./_components/archive-layout";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return generateCommonMetadata({
    title: t("timeline"),
    description: t("timeline description"),
  });
}

export default async function Page() {
  const { archives, total } = await serviceClient.GetArchivesPaged({
    limit: ARCHIVE_LIMIT,
    offset: 0,
    orderFactor: "ORDER_FACTOR_UNKNOWN",
  });

  return <ArchiveLayout archives={archives || []} total={total || 0} />;
}
