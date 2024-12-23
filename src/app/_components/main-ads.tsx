import { common_HeroMainAdd } from "@/api/proto-http/frontend";

import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function MainAds({ main }: { main?: common_HeroMainAdd }) {
  if (!main) return null;

  return (
    <div className="relative -mt-20 h-full w-full ">
      <div className="h-[800px]">
        <Image
          src={main.singleAdd?.media?.media?.fullSize?.mediaUrl!}
          alt="main hero image"
          aspectRatio="4/3"
          // blurHash={media.media?.blurhash}
        />
      </div>
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="flex w-3/4 items-start justify-between ">
          <Text variant="uppercase" className="text-white">
            collection
          </Text>
          <Text variant="uppercase" className="text-white">
            Light_leather_organza
          </Text>
          <Text variant="uppercase" className="text-white">
            Actor Ethan Ruan is featured in the <br /> next chapter of Community
            as a <br /> Form of Research wearing
          </Text>
        </div>
      </div>
    </div>
  );
}
