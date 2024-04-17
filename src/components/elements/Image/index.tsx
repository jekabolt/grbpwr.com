import Image from "next/image";

import ImageContainer from "./ImageContainer";

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
}: {
  aspectRatio: string;
  src: string;
  alt: string;
}) {
  return (
    <ImageContainer aspectRatio={aspectRatio}>
      <Image
        fill
        // loader={storyBlokImageLoader}
        // blurDataURL={`${asset.filename}/m/filters:quality(5):blur(10)`}
        src={src}
        alt={alt}
        className="h-full w-full"
        style={{
          // todo: handle multiple images
          objectFit: undefined,
          //   marginTop: 0,
          //   marginBottom: 0,
          //   objectFit: fit || undefined,
        }}
        // loading={isPrioritized ? "eager" : "lazy"}
      />
    </ImageContainer>
  );
}
