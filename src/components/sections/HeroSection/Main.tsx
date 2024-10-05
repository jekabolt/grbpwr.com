import { common_HeroMainAdd } from "@/api/proto-http/frontend";
import Image from "@/components/ui/Image";

export default function AdsSection({ main }: { main?: common_HeroMainAdd }) {
  if (!main) return null;

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="h-[600px]">
        <Image
          fit="contain"
          src={main.singleAdd?.media?.media?.fullSize?.mediaUrl!}
          alt="main hero image"
          aspectRatio="4/3"
          // blurHash={media.media?.blurhash}
        />
      </div>
    </div>
  );
}
