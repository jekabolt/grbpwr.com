"use client";

import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function ArchiveGrid({
  items,
  languageId,
  onHover,
  onLeave,
}: {
  items: common_ArchiveList[];
  languageId: number;
  onHover: (item: common_ArchiveList, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  return (
    <div className="h-full px-2.5 pb-2.5 pt-20 lg:px-7 lg:pt-24">
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
        {items.map((item) => {
          const currentTranslation = item.translations?.find(
            (t) => t.languageId === languageId,
          );
          return (
            <Link
              key={item.id}
              href={item.slug || ""}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onHover(item, rect);
              }}
              onMouseLeave={onLeave}
              className="space-y-2"
            >
              <div className="relative aspect-square">
                <ImageComponent
                  alt={item.tag || ""}
                  src={item.thumbnail?.media?.fullSize?.mediaUrl || ""}
                  aspectRatio="1/1"
                  fit="cover"
                />
              </div>
              <Text className="text-highlightColor">
                {currentTranslation?.heading}
              </Text>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
