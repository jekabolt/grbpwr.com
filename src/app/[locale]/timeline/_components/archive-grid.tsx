"use client";

import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

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
  const currentTranslation = item.translations?.find(
    (t) => t.languageId === languageId,
  );
  const media = resolveArchiveMedia(item.thumbnail?.media);

  return (
    <Link href={item.slug || ""} className="group flex min-w-0 flex-col gap-2">
      <div className="relative aspect-[3/4] w-full overflow-hidden">
        <ArchiveMediaThumbnail
          media={media}
          alt={currentTranslation?.heading || item.tag || ""}
          aspectRatio="3/4"
          blurhash={item.thumbnail?.media?.blurhash}
          fit="fill"
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
