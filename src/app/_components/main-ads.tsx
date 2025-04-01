import Link from "next/link";
import { common_HeroMain } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

export function MainAds({ main }: { main?: common_HeroMain }) {
  if (!main) return null;

  return (
    <div className="relative h-screen w-full">
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
        <div className="flex w-full flex-col items-start gap-6 p-2 md:flex-row md:justify-between">
          <Text variant="uppercase" className="text-white">
            {main.tag}
          </Text>
          <Text variant="uppercase" className="text-white">
            {main.single?.headline}
          </Text>
          <Text variant="uppercase" className="text-white md:w-1/3">
            {main.description}
          </Text>
          <Button variant="underline" className="uppercase text-white" asChild>
            <Link href={main.single?.exploreLink || ""}>
              {main.single?.exploreText}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
