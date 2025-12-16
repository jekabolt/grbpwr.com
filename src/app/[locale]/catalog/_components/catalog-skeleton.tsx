"use client";

import { useMemo } from "react";
import {
  CATALOG_LIMIT,
  FIT_OPTIONS,
  PLURIAL_SINGLE_CATEGORY_MAP,
  TOP_CATEGORIES,
} from "@/constants";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";

import { useScrambleText } from "./useScrambleText";

function ScrambleLabel({
  text,
  className,
  length,
}: {
  text?: string;
  className?: string;
  length?: number;
}) {
  const scrambled = useScrambleText(text, undefined, {
    randomOnEmpty: true,
    length: length ?? 12,
    reveal: !!text,
  });

  return <Text className={cn("", className)}>{scrambled}</Text>;
}

export function CatalogSkeleton() {
  const t = useTranslations("categories");
  const tCatalog = useTranslations("catalog");

  return (
    <>
      <div className="block lg:hidden">
        <div className="flex min-h-screen flex-col px-2.5 pt-16">
          <div className="flex flex-1 flex-col space-y-6">
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
                <ProductSkeleton key={`skeleton-mobile-${index}`} />
              ))}
            </div>
          </div>
          <div className="sticky bottom-0 z-20 my-5 flex justify-center text-bgColor mix-blend-exclusion">
            <div className="bg-fgColor rounded-full px-4 py-2 text-bgColor">
              <ScrambleLabel
                className="uppercase"
                text={`${tCatalog("filter")} +`}
              />
            </div>
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
                <div className="flex items-center gap-2" key={key}>
                  <ScrambleLabel text={display} className="uppercase" />
                  {index < TOP_CATEGORIES.length - 1 && <Text>/</Text>}
                </div>
              );
            })}
          </div>
          <ScrambleLabel
            className="uppercase"
            text={`${tCatalog("filter")} +`}
          />
        </div>
        <div className="z-50 w-full" />
        <div className="mix-blend-normal">
          <div>
            <div className="grid lg:grid-cols-4 lg:gap-x-4 lg:gap-y-16">
              {Array.from({ length: CATALOG_LIMIT }).map((_, index) => (
                <ProductSkeleton key={`skeleton-desktop-${index}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function ProductSkeleton() {
  const t = useTranslations("categories");
  const scrambledPrice = useScrambleText("", undefined, {
    scramblePrice: true,
  });

  // Generate array of translated categories
  const categoryOptions = useMemo(() => {
    return TOP_CATEGORIES.map(({ key }) => {
      const categoryName = key.toLowerCase();
      const singularCategory =
        PLURIAL_SINGLE_CATEGORY_MAP[categoryName] || key || "";
      return singularCategory ? t(singularCategory.toLowerCase()) : "";
    }).filter(Boolean);
  }, [t]);

  // Scramble fit continuously
  const scrambledFit = useScrambleText("", undefined, {
    randomizeFrom: [...FIT_OPTIONS],
    randomizeInterval: 3000, // How often to change the text (3 seconds)
    animationSpeed: 80, // Speed of scrambling animation (50ms = slower, 10ms = faster)
    continuous: true,
  });

  // Scramble category continuously
  const scrambledCategory = useScrambleText("", undefined, {
    randomizeFrom: categoryOptions,
    randomizeInterval: 3000, // How often to change the text (3 seconds)
    animationSpeed: 80, // Speed of scrambling animation (50ms = slower, 10ms = faster)
    continuous: true,
  });

  const productName = `${scrambledFit} ${scrambledCategory}`;

  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-[4/5] w-full" />
      <div className="flex flex-col gap-2 pt-2">
        <Text
          variant="undrleineWithColors"
          className="leading-none text-highlightColor"
        >
          {productName}
        </Text>
        <Text>{scrambledPrice}</Text>
      </div>
    </div>
  );
}
