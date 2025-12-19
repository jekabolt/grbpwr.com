"use client";

import { CATALOG_LIMIT, TOP_CATEGORIES } from "@/constants";
import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

import {
  useScrambleCurrencyText,
  useScrambleStaticText,
  useScrambleText,
} from "./useScrambleText";

export function CatalogSkeleton() {
  const t = useTranslations("categories");

  return (
    <>
      <div className="block lg:hidden">
        <div className="flex min-h-screen flex-col px-2.5 pt-16">
          <div className="flex flex-1 flex-col space-y-6">
            <ProductsSkeletonGrid variant="mobile" />
          </div>
          <div className="sticky bottom-0 z-20 my-5 flex justify-center text-bgColor mix-blend-exclusion">
            <FilterSkeletonLabel />
          </div>
        </div>
      </div>

      <div className="hidden flex-col gap-6 px-7 pt-24 lg:flex">
        <div className="sticky top-20 z-10 flex items-start justify-between text-bgColor mix-blend-exclusion">
          <div className="flex items-center gap-2">
            {TOP_CATEGORIES.map(({ key, label }, index) => {
              const translated = t(key);
              const display =
                key === "loungewear_sleepwear" ? label : translated;

              return (
                <CategorySkeletonItem
                  key={key}
                  display={display}
                  isLast={index === TOP_CATEGORIES.length - 1}
                />
              );
            })}
          </div>
          <FilterSkeletonLabel />
        </div>
        <div className="z-50 w-full" />
        <div className="mix-blend-normal">
          <div>
            <ProductsSkeletonGrid variant="desktop" />
          </div>
        </div>
      </div>
    </>
  );
}

function CategorySkeletonItem({
  display,
  isLast,
}: {
  display: string;
  isLast: boolean;
}) {
  const scrambled = useScrambleStaticText(display);

  return (
    <div className="flex items-center gap-2">
      <Text variant="uppercase">{scrambled}</Text>
      {!isLast && <Text>/</Text>}
    </div>
  );
}

function FilterSkeletonLabel() {
  const t = useTranslations("catalog");
  const scrambled = useScrambleStaticText(`${t("filter")} +`);

  return <Text className="uppercase">{scrambled}</Text>;
}

function ProductsSkeletonGrid({ variant }: { variant: "mobile" | "desktop" }) {
  const isMobile = variant === "mobile";

  const className = isMobile
    ? "grid grid-cols-2 gap-2"
    : "grid lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16";

  const keyPrefix = isMobile ? "skeleton-mobile" : "skeleton-desktop";

  return (
    <div className={className}>
      {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
        <ProductSkeleton key={`${keyPrefix}-${index}`} />
      ))}
    </div>
  );
}

export function ProductSkeleton() {
  const scrambledText = useScrambleText();
  const scrambledCurrency = useScrambleCurrencyText();

  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-2 pt-2">
        <Text variant="undrleineWithColors" className="leading-none">
          {scrambledText}
        </Text>
        <Text className="leading-none">{scrambledCurrency}</Text>
      </div>
    </div>
  );
}
