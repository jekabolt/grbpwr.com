"use client";

import { useState } from "react";
import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { resolveArchiveMedia } from "@/lib/utils";
import { Text } from "@/components/ui/text";

import { ArchiveMediaThumbnail } from "./archive-media-thumbnail";

function ArchiveGridItem({
  item,
  languageId,
}: {
  item: common_ArchiveList;
  languageId: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const currentTranslation = item.translations?.find(
    (t) => t.languageId === languageId,
  );
  const media = resolveArchiveMedia(item.thumbnail?.media);
  const isVideoItem = media.type === "video";

  return (
    <Link
      href={item.slug || ""}
      className="group flex min-w-0 flex-col gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <ArchiveMediaThumbnail
          media={media}
          alt={currentTranslation?.heading || item.tag || ""}
          aspectRatio="3/4"
          blurhash={item.thumbnail?.media?.blurhash}
          playOnHover={!isMobile && isVideoItem && isHovered}
          autoPlay={isMobile && isVideoItem}
          fit="cover"
        />
      </div>
      <div className="min-w-0 max-w-full overflow-hidden">
        <Text className="line-clamp-2 break-words uppercase text-textColor group-hover:underline">
          {currentTranslation?.heading}
        </Text>
      </div>
    </Link>
  );
}

export function ArchiveGrid({
  items,
  languageId,
}: {
  items: common_ArchiveList[];
  languageId: number;
}) {
  return (
    <div className="h-full px-2.5 pb-2.5 pt-20 lg:px-7 lg:pt-24">
      <div className="grid min-w-0 grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
        {items.map((item) => (
          <ArchiveGridItem key={item.id} item={item} languageId={languageId} />
        ))}
      </div>
    </div>
  );
}
