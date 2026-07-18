"use client";

import type { StorefrontColorway } from "@/api/proto-http/frontend";
import { useTranslations } from "next-intl";

import { Text } from "@/components/ui/text";
import { EmptyCatalog } from "@/app/[locale]/catalog/_components/empty-catalog";
import { InfinityScrollCatalog } from "@/app/[locale]/catalog/_components/infinity-scroll-catalog";

export function ExclusiveCatalog({
  firstPageItems,
  total,
}: {
  firstPageItems: StorefrontColorway[];
  total: number;
}) {
  const t = useTranslations("catalog");

  return (
    <div className="flex min-h-dvh flex-col gap-8 px-2.5 pb-24 pt-16 lg:gap-12 lg:px-7 lg:pt-24">
      <div className="flex flex-col gap-2">
        <Text variant="uppercase" component="h1">
          {t("exclusive")}
        </Text>
        <Text component="p" className="lowercase text-textColor lg:w-2/3">
          {t("exclusive description")}
        </Text>
      </div>
      {total > 0 ? (
        <InfinityScrollCatalog
          exclusive
          firstPageItems={firstPageItems}
          total={total}
        />
      ) : (
        <EmptyCatalog />
      )}
    </div>
  );
}
