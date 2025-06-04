"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { common_HeroEntity } from "@/api/proto-http/frontend";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";

import { ArchiveItem } from "./archive-item";

export function HeroArchive({
  entity,
  className,
}: {
  entity: common_HeroEntity;
  className?: string;
}) {
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
  return (
    <div className={className}>
      <div className="flex flex-col gap-3 px-2 lg:flex-row">
        <Text variant="uppercase">{archive?.headline}</Text>
        <Button variant="underline" className="uppercase" asChild>
          <Link href={`/archive/${archive?.tag}`}>{archive?.exploreText}</Link>
        </Button>
      </div>
      <div
        ref={archiveRef}
        onScroll={handleUserScroll}
        className={cn("flex w-full items-center overflow-x-scroll", {
          "lg:justify-center":
            archive?.archive?.media?.length &&
            archive?.archive?.media?.length <= 4,
        })}
      >
        <ArchiveItem archive={archive?.archive} className="w-80" />
      </div>
    </div>
  );
}
