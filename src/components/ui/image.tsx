"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { blurhashToBase64 } from "blurhash-base64";

import { useMediaQuery } from "@/lib/hooks/useMediaQuery";

function ImageContainer({
  aspectRatio,
  children,
}: {
  aspectRatio?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full" style={{ aspectRatio }}>
      {children}
    </div>
  );
}

type ImageProps = {
  alt: string;
  src: string;
  aspectRatio: string;
  blurhash?: string;
  sizes?: string;
  fit?: "cover" | "contain" | "fill" | "scale-down";
  priority?: boolean;
  loading?: "lazy" | "eager";
  type?: "image" | "video";
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  preload?: "metadata" | "auto" | "none";
  playOnHover?: boolean;
  [key: string]: any;
};

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  blurhash,
  sizes = "(max-width: 1280px) 100vw, 1280px",
  fit,
  priority = false,
  loading = "lazy",
  type = "image",
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  preload = "metadata",
  playOnHover = false,
  ...props
}: ImageProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");

  useEffect(() => {
    if (type !== "video" || !videoRef.current) return;
    if (playOnHover && !reduce) videoRef.current.play();
    else videoRef.current.pause();
  }, [type, playOnHover, reduce]);

  return (
    <ImageContainer aspectRatio={fit !== "cover" ? aspectRatio : undefined}>
      {type === "image" ? (
        <Image
          fill
          src={src}
          alt={alt}
          className="h-full w-full"
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : loading}
          placeholder={blurhash ? "blur" : undefined}
          blurDataURL={blurhash ? blurhashToBase64(blurhash) : undefined}
          style={{
            objectFit: fit,
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          // Use the blurhash as the poster so a frame paints instantly; the
          // video URL itself is not a valid poster image and left it blank.
          poster={blurhash ? blurhashToBase64(blurhash) : undefined}
          autoPlay={reduce ? false : autoPlay}
          muted={muted}
          loop={loop}
          controls={controls}
          preload={preload}
          playsInline
          {...props}
        />
      )}
    </ImageContainer>
  );
}
