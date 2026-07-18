import Link from "next/link";
import { StorefrontArchiveList } from "@/api/proto-http/frontend";

import { useTranslationsStore } from "@/lib/stores/translations/store-provider";
import { calculateAspectRatio, isVideo } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

interface Props {
  className?: string;
  archive?: StorefrontArchiveList;
  highlightedItem?: boolean;
}

export function FullSizeItem({ className, archive, highlightedItem }: Props) {
  const { languageId } = useTranslationsStore((state) => state);
  const currentTranslation =
    archive?.translations?.find((t) => t.languageId === languageId) ||
    archive?.translations?.[0];
  const thumbnailUrl = archive?.thumbnail?.media?.fullSize?.mediaUrl || "";
  const isVideoItem = isVideo(thumbnailUrl);

  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-y-9 bg-bgColor text-textColor lg:flex-row lg:gap-4">
      <Text className="w-60 text-center lg:text-left">
        {currentTranslation?.heading}
      </Text>
      <div className={className}>
        <Link href={archive?.slug || ""}>
          <ImageComponent
            src={thumbnailUrl}
            alt={currentTranslation?.heading || ""}
            aspectRatio={calculateAspectRatio(
              archive?.thumbnail?.media?.fullSize?.width,
              archive?.thumbnail?.media?.fullSize?.height,
            )}
            type={isVideoItem ? "video" : "image"}
            playOnHover={isVideoItem && !!highlightedItem}
          />
        </Link>
      </div>
      {highlightedItem && (
        <Text className="w-60 text-center lg:text-right">{archive?.tag}</Text>
      )}
    </div>
  );
}
