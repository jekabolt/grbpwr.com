"use client";

import Image from "next/image";
import { decode } from "blurhash";
import { useEffect, useState } from "react";

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
  sizes?: string;
  fit?: "cover" | "contain" | "fill" | "scale-down";
  priority?: boolean;
  loading?: "lazy" | "eager";
  fetchPriority?: "high" | "low" | "auto";
  blurhash?: string;
};

// Helper function to convert blurhash to data URL
function blurhashToDataUrl(blurhash: string, width = 32, height = 32): string {
  try {
    const pixels = decode(blurhash, width, height);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    
    const imageData = ctx.createImageData(width, height);
    imageData.data.set(pixels);
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL();
  } catch {
    return "";
  }
}

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 1280px",
  fit,
  priority = false,
  loading = "lazy",
  fetchPriority,
  blurhash,
}: ImageProps) {
  const [blurDataURL, setBlurDataURL] = useState<string>("");

  useEffect(() => {
    if (blurhash && typeof window !== "undefined") {
      const dataUrl = blurhashToDataUrl(blurhash);
      setBlurDataURL(dataUrl);
    }
  }, [blurhash]);

  return (
    <ImageContainer aspectRatio={fit !== "cover" ? aspectRatio : undefined}>
      <Image
        fill
        src={src}
        alt={alt}
        className="h-full w-full"
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : loading}
        quality={priority ? 85 : 75}
        fetchPriority={fetchPriority || (priority ? "high" : "auto")}
        style={{
          objectFit: fit,
        }}
        placeholder={blurDataURL ? "blur" : "empty"}
        blurDataURL={blurDataURL || undefined}
        unoptimized={false}
      />
    </ImageContainer>
  );
}
