"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import GlobalImage from "@/components/global/Image";
import { calculateAspectRatio } from "@/lib/utils";
import { useState } from "react";
import { FullScreenMediaViewer } from "./FullScreenMediaViewer";

export function ProductMedia({
  productMedia,
}: {
  productMedia: common_MediaFull[];
}) {
  const [viewerOpen, setViewerOpen] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const handleImageClick = (index: number) => {
    setStartIndex(index);
    setViewerOpen(true);
  };

  const handleClose = () => {
    setViewerOpen(false);
  };

  return (
    <div className="grid w-full grid-cols-6 items-end gap-2">
      {productMedia.map((i, index) => (
        <div
          className="group col-span-2 first:col-span-1 last:col-span-1"
          key={i.id}
        >
          <div
            className="h-[600px] cursor-pointer group-first:h-[300px] group-last:h-[300px]"
            onClick={() => handleImageClick(index)}
          >
            <GlobalImage
              src={i?.media?.fullSize?.mediaUrl!}
              alt="Product image"
              aspectRatio={calculateAspectRatio(
                i?.media?.fullSize?.width,
                i?.media?.fullSize?.height,
              )}
              fit="cover"
            />
          </div>
        </div>
      ))}
      {viewerOpen && (
        <FullScreenMediaViewer
          media={productMedia}
          startIndex={startIndex}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
