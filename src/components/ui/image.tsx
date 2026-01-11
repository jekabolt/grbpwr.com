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
  fetchPriority?: "high" | "low" | "auto";
};

export default function ImageComponent({
  aspectRatio,
  src,
  alt,
  sizes = "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 1280px",
  fit,
  priority = false,
  loading = "lazy",
  fetchPriority,
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
        quality={priority ? 85 : 75}
        fetchPriority={fetchPriority || (priority ? "high" : "auto")}
        style={{
          objectFit: fit,
        }}
        unoptimized={false}
      />
    </ImageContainer>
  );
}
