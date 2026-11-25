"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

// Query-param filters that can narrow a catalog to zero results. Mirrors the
// set cleared by `handleClearAll` in filter.tsx; the gender/category route is
// preserved so "clear all" returns to the same section, just unfiltered.
const FILTER_PARAMS = ["size", "collection", "sort", "order", "sale"] as const;

export function EmptyCatalog() {
  const t = useTranslations("catalog");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const hasActiveFilters = FILTER_PARAMS.some((param) =>
    Boolean(searchParams.get(param)),
  );

  function clearFilters() {
    const params = new URLSearchParams(searchParams.toString());
    FILTER_PARAMS.forEach((param) => params.delete(param));
    const qs = params.toString();
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex h-full min-h-[60vh] w-full flex-col items-center justify-center gap-6">
      <Text variant="uppercase">
        {hasActiveFilters ? t("no matches") : t("empty")}
      </Text>
      {hasActiveFilters && (
        <Button
          size="lg"
          variant="simpleReverseWithBorder"
          className="uppercase"
          onClick={clearFilters}
        >
          {t("clear all")}
        </Button>
      )}
    </div>
  );
}
