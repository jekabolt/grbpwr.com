"use client";

import { common_ArchiveList } from "@/api/proto-http/frontend";

import ImageComponent from "@/components/ui/image";

export function ArchiveGrid({
  items,
  onHover,
  onLeave,
}: {
  items: common_ArchiveList[];
  onHover: (item: common_ArchiveList, rect: DOMRect) => void;
  onLeave: () => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-4 lg:gap-y-10">
      {items.map((item) => (
        <div
          key={item.id}
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onHover(item, rect);
          }}
          onMouseLeave={onLeave}
          className="relative aspect-square"
        >
          <ImageComponent
            alt={item.tag || ""}
            src={item.thumbnail?.media?.fullSize?.mediaUrl || ""}
            aspectRatio="1/1"
            fit="scale-down"
          />
        </div>
      ))}
    </div>
  );
}
