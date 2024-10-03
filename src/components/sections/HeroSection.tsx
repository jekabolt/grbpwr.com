// import { common_HeroItem } from "@/api/proto-http/frontend";
import Image from "@/components/ui/Image";

export default function Hero({ media }: any) {
  if (!media) return null;

  return (
    <div className="flex h-screen items-center justify-center bg-slate-50">
      <div className="h-[600px]">
        <Image
          fit="contain"
          src={media.media?.fullSize?.mediaUrl!}
          alt="main hero image"
          aspectRatio="4/3"
          blurHash={media.media?.blurhash}
        />
      </div>
    </div>
  );
}
