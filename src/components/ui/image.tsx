import { useEffect, useRef } from "react";
import Image from "next/image";
import { blurhashToBase64 } from "blurhash-base64";

function getBlurDataURL(hash: string | undefined): string | undefined {
  if (!hash) return undefined;
  try {
    return blurhashToBase64(hash);
  } catch {
    return undefined;
  }
}

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
  const blurDataURL = getBlurDataURL(blurhash);

  useEffect(() => {
    if (type !== "video" || !videoRef.current) return;
    if (playOnHover) videoRef.current.play();
    else videoRef.current.pause();
  }, [type, playOnHover]);

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
          placeholder={blurDataURL ? "blur" : undefined}
          blurDataURL={blurDataURL}
          style={{
            objectFit: fit,
          }}
        />
      ) : (
        <video
          ref={videoRef}
          src={src}
          className="h-full w-full object-cover"
          poster={src}
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
