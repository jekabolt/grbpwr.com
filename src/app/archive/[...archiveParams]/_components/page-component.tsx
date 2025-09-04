"use client";

import { useRef, useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export const filterExtensionToContentType: { [key: string]: string } = {
  jpg: "image/jpg",
  png: "image/png",
  webm: "video/webm",
  mp4: "video/mp4",
  jpeg: "image/jpeg",
  webp: "image/webp",
  heic: "image/heic",
};

export const isVideo = (mediaUrl: string | undefined) => {
  if (mediaUrl) {
    const extension = mediaUrl.split(".").pop()?.toLowerCase();

    if (extension) {
      const contentType = filterExtensionToContentType[extension];
      return contentType?.startsWith("video/");
    }
  }
  return false;
};

export default function PageComponent({
  archive,
}: {
  archive?: common_ArchiveFull;
}) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentYear = new Date().getFullYear();

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  return (
    <div className="space-y-2 px-7 text-textColor lg:min-h-screen lg:space-y-10">
      {/* Header */}
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start lg:justify-between">
        <Text className="order-1 mb-2.5 lg:mb-0 lg:w-80" variant="uppercase">
          {archive?.archiveList?.heading || ""}
        </Text>
        {archive?.archiveList?.description && (
          <Text className="order-3 mb-12 mt-7 w-full border border-red-500 lg:order-2 lg:m-0 lg:max-w-[800px]">
            {archive?.archiveList?.description}
          </Text>
        )}
        <Text
          className="order-2 lg:order-3 lg:w-80 lg:text-right"
          variant="uppercase"
        >{`${archive?.archiveList?.tag || ""} / ${currentYear}`}</Text>
      </div>

      {/* Main Media */}
      {archive?.mainMedia && (
        <div className="relative mb-12 h-[80vh] w-full">
          {isVideo(archive?.mainMedia?.media?.thumbnail?.mediaUrl) ? (
            <div className="h-full">
              <video
                src={archive?.mainMedia?.media?.fullSize?.mediaUrl || ""}
                className="h-full w-full object-cover"
                poster={archive?.mainMedia?.media?.thumbnail?.mediaUrl}
                autoPlay
                playsInline
                controls={false}
                muted
                loop
                preload="metadata"
                ref={videoRef}
              >
                Your browser does not support the video tag.
              </video>
              <Button
                onClick={toggleSound}
                className="absolute bottom-2.5 right-2.5 uppercase text-white mix-blend-difference transition-all"
                aria-label={isMuted ? "unmute" : "mute"}
              >
                {isMuted ? "sound on" : "sound off"}
              </Button>
            </div>
          ) : (
            <ImageComponent
              src={archive?.mainMedia?.media?.thumbnail?.mediaUrl || ""}
              alt={archive?.archiveList?.heading || "Featured archive image"}
              aspectRatio={calculateAspectRatio(
                archive?.mainMedia?.media?.thumbnail?.width,
                archive?.mainMedia?.media?.thumbnail?.height,
              )}
              fit="cover"
            />
          )}
        </div>
      )}

      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {archive?.media?.map((mediaItem, index) => (
          <div key={index} className="relative aspect-[3/4]">
            {mediaItem.media?.fullSize && (
              <ImageComponent
                src={mediaItem.media?.fullSize?.mediaUrl || ""}
                alt={`${archive?.archiveList?.heading || ""} image ${index + 1}`}
                aspectRatio={calculateAspectRatio(
                  mediaItem.media?.fullSize?.width,
                  mediaItem.media?.fullSize?.height,
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
