import { common_HeroItem } from "@/api/proto-http/frontend";
import Image from "@/components/ui/Image";
import { calculateAspectRatio } from "@/lib/utils";

export default function AdsSection({
  ads,
}: {
  ads: common_HeroItem[] | undefined;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {ads?.map((a) =>
        a.media?.media?.fullSize ? (
          <div key={a.media.id} className="relative col-span-1 h-[600px]">
            <Image
              src={a.media.media.fullSize.mediaUrl || ""}
              alt="ad hero image"
              aspectRatio={calculateAspectRatio(
                a?.media?.media?.fullSize.width,
                a?.media?.media?.fullSize.height,
              )}
              blurHash={a?.media?.media?.blurhash}
            />
          </div>
        ) : null,
      )}
    </div>
  );
}
