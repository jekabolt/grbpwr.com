"use client";

import { useEffect, useRef, useState } from "react";
import { common_ArchiveFull } from "@/api/proto-http/frontend";
import { blurhashToBase64 } from "blurhash-base64";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("archive");
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
        alt={t("imageAlt", { heading, index: id + 1 })}
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

function MainMediaVideo({
  item,
  heading,
}: {
  item: NonNullable<common_ArchiveFull["mainMedia"]>[number];
  heading: string;
}) {
  const t = useTranslations("archive");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  // The force-static HTML ships `autoPlay` present, so pause via the ref on
  // mount when reduce-motion is on — flipping the prop alone won't stop an
  // already-playing video pre-reconcile.
  useEffect(() => {
    if (reduce && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [reduce]);

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const controlClassName =
    "block min-h-11 min-w-11 px-2.5 text-center leading-[44px] uppercase text-white mix-blend-difference";

  return (
    <div className="relative aspect-video h-full w-full overflow-hidden lg:h-[80vh]">
      <video
        ref={videoRef}
        src={item.media?.thumbnail?.mediaUrl || ""}
        className="h-full w-full object-cover"
        poster={
          item.media?.blurhash
            ? blurhashToBase64(item.media.blurhash)
            : undefined
        }
        aria-label={t("videoLabel", { heading })}
        autoPlay={!reduce}
        playsInline
        controls={false}
        muted
        loop
        preload="metadata"
      >
        {t("videoUnsupported")}
      </video>
      <div className="absolute bottom-2.5 right-2.5 flex gap-2">
        <Button
          onClick={togglePlay}
          className={controlClassName}
          aria-label={isPlaying ? t("pause") : t("play")}
        >
          {isPlaying ? t("pause") : t("play")}
        </Button>
        <Button
          onClick={toggleSound}
          className={controlClassName}
          aria-label={isMuted ? t("unmuteAria") : t("muteAria")}
        >
          {isMuted ? t("soundOn") : t("soundOff")}
        </Button>
      </div>
    </div>
  );
}

export default function PageComponent({
  archive,
}: {
  archive?: common_ArchiveFull;
}) {
  const t = useTranslations("archive");
  const { languageId } = useTranslationsStore((state) => state);
  const currentYear = new Date().getFullYear();
  const currentTranslation =
    archive?.archiveList?.translations?.find(
      (t) => t.languageId === languageId,
    ) || archive?.archiveList?.translations?.[0];

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
            <MainMediaVideo
              key={item.id}
              item={item}
              heading={currentTranslation?.heading || ""}
            />
          );
        }
        return (
          <div key={item.id} className="relative h-full w-full lg:h-[80vh]">
            <ImageComponent
              src={item.media?.thumbnail?.mediaUrl || ""}
              alt={currentTranslation?.heading || t("featuredImageAlt")}
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
