"use client";

import { useState } from "react";
import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

import { isVideo } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

function ArchiveGridItem({
  item,
  languageId,
}: {
  item: common_ArchiveList;
  languageId: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 1024;
  const currentTranslation = item.translations?.find(
    (t) => t.languageId === languageId,
  );
  const thumbnailUrl = item.thumbnail?.media?.fullSize?.mediaUrl || "";
  const isVideoItem = isVideo(thumbnailUrl);

  return (
    <Link
      href={item.slug || ""}
      className="group flex min-w-0 flex-col gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square w-full overflow-hidden">
        <ImageComponent
          alt={item.tag || ""}
          src={thumbnailUrl}
          aspectRatio="1/1"
          fit="cover"
          type={isVideoItem ? "video" : "image"}
          playOnHover={isVideoItem && isHovered}
          autoPlay={isMobile && isVideoItem}
        />
      </div>
      <Text className="w-full min-w-0 break-words uppercase text-textColor group-hover:text-highlightColor">
        {currentTranslation?.heading}
      </Text>
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
