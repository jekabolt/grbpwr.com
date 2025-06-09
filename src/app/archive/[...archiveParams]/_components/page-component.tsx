"use client";

import { useRef, useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

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

  console.log(archive?.video?.media?.thumbnail?.mediaUrl);

  console.log(archive?.media);
  return (
    <div className="min-h-screen bg-black p-4 text-white">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <Text variant="uppercase" className="text-sm">
          {archive?.heading || ""}
        </Text>
        <Text className="text-sm">{archive?.tag || ""}</Text>
      </div>
      {/* Video Section */}
      {archive?.video && archive?.video?.media?.fullSize?.mediaUrl && (
        <div className="mb-12 w-full">
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
            {/* Sound Control Button */}
            <Button
              onClick={toggleSound}
              className="absolute bottom-2.5 right-2.5 uppercase text-white mix-blend-difference transition-all"
              aria-label={isMuted ? "unmute" : "mute"}
            >
              {isMuted ? "sound off" : "sound on"}
            </Button>
          </div>
          {archive?.description && (
            <Text className="mt-4 text-sm opacity-80">
              {archive?.description}
            </Text>
          )}
        </div>
      )}
      {/* Image Grid */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        {archive?.media?.slice(1).map((mediaItem, index) => (
          <div key={index} className="relative aspect-[3/4]">
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
