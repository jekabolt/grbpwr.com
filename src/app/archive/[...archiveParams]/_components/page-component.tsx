"use client";

import { useRef, useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export const isVideo = (mediaUrl: string | undefined): boolean => {
  if (!mediaUrl) return false;

  const extension = mediaUrl.split(".").pop()?.toLowerCase();
  const videoExtensions = new Set([
    "mp4",
    "mov",
    "avi",
    "mkv",
    "webm",
    "flv",
    "wmv",
    "mpeg",
    "mpg",
    "m4v",
    "3gp",
    "ogv",
  ]);

  return extension ? videoExtensions.has(extension) : false;
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
    <div className="space-y-2 text-textColor lg:min-h-screen lg:space-y-10">
      <div className="flex flex-col gap-x-4 lg:flex-row lg:items-start lg:justify-between">
        <Text className="order-1 mb-2.5 lg:mb-0 lg:w-80" variant="uppercase">
          {archive?.archiveList?.heading || ""}
        </Text>
        {archive?.archiveList?.description && (
          <Text className="order-3 mb-12 mt-7 w-full lg:order-2 lg:m-0 lg:max-w-[800px]">
            {archive?.archiveList?.description}
          </Text>
        )}
        <Text
          className="order-2 lg:order-3 lg:w-80 lg:text-right"
          variant="uppercase"
        >{`${archive?.archiveList?.tag || ""} / ${currentYear}`}</Text>
      </div>
      {archive?.mainMedia &&
        !isVideo(archive?.mainMedia?.media?.fullSize?.mediaUrl) && (
          <div className="relative h-full w-full lg:h-screen">
            <ImageComponent
              src={archive.mainMedia.media?.thumbnail?.mediaUrl || ""}
              alt={archive?.archiveList?.heading || "Featured archive image"}
              aspectRatio={calculateAspectRatio(
                archive?.mainMedia?.media?.thumbnail?.width,
                archive?.mainMedia?.media?.thumbnail?.height,
              )}
            />
          </div>
        )}
      {archive?.mainMedia &&
        isVideo(archive?.mainMedia?.media?.thumbnail?.mediaUrl) && (
          <div className="w-full">
            <div className="relative aspect-video w-full overflow-hidden">
              <video
                src={archive?.mainMedia?.media?.thumbnail?.mediaUrl || ""}
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
          </div>
        )}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:gap-4">
        {archive?.media?.map((item, id) => (
          <div key={id}>
            <ImageComponent
              src={item.media?.fullSize?.mediaUrl || ""}
              alt={`${archive?.archiveList?.heading || ""} image ${id + 1}`}
              aspectRatio={calculateAspectRatio(
                item.media?.fullSize?.width,
                item.media?.fullSize?.height,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
