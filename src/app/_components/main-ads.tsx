import { common_HeroMainAdd } from "@/api/proto-http/frontend";

import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function MainAds({ main }: { main?: common_HeroMainAdd }) {
  if (!main) return null;

  return (
    <div className="relative h-screen w-full md:-mt-20 md:h-full ">
      <div className="h-screen md:h-[800px]">
        <Image
          src={main.singleAdd?.media?.media?.fullSize?.mediaUrl!}
          alt="main hero image"
          aspectRatio="4/3"
          fit="cover"
          // blurHash={media.media?.blurhash}
        />
      </div>
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="flex w-3/4 flex-col items-start gap-6 p-2 md:flex-row md:justify-between ">
          <Text variant="uppercase" className="text-white">
            collection
          </Text>
          <Text variant="uppercase" className="text-white">
            Light_leather_organza
          </Text>
          <Text variant="uppercase" className="text-white md:w-1/3">
            Actor Ethan Ruan is featured in the next chapter of Community as a
            Form of Research wearing
          </Text>
        </div>
      </div>
    </div>
  );
}
