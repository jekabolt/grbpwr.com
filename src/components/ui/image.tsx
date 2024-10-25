import Image from "next/image";

function ImageContainer({
  aspectRatio,
  children,
}: {
  aspectRatio: string;
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
  fit?: "cover" | "contain";
};

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  sizes = "(max-width: 1280px) 100vw, 1280px",
  fit,
}: ImageProps) {
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
      />
    </ImageContainer>
  );
}
