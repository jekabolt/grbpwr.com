"use client";

import { common_MediaFull } from "@/api/proto-http/frontend";

// import { PhotoProvider, PhotoView } from "react-photo-view";

import GlobalImage from "@/components/ui/image";
import { calculateAspectRatio } from "@/lib/utils";

export function ProductMediaItem({
  singleMedia,
}: {
  singleMedia: common_MediaFull;
}) {
  return (
    // TO-DO add faster animation - check docs of package
    <>
      {/* <PhotoView src={singleMedia?.media?.fullSize?.mediaUrl!}> */}
      {/* <div className={"cursor-pointer"}> */}
      <GlobalImage
        src={singleMedia?.media?.fullSize?.mediaUrl!}
        alt="Product image"
        aspectRatio={calculateAspectRatio(
          singleMedia?.media?.fullSize?.width,
          singleMedia?.media?.fullSize?.height,
        )}
        fit="contain"
        blurhash={singleMedia?.media?.blurhash}
      />
      {/* </div> */}
      {/* </PhotoView> */}
    </>
  );
}
