"use client";

import { useEffect, useRef } from "react";
import { blurhashToBase64 } from "blurhash-base64";
import ImageComponent from "@/components/ui/image";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { resolveArchiveMedia } from "@/lib/utils";

type ArchiveMediaThumbnailProps = {
  media: ReturnType<typeof resolveArchiveMedia>;
  alt: string;
  aspectRatio: string;
  blurhash?: string;
  fit?: "cover" | "contain" | "fill" | "scale-down";
  priority?: boolean;
  loading?: "lazy" | "eager";
  playOnHover?: boolean;
  autoPlay?: boolean;
};

export function ArchiveMediaThumbnail({
  media,
  alt,
  aspectRatio,
  blurhash,
  fit = "cover",
  priority,
  loading,
  playOnHover = false,
  autoPlay = false,
}: ArchiveMediaThumbnailProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (media.type !== "video" || !videoRef.current) return;
    // An autoplay video can start before `reduce` resolves (the SSR snapshot is
    // false), so flipping the prop alone won't stop it — pause via the ref.
    if (autoPlay && !reduce) return;
    if (playOnHover && !reduce) videoRef.current.play();
    else videoRef.current.pause();
  }, [media.type, playOnHover, autoPlay, reduce]);
  if (!media.src) {
    return null;
  }

  if (media.type === "video") {
    return (
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src={media.src}
        poster={media.poster ?? (blurhash ? blurhashToBase64(blurhash) : undefined)}
        autoPlay={autoPlay && !reduce}
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }

  return (
    <ImageComponent
      alt={alt}
      src={media.src}
      blurhash={blurhash}
      aspectRatio={aspectRatio}
      fit={fit}
      priority={priority}
      loading={loading}
    />
  );
}
