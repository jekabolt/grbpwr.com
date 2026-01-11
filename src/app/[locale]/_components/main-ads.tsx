"use client";

import { common_HeroMainWithTranslations } from "@/api/proto-http/frontend";

import { sendHeroEvent } from "@/lib/analitycs/hero";
import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export function MainAds({ main }: { main?: common_HeroMainWithTranslations }) {
  const { languageId } = useTranslationsStore((state) => state);

  if (!main) return null;

  const currentTranslation = main.translations?.find(
    (t) => t.languageId === languageId,
  );

  return (
    <AnimatedButton
      href={main.single?.exploreLink || ""}
      className="relative h-screen w-full"
      onClick={() => sendHeroEvent({ heroType: "HERO_TYPE_MAIN" })}
    >
      <div className="hidden h-full lg:block">
        <Image
          src={main.single?.mediaLandscape?.media?.fullSize?.mediaUrl || ""}
          aspectRatio={calculateAspectRatio(
            main.single?.mediaLandscape?.media?.fullSize?.width,
            main.single?.mediaLandscape?.media?.fullSize?.height,
          )}
          alt="main hero image"
          fit="cover"
          priority={true}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="block h-full lg:hidden">
        <Image
          src={main.single?.mediaPortrait?.media?.fullSize?.mediaUrl || ""}
          aspectRatio={calculateAspectRatio(
            main.single?.mediaPortrait?.media?.fullSize?.width,
            main.single?.mediaPortrait?.media?.fullSize?.height,
          )}
          alt="main hero image"
          fit="cover"
          priority={true}
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <Overlay cover="container" />
      <div className="absolute inset-x-0 top-32 z-20 flex h-screen items-center lg:top-20">
        <div className="flex w-full flex-col items-start gap-6 p-2 text-bgColor md:flex-row md:justify-between">
          <Text variant="uppercase">{currentTranslation?.tag}</Text>
          <Text variant="uppercase">{currentTranslation?.headline}</Text>
          <Text variant="uppercase" className="md:w-1/3">
            {currentTranslation?.description}
          </Text>
          <Text variant="underlined" className="uppercase">
            {currentTranslation?.exploreText}
          </Text>
        </div>
      </div>
    </AnimatedButton>
  );
}
