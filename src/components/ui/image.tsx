import Image from "next/image";

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
};

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  sizes = "(max-width: 1280px) 100vw, 1280px",
  fit,
  priority = false,
  loading = "lazy",
}: ImageProps) {
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
        style={{
          objectFit: fit,
        }}
      />
    </ImageContainer>
  );
}
