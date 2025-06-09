"use client";

import { useRef, useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";
import { FOOTER_YEAR } from "@/constants";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export default function PageComponent({
  archive,
}: {
  archive?: common_ArchiveFull;
}) {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="space-y-2 text-textColor lg:min-h-screen lg:space-y-10">
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start lg:justify-between">
        <Text className="order-1 mb-2.5 lg:mb-0 lg:w-80" variant="uppercase">
          {archive?.heading || ""}
        </Text>
        {archive?.description && (
          <Text className="order-3 mb-12 mt-7 w-full lg:order-2 lg:m-0 lg:max-w-[800px]">
            {archive?.description}
          </Text>
        )}
        <Text
          className="order-2 lg:order-3 lg:w-80 lg:text-right"
          variant="uppercase"
        >{`${archive?.tag || ""} / ${FOOTER_YEAR}`}</Text>
      </div>
      {archive?.media &&
        archive?.media.length > 0 &&
        !archive?.video?.media?.fullSize?.mediaUrl && (
          <div className="relative h-full w-full lg:h-screen">
            {archive?.media[0].media?.fullSize && (
              <ImageComponent
                src={archive?.media[0].media?.fullSize?.mediaUrl || ""}
                alt={archive?.heading || "Featured archive image"}
                aspectRatio={calculateAspectRatio(
                  archive?.media[0].media?.fullSize?.width,
                  archive?.media[0].media?.fullSize?.height,
                )}
              />
            )}
          </div>
        )}
      {archive?.video && archive?.video?.media?.fullSize?.mediaUrl && (
        <div className="w-full">
          <div className="relative aspect-video w-full overflow-hidden">
            <video
              src={archive?.video.media?.fullSize?.mediaUrl || ""}
              className="h-full w-full object-cover"
              poster={archive?.video.media?.thumbnail?.mediaUrl}
              autoPlay
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
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:gap-4">
        {(archive?.video?.media?.fullSize?.mediaUrl
          ? archive?.media
          : archive?.media?.slice(1)
        )?.map((mediaItem, index) => (
          <div key={index}>
            {mediaItem.media?.fullSize && (
              <ImageComponent
                src={mediaItem.media?.fullSize?.mediaUrl || ""}
                alt={`${archive?.heading || ""} image ${index + 1}`}
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
