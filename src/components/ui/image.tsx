"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { blurhashToBase64 } from "blurhash-base64";

import { startPixelMosaic } from "./pixel-mosaic";

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
  pixelPreview?: string;
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
  pixelPreview,
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
  const imageRef = useRef<HTMLImageElement>(null);
  const mosaicRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (type !== "video" || !v) return;
    // Autoplay clips keep playing; hover clips play only while hovered. Without
    // the autoPlay guard this effect paused every autoplaying video on mount.
    if (playOnHover || autoPlay) v.play().catch(() => {});
    else v.pause();
  }, [type, playOnHover, autoPlay]);

  useEffect(() => {
    const image = imageRef.current;
    const canvas = mosaicRef.current;
    if (type !== "image" || !image || !canvas) return;
    return startPixelMosaic({ canvas, image, pixelPreview, blurhash });
  }, [type, src, pixelPreview, blurhash]);

  return (
    <ImageContainer aspectRatio={fit !== "cover" ? aspectRatio : undefined}>
      {type === "image" ? (
        <>
          <Image
            ref={imageRef}
            fill
            src={src}
            alt={alt}
            className="h-full w-full"
            sizes={sizes}
            priority={priority}
            loading={priority ? undefined : loading}
            onLoad={() => {
              if (mosaicRef.current) mosaicRef.current.hidden = true;
            }}
            style={{
              objectFit: fit,
            }}
          />
          <canvas
            ref={mosaicRef}
            className="pointer-events-none absolute inset-0 h-full w-full [image-rendering:crisp-edges] [image-rendering:pixelated]"
            hidden
            aria-hidden="true"
          />
        </>
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          // Use the blurhash as the poster so a frame paints instantly; the
          // video URL itself is not a valid poster image and left it blank.
          poster={blurhash ? blurhashToBase64(blurhash) : undefined}
          autoPlay={autoPlay}
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
