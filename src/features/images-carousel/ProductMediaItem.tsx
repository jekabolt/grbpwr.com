"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import GlobalImage from "@/components/ui/image";
import { calculateAspectRatio } from "@/lib/utils";
import { PhotoView } from "react-photo-view";

export function ProductMediaItem({
  singleMedia,
}: {
  singleMedia: common_MediaFull;
}) {
  return (
    <div className="group col-span-2 first:col-span-1 last:col-span-1">
      <PhotoView src={singleMedia?.media?.fullSize?.mediaUrl!}>
        <div className="h-[600px] cursor-pointer group-first:h-[300px] group-last:h-[300px]">
          <GlobalImage
            src={singleMedia?.media?.fullSize?.mediaUrl!}
            alt="Product image"
            aspectRatio={calculateAspectRatio(
              singleMedia?.media?.fullSize?.width,
              singleMedia?.media?.fullSize?.height,
            )}
            fit="cover"
          />
        </div>
      </PhotoView>
    </div>
  );
}
