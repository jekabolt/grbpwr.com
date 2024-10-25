import type { common_HeroEntity } from "@/api/proto-http/frontend";
import Image from "@/components/ui/image";
import { calculateAspectRatio } from "@/lib/utils";

import ProductsGrid from "@/features/products-grid";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  return <div>{entities?.map((e, i) => {
    switch (e.type) {
      case "HERO_TYPE_SINGLE_ADD":
        return (
          <div key={e.singleAdd?.media?.id} className="h-[600px]">
            <Image
              src={e.singleAdd?.media?.media?.fullSize?.mediaUrl || ""}
              alt="ad hero image"
              aspectRatio={calculateAspectRatio(
                e.singleAdd?.media?.media?.fullSize?.width,
                e.singleAdd?.media?.media?.fullSize?.height,
              )}
              // blurHash={media.media?.blurhash}
            />
          </div>
        );
      case "HERO_TYPE_DOUBLE_ADD":
        return (
          <div key={e.doubleAdd?.left?.media?.id} className="grid grid-cols-2 gap-3">
          <div
            
            className="relative col-span-1 h-[600px]"
          >
            <Image
              src={e.doubleAdd?.left?.media?.media?.fullSize?.mediaUrl || ""}
              alt="ad hero image"
              aspectRatio={calculateAspectRatio(
                e.doubleAdd?.left?.media?.media?.fullSize?.width,
                e.doubleAdd?.left?.media?.media?.fullSize?.height,
              )}
              // blurHash={media.media?.blurhash}
            />
          </div>
          <div
            key={e.doubleAdd?.right?.media?.id}
            className="relative col-span-1 h-[600px]"
          >
            <Image
              src={e.doubleAdd?.right?.media?.media?.fullSize?.mediaUrl || ""}
              alt="ad hero image"
              aspectRatio={calculateAspectRatio(
                e.doubleAdd?.right?.media?.media?.fullSize?.width,
                e.doubleAdd?.right?.media?.media?.fullSize?.height,
              )}
            />
          </div>
        </div>
        )
        case "HERO_TYPE_FEATURED_PRODUCTS":
          return (
            <ProductsGrid key={i} products={e.featuredProducts?.products} />
          );
        default:
          return null;
      }
    })}
    </div>;
}
