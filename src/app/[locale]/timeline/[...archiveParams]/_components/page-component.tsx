"use client";

import { useRef, useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import {
  calculateAspectRatio,
  isVideo,
  resolveArchiveMedia,
} from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

import { ArchiveMediaThumbnail } from "../../_components/archive-media-thumbnail";

function ArchiveMediaGridItem({
  item,
  id,
  heading,
}: {
  item: NonNullable<common_ArchiveFull["media"]>[number];
  id: number;
  heading: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const media = resolveArchiveMedia(item.media);
  const isPriority = id < 4;
  const isVideoItem = media.type === "video";

  return (
    <div
      className="relative aspect-[3/4] w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ArchiveMediaThumbnail
        media={media}
        alt={`${heading} image ${id + 1}`}
        aspectRatio="3/4"
        blurhash={item.media?.blurhash}
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        playOnHover={!isMobile && isVideoItem && isHovered}
        autoPlay={isMobile && isVideoItem}
      />
    </div>
  );
}

export default function PageComponent({
  archive,
}: {
  archive?: common_ArchiveFull;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const currentYear = new Date().getFullYear();
  const currentTranslation =
    archive?.archiveList?.translations?.find(
      (t) => t.languageId === languageId,
    ) || archive?.archiveList?.translations?.[0];

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full space-y-10 text-textColor lg:min-h-screen lg:space-y-14">
      <div className="flex w-full items-center justify-center">
        <div className="flex w-full max-w-[640px] flex-col items-start justify-center gap-10">
          <div className="w-full space-y-4">
            <Text
              className="w-full break-words"
              variant="uppercase"
              component="h1"
            >
              {currentTranslation?.heading || ""}
            </Text>
            <Text variant="uppercase">{`${archive?.archiveList?.tag || ""} / ${currentYear}`}</Text>
          </div>
          {currentTranslation?.description && (
            <Text className="break-words text-left">
              {currentTranslation?.description}
            </Text>
          )}
        </div>
      </div>

      {archive?.mainMedia?.map((item) => {
        const isVideoItem = isVideo(item.media?.thumbnail?.mediaUrl);
        if (isVideoItem) {
          return (
            <div
              key={item.id}
              className="relative aspect-video h-full w-full overflow-hidden lg:h-[80vh]"
            >
              <video
                src={item.media?.thumbnail?.mediaUrl || ""}
                className="h-full w-full object-cover"
                poster={item.media?.thumbnail?.mediaUrl}
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
                className="absolute bottom-2.5 right-2.5 uppercase text-white mix-blend-difference"
                aria-label={isMuted ? "unmute" : "mute"}
              >
                {isMuted ? "sound on" : "sound off"}
              </Button>
            </div>
          );
        }
        return (
          <div key={item.id} className="relative h-full w-full lg:h-[80vh]">
            <ImageComponent
              src={item.media?.thumbnail?.mediaUrl || ""}
              alt={currentTranslation?.heading || "Featured archive image"}
              aspectRatio={calculateAspectRatio(
                item.media?.thumbnail?.width,
                item.media?.thumbnail?.height,
              )}
              priority={true}
              loading="eager"
            />
          </div>
        );
      })}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 lg:gap-4">
        {archive?.media?.map((item, id) => (
          <ArchiveMediaGridItem
            key={item.id ?? id}
            item={item}
            id={id}
            heading={currentTranslation?.heading || ""}
          />
        ))}
      </div>
    </div>
  );
}
