"use client";

import ImageComponent from "@/components/ui/image";
import { resolveArchiveMedia } from "@/lib/utils";

type ArchiveMediaThumbnailProps = {
  media: ReturnType<typeof resolveArchiveMedia>;
  alt: string;
  aspectRatio: string;
  blurhash?: string;
  fit?: "cover" | "contain" | "fill" | "scale-down";
  priority?: boolean;
  loading?: "lazy" | "eager";
};

export function ArchiveMediaThumbnail({
  media,
  alt,
  aspectRatio,
  blurhash,
  fit = "cover",
  priority,
  loading,
}: ArchiveMediaThumbnailProps) {
  if (!media.src) {
    return null;
  }

  if (media.type === "video") {
    return (
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={media.src}
        poster={media.poster}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
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
