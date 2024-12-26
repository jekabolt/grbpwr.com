import type { common_HeroEntity } from "@/api/proto-http/frontend";

import { calculateAspectRatio } from "@/lib/utils";
import Image from "@/components/ui/image";
import ProductsGrid from "@/app/_components/product-grid";

export function Ads({ entities }: { entities: common_HeroEntity[] }) {
  return (
    <div>
      {entities?.map((e, i) => {
        switch (e.type) {
          case "HERO_TYPE_SINGLE":
            return (
              <div key={e.single?.media?.id} className="h-[600px]">
                <Image
                  src={e.single?.media?.media?.fullSize?.mediaUrl || ""}
                  alt="ad hero image"
                  aspectRatio={calculateAspectRatio(
                    e.single?.media?.media?.fullSize?.width,
                    e.single?.media?.media?.fullSize?.height,
                  )}
                  // blurHash={media.media?.blurhash}
                />
              </div>
            );
          case "HERO_TYPE_DOUBLE":
            return (
              <div
                key={e.double?.left?.media?.id}
                className="grid grid-cols-2 gap-3"
              >
                <div className="relative col-span-1 h-[600px]">
                  <Image
                    src={e.double?.left?.media?.media?.fullSize?.mediaUrl || ""}
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.double?.left?.media?.media?.fullSize?.width,
                      e.double?.left?.media?.media?.fullSize?.height,
                    )}
                    // blurHash={media.media?.blurhash}
                  />
                </div>
                <div
                  key={e.double?.right?.media?.id}
                  className="relative col-span-1 h-[600px]"
                >
                  <Image
                    src={
                      e.double?.right?.media?.media?.fullSize?.mediaUrl || ""
                    }
                    alt="ad hero image"
                    aspectRatio={calculateAspectRatio(
                      e.double?.right?.media?.media?.fullSize?.width,
                      e.double?.right?.media?.media?.fullSize?.height,
                    )}
                  />
                </div>
              </div>
            );
          case "HERO_TYPE_FEATURED_PRODUCTS":
            return (
              <ProductsGrid key={i} products={e.featuredProducts?.products} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
