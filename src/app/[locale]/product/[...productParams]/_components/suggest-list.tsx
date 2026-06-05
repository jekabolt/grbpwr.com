import Link from "next/link";
import { common_Product } from "@/api/proto-http/frontend";
import { getTranslations } from "next-intl/server";

import { calculateAspectRatio, cn } from "@/lib/utils";
import Image from "@/components/ui/image";
import { Overlay } from "@/components/ui/overlay";
import { Text } from "@/components/ui/text";

// "Recommended" related products. Server-rendered (links land in the static HTML
// so they count as in-body internal links) with the recently-viewed look:
// thumbnail image cards. 3 smaller cards on mobile, up to 4 on desktop.
export async function SuggestList({
  products,
  locale,
}: {
  products: common_Product[];
  locale: string;
}) {
  if (!products.length) {
    return null;
  }

  const t = await getTranslations({ locale, namespace: "product" });

  return (
    <div className="flex flex-col items-center gap-y-8 pb-14 pt-8 lg:gap-y-12 lg:pb-16 lg:pt-16">
      <Text
        component="h2"
        className="w-full text-left lg:text-center"
        variant="uppercase"
      >
        {t("recommended")}
      </Text>

      <div className="flex justify-center gap-2 lg:gap-7">
        {products.map((product, index) => {
          const thumb = product.productDisplay?.thumbnail?.media;
          const img =
            thumb?.thumbnail?.mediaUrl ||
            thumb?.compressed?.mediaUrl ||
            thumb?.fullSize?.mediaUrl ||
            "";

          return (
            <Link
              key={product.id}
              href={product.slug || ""}
              className={cn("group relative w-[31%] lg:w-52", {
                "hidden lg:block": index >= 3,
              })}
            >
              <div className="relative">
                <Image
                  src={img}
                  alt=""
                  aspectRatio={calculateAspectRatio(
                    thumb?.thumbnail?.width,
                    thumb?.thumbnail?.height,
                  )}
                  blurhash={thumb?.blurhash}
                  fit="contain"
                />
                <div className="hidden lg:block">
                  <Overlay cover="container" color="highlight" trigger="hover" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
