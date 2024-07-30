"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";
import GlobalImage from "@/components/ui/Image";
import { calculateAspectRatio } from "@/lib/utils";
import { PhotoView } from "react-photo-view";

export function ArchiveMediaItem({
  singleMedia,
}: {
  singleMedia: common_MediaFull;
}) {
  return (
    <PhotoView src={singleMedia?.media?.fullSize?.mediaUrl!}>
      <div className="h-80">
        <GlobalImage
          src={singleMedia?.media?.fullSize?.mediaUrl!}
          alt="Product image"
          aspectRatio={calculateAspectRatio(
            singleMedia?.media?.fullSize?.width,
            singleMedia?.media?.fullSize?.height,
          )}
          fit="contain"
        />
      </div>
    </PhotoView>
  );
}
