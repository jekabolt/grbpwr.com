"use client";

import { useState } from "react";
import { common_HeroMainWithTranslations } from "@/api/proto-http/frontend";

import { sendHeroEvent } from "@/lib/analitycs/hero";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, internalHref, isVideo } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export function MainAds({
  main,
  priority = true,
  children,
}: {
  main?: common_HeroMainWithTranslations;
  // The LCP hero (first block) eager-loads; later MAIN blocks lazy-load.
  priority?: boolean;
  children?: React.ReactNode;
}) {
  const { languageId } = useTranslationsStore((state) => state);
  const [isHovered, setIsHovered] = useState(false);

  if (!main) return null;

  const currentTranslation = main.translations?.find(
    (t) => t.languageId === languageId,
  );

  // Mobile hero uses the portrait media (falls back to landscape if missing).
  const mobileMedia =
    main.media?.portrait?.media || main.media?.landscape?.media;

  return (
    <AnimatedButton
      href={internalHref(main.exploreLink)}
      className="relative h-screen w-full overflow-hidden"
      onClick={() => sendHeroEvent({ heroType: "HERO_TYPE_MAIN" })}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="hidden h-full lg:block">
        <Image
          src={main.media?.landscape?.media?.fullSize?.mediaUrl || ""}
          blurhash={main.media?.landscape?.media?.blurhash}
          type={
            isVideo(main.media?.landscape?.media?.fullSize?.mediaUrl)
              ? "video"
              : "image"
          }
          aspectRatio={calculateAspectRatio(
            main.media?.landscape?.media?.fullSize?.width,
            main.media?.landscape?.media?.fullSize?.height,
          )}
          alt={
            currentTranslation?.headline || currentTranslation?.tag || "GRBPWR"
          }
          fit="cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          playOnHover={isHovered}
        />
      </div>
      <div className="block h-full lg:hidden">
        <Image
          src={mobileMedia?.fullSize?.mediaUrl || ""}
          blurhash={mobileMedia?.blurhash}
          type={isVideo(mobileMedia?.fullSize?.mediaUrl) ? "video" : "image"}
          aspectRatio={calculateAspectRatio(
            mobileMedia?.fullSize?.width,
            mobileMedia?.fullSize?.height,
          )}
          alt={
            currentTranslation?.headline || currentTranslation?.tag || "GRBPWR"
          }
          fit="cover"
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          playOnHover={isHovered}
          autoPlay={true}
        />
      </div>
      <div className="block h-full lg:hidden">{children}</div>
      {!main.media?.disableOverlay && <Overlay cover="container" />}
      <div className="absolute inset-x-0 top-32 z-20 flex h-screen items-center lg:top-20">
        <div className="flex w-full flex-col items-start gap-6 p-2 text-bgColor md:flex-row md:justify-between">
          <Text variant="uppercase">{currentTranslation?.tag}</Text>
          <Text variant="uppercase" component="h1">
            {currentTranslation?.headline}
          </Text>
          <Text variant="uppercase" className="md:w-1/3">
            {currentTranslation?.body}
          </Text>
          <Text variant="underlined" className="uppercase">
            {currentTranslation?.exploreText}
          </Text>
        </div>
      </div>
    </AnimatedButton>
  );
}
