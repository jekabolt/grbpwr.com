import Link from "next/link";
import { common_ArchiveList } from "@/api/proto-http/frontend";

import { useCurrency } from "@/lib/stores/currency/store-provider";
import { calculateAspectRatio } from "@/lib/utils";
import ImageComponent from "@/components/ui/image";
import { Text } from "@/components/ui/text";

interface Props {
  className?: string;
  archive?: common_ArchiveList;
  highlightedItem?: boolean;
}

export function FullSizeItem({ className, archive, highlightedItem }: Props) {
  const { selectedLanguage } = useCurrency((state) => state);
  return (
    <div className="flex h-full w-full flex-col items-center justify-between gap-y-9 bg-bgColor text-textColor lg:flex-row lg:gap-4">
      <Text className="w-60 text-center lg:text-left">
        {archive?.translations?.[selectedLanguage.id]?.heading}
      </Text>
      <div className={className}>
        <Link href={archive?.slug || ""}>
          <ImageComponent
            src={archive?.thumbnail?.media?.fullSize?.mediaUrl || ""}
            alt={archive?.translations?.[selectedLanguage.id]?.heading || ""}
            aspectRatio={calculateAspectRatio(
              archive?.thumbnail?.media?.fullSize?.width,
              archive?.thumbnail?.media?.fullSize?.height,
            )}
          />
        </Link>
      </div>
      {highlightedItem && (
        <Text className="w-60 text-center lg:text-right">{archive?.tag}</Text>
      )}
    </div>
  );
}
