import {
  common_HeroDoubleAdd,
  common_HeroSingleAdd,
} from "@/api/proto-http/frontend";
import Image from "@/components/ui/Image";
import { calculateAspectRatio } from "@/lib/utils";

export default function AdsSection({
  singleAd,
  doubleAd,
}: {
  singleAd?: common_HeroSingleAdd;
  doubleAd?: common_HeroDoubleAdd;
}) {
  return (
    <>
      {singleAd && (
        <div key={singleAd.media?.id} className="h-[600px]">
          <Image
            src={singleAd.media?.media?.fullSize?.mediaUrl || ""}
            alt="ad hero image"
            aspectRatio={calculateAspectRatio(
              singleAd.media?.media?.fullSize?.width,
              singleAd.media?.media?.fullSize?.height,
            )}
            // blurHash={media.media?.blurhash}
          />
        </div>
      )}
      {doubleAd && (
        <div className="grid grid-cols-2 gap-3">
          <div
            key={doubleAd.left?.media?.id}
            className="relative col-span-1 h-[600px]"
          >
            <Image
              src={doubleAd.left?.media?.media?.fullSize?.mediaUrl || ""}
              alt="ad hero image"
              aspectRatio={calculateAspectRatio(
                doubleAd.left?.media?.media?.fullSize?.width,
                doubleAd.left?.media?.media?.fullSize?.height,
              )}
              // blurHash={media.media?.blurhash}
            />
          </div>
          <div
            key={doubleAd.right?.media?.id}
            className="relative col-span-1 h-[600px]"
          >
            <Image
              src={doubleAd.right?.media?.media?.fullSize?.mediaUrl || ""}
              alt="ad hero image"
              aspectRatio={calculateAspectRatio(
                doubleAd.right?.media?.media?.fullSize?.width,
                doubleAd.right?.media?.media?.fullSize?.height,
              )}
              // blurHash={media.media?.blurhash}
            />
          </div>
        </div>
      )}
    </>
  );
}
