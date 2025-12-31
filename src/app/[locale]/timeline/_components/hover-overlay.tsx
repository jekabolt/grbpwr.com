"use client";

import type { common_ArchiveList } from "@/api/proto-http/frontend";

import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

const SCALE = 1.2;
const IMAGE_SCALE = 0.6;

interface HoverOverlayProps {
  item: common_ArchiveList;
  rect: DOMRect;
  languageId: number;
  scale?: number;
  imageScale?: number;
}

export function HoverOverlay({ item, rect, languageId }: HoverOverlayProps) {
  const translation = item.translations?.find(
    (t) => t.languageId === languageId,
  );

  const finalWidth = rect.width * SCALE;
  const finalHeight = rect.height * SCALE;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  const scrollX = window.scrollX;
  const scrollY = window.scrollY;

  const finalLeft = Math.max(
    0,
    Math.min(
      rect.left + scrollX - (finalWidth - rect.width) / 2,
      viewportWidth - finalWidth,
    ),
  );
  const finalTop = Math.max(
    0,
    Math.min(
      rect.top + scrollY - (finalHeight - rect.height) / 2,
      viewportHeight - finalHeight,
    ),
  );

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      <div
        className="absolute border border-textColor bg-bgColor"
        style={{
          left: finalLeft,
          top: finalTop,
          width: finalWidth,
          height: finalHeight,
        }}
      >
        <div className="relative h-full w-full">
          <div className="absolute left-0 right-0 top-0 z-10 flex items-center justify-between p-2">
            <Text variant="uppercase">{item.tag}</Text>
            <Text>{item.createdAt?.split("T")[0]}</Text>
          </div>
          <div
            className="h-full w-full overflow-hidden"
            style={{
              transform: `scale(${IMAGE_SCALE})`,
            }}
          >
            <ImageComponent
              src={item.thumbnail?.media?.fullSize?.mediaUrl || ""}
              alt={item.tag || ""}
              aspectRatio="1/1"
              fit="contain"
            />
          </div>
          <div className="absolute bottom-0 left-0 right-0 z-10 p-2">
            <Text variant="uppercase">{translation?.heading}</Text>
          </div>
        </div>
      </div>
    </div>
  );
}
