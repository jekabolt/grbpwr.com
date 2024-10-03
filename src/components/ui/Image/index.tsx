// import { blurhashToBase64 } from "blurhash-base64";
import Image from "next/image";
import ImageContainer from "./ImageContainer";

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  sizes = "(max-width: 1280px) 100vw, 1280px",
  fit,
  // blurHash,
}: {
  alt: string;
  src: string;
  aspectRatio: string;
  sizes?: string;
  fit?: "cover" | "contain";
  // blurHash?: string;
}) {
  return (
    <ImageContainer aspectRatio={aspectRatio}>
      <Image
        fill
        src={src}
        alt={alt}
        className="h-full w-full"
        sizes={sizes}
        style={{
          objectFit: fit,
        }}
        // placeholder={blurHash ? "blur" : undefined}
        // blurDataURL={blurHash ? blurhashToBase64(blurHash) : undefined}
      />
    </ImageContainer>
  );
}
