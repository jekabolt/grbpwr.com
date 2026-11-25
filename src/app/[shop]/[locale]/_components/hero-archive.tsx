"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { common_HeroEntityWithTranslations } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { ArchiveItem } from "./archive-item";

export function HeroArchive({
  entity,
  className,
  onHeroClick,
}: {
  entity: common_HeroEntityWithTranslations;
  className?: string;
  onHeroClick?: () => void;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const archiveRef = useRef<HTMLDivElement>(null);
  const hasScrolledRef = useRef(false);
  const userScrolledRef = useRef(false);

  const handleUserScroll = () => {
    userScrolledRef.current = true;
  };

  useEffect(() => {
    const scrollToFirstItem = () => {
      const container = archiveRef.current;

      if (
        container?.children.length &&
        !hasScrolledRef.current &&
        !userScrolledRef.current
      ) {
        container.scrollTo({
          left: 250,
          behavior: "smooth",
        });
        hasScrolledRef.current = true;
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        if (!userScrolledRef.current) {
          hasScrolledRef.current = false;
        }
        setTimeout(scrollToFirstItem, 100);
      }
    };

    setTimeout(scrollToFirstItem, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const archive = entity.featuredArchive;
  const translation =
    archive?.translations?.find((t) => t.languageId === languageId) ||
    archive?.translations?.[0];
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 px-2 lg:flex-row">
        <Text variant="uppercase">{translation?.headline}</Text>
        <Button variant="underline" className="uppercase" asChild>
          <Link
            href={archive?.archive?.archiveList?.slug || ""}
            onClick={onHeroClick}
          >
            {translation?.exploreText}
          </Link>
        </Button>
      </div>
      <div
        ref={archiveRef}
        onScroll={handleUserScroll}
        className="flex w-full items-center overflow-x-scroll"
      >
        <ArchiveItem archive={archive?.archive} className="w-80 lg:w-96" />
      </div>
    </div>
  );
}
