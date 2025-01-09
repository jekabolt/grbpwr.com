import Link from "next/link";
import { common_HeroMain } from "@/api/proto-http/frontend";

import { Button } from "@/components/ui/button";
import Image from "@/components/ui/image";
import { Text } from "@/components/ui/text";

export function MainAds({ main }: { main?: common_HeroMain }) {
  if (!main) return null;

  return (
    <div className="h-screen w-full">
      <div className="h-full">
        <Image
          src={main.single?.media?.media?.fullSize?.mediaUrl!}
          alt="main hero image"
          aspectRatio="4/3"
          fit="cover"
          // blurHash={media.media?.blurhash}
        />
      </div>
      <div className="absolute inset-0 z-10 h-screen bg-black opacity-40"></div>
      <div className="absolute inset-0 flex h-screen items-center">
        <div className="flex flex-col items-start gap-6 p-2 md:flex-row md:justify-between ">
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
