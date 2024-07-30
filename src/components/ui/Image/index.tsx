import Image from "next/image";
import ImageContainer from "./ImageContainer";

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  sizes = "(max-width: 1280px) 100vw, 1280px",
  fit,
}: {
  alt: string;
  src: string;
  aspectRatio: string;
  sizes?: string;
  fit?: "cover" | "contain";
}) {
  return (
    <ImageContainer aspectRatio={aspectRatio}>
      <Image
        // loader={storyBlokImageLoader}
        // blurDataURL={`${asset.filename}/m/filters:quality(5):blur(10)`}
        // loading={isPrioritized ? "eager" : "lazy"}
        fill
        src={src}
        alt={alt}
        className="h-full w-full"
        sizes={sizes}
        style={{
          objectFit: fit,
        }}
      />
    </ImageContainer>
  );
}
