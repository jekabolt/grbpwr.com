import { common_HeroMainWithTranslations } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { AnimatedButton } from "@/components/ui/animated-button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export function MainAds({ main }: { main?: common_HeroMainWithTranslations }) {
  if (!main) return null;

  return (
    <AnimatedButton
      href={main.single?.exploreLink || ""}
      className="relative h-screen w-full"
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
        />
      </div>
      <Overlay cover="container" />
      <div className="absolute inset-x-0 top-32 z-20 flex h-screen items-center lg:top-20">
        <div className="flex w-full flex-col items-start gap-6 p-2 text-bgColor md:flex-row md:justify-between">
          <Text variant="uppercase">{main.translations?.[0]?.tag}</Text>
          <Text variant="uppercase">{main.translations?.[0]?.headline}</Text>
          <Text variant="uppercase" className="md:w-1/3">
            {main.translations?.[0]?.description}
          </Text>
          <Text variant="underlined" className="uppercase">
            {main.translations?.[0]?.exploreText}
          </Text>
        </div>
      </div>
    </AnimatedButton>
  );
}
