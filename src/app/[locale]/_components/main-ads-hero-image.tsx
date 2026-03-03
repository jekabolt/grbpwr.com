import type { common_HeroMainWithTranslations } from "@/api/proto-http/frontend";

import { calculateAspectRatio, isVideo } from "@/lib/utils";
import Image from "@/components/ui/image";

export function MainAdsHeroImageMobile({
  main,
}: {
  main?: common_HeroMainWithTranslations | null;
}) {
  const single = main?.single;
  if (!single?.mediaPortrait?.media?.thumbnail?.mediaUrl) return null;

  return (
    <Image
      src={single.mediaPortrait?.media?.thumbnail?.mediaUrl || ""}
      blurhash={single.mediaPortrait?.media?.blurhash}
      type={
        isVideo(single.mediaPortrait?.media?.thumbnail?.mediaUrl)
          ? "video"
          : "image"
      }
      aspectRatio={calculateAspectRatio(
        single.mediaPortrait?.media?.thumbnail?.width,
        single.mediaPortrait?.media?.thumbnail?.height,
      )}
      alt="main hero image"
      fit="cover"
      priority={true}
      loading="eager"
      sizes="100vw"
      autoPlay
    />
  );
}
