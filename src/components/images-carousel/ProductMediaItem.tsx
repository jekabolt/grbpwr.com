"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";

// import { PhotoProvider, PhotoView } from "react-photo-view";

import { calculateAspectRatio, cn } from "@/lib/utils";
import GlobalImage from "@/components/ui/image";

export function ProductMediaItem({
  singleMedia,
}: {
  singleMedia: common_MediaFull;
}) {
  return (
    // TO-DO add faster animation - check docs of package
    <>
      {/* <PhotoView src={singleMedia?.media?.fullSize?.mediaUrl!}> */}
      <div className={"cursor-pointer"}>
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
      {/* </PhotoView> */}
    </>
  );
}
